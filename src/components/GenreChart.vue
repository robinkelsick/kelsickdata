<template>
  <section class="bg-gray-900 text-white py-10 flex flex-col items-center">
    <h2 class="text-3xl font-bold mb-6">Average Rating by Genre</h2>

    <div ref="chartWrapper" class="max-w-3xl w-full mb-10 mx-auto">
      <canvas ref="chartCanvas" class="w-full" style="height: 100%; display: block"></canvas>
    </div>

    <!-- Add Entry Form -->
    <form
      @submit.prevent="addEntry"
      class="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg w-full max-w-md"
    >
      <h3 class="text-xl font-semibold">Add Your Own Rating</h3>
      <input
        v-model="newAnime.title"
        placeholder="Title"
        class="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        v-model="newAnime.genre"
        placeholder="Genre"
        class="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        v-model.number="newAnime.rating"
        placeholder="Rating (1-10)"
        type="number"
        min="1"
        max="10"
        class="p-2 rounded bg-gray-700 text-white"
        required
      />
      <button
        type="submit"
        class="bg-indigo-600 hover:bg-indigo-700 transition-colors py-2 rounded"
      >
        Add Entry
      </button>
    </form>

    <div class="w-full max-w-md mt-3 flex items-center justify-between gap-3">
      <button
        type="button"
        @click="downloadCSV"
        class="bg-green-600 hover:bg-green-700 transition-colors py-2 px-4 rounded"
      >
        Download CSV
      </button>

      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-300">Saved:</span>
        <span class="bg-gray-700 text-sm px-2 py-1 rounded">{{ userEntriesCount }}</span>
        <button
          type="button"
          @click="clearSavedEntries"
          class="bg-red-600 hover:bg-red-700 transition-colors py-2 px-3 rounded text-sm"
        >
          Clear saved entries
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import Papa from 'papaparse'

const chartCanvas = ref(null)
const chartWrapper = ref(null)
const chartInstance = ref(null)
const chartData = ref([])
const newAnime = ref({ title: '', genre: '', rating: null })
// Local storage key for user-added entries
const STORAGE_KEY = 'genreChartUserEntries'
// Count of saved user entries (displayed in the UI)
const userEntriesCount = ref(0)
// How many top genres to show on the chart
const TOP_N = 10
// Pastel palette inspired by soft anime color palettes
const PASTEL_COLORS = [
  '#FFB3BA', // soft pink
  '#FFDFBA', // peach
  '#FFFFBA', // pale yellow
  '#BAFFC9', // mint
  '#BAE1FF', // baby blue
  '#E3B8FF', // lavender
  '#FFC9DE', // blush
  '#C9F0D9', // light seafoam
  '#FFD1DC', // rose
  '#CFE8FF', // light sky
]

// Load and parse the CSV on mount
onMounted(() => {
  // import.meta.env.BASE_URL may be '/' or a path; build a safe URL string
  const base = import.meta.env.BASE_URL || '/'
  const csvUrl = base.endsWith('/') ? base + 'anime-ratings.csv' : base + '/anime-ratings.csv'
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: (results) => {
      // Normalize rows: CSV has headers like `Genres` and `Score`.
      // Convert to a consistent shape: { genres: string, rating: number }
      const rows = (results.data || []).filter(Boolean).map((r) => {
        // Some CSVs use `Genres` or `genres`; rating may be `Score` or `rating`.
        const rawGenres = r.Genres ?? r.genres ?? r.Genre ?? r.genre ?? ''
        const rawRating = r.Score ?? r.score ?? r.Rating ?? r.rating ?? ''

        // Convert rating to a float (handle comma decimals just in case)
        const rating = parseFloat(String(rawRating).replace(',', '.'))

        return {
          // keep original title if present for later use
          title: r.Title ?? r.title ?? '',
          genres: String(rawGenres),
          rating: Number.isNaN(rating) ? null : rating,
        }
      })

      // Filter out rows without a valid genre or rating
      chartData.value = rows.filter((row) => row.genres && row.rating != null)

      // Merge any saved user entries from localStorage (persisted across reloads)
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          if (Array.isArray(saved) && saved.length) {
            // Ensure saved entries use the same shape as parsed rows: { title, genres, rating }
            // Mark these entries as user-added via `isUser=true` so we can remove them later if needed
            const normalized = saved
              .map((e) => ({
                title: e.title ?? '',
                genres: e.genres ?? e.genre ?? '',
                rating: Number(e.rating),
                isUser: true,
              }))
              .filter((r) => r.genres && r.rating != null && !Number.isNaN(r.rating))

            chartData.value = chartData.value.concat(normalized)
            userEntriesCount.value = normalized.length
          }
        }
      } catch (err) {
        // If localStorage is unavailable or parse fails, continue without saved entries
        console.warn('Failed to load saved entries from localStorage', err)
      }

      renderChart()
    },
    error: (err) => {
      console.error('Failed to load/parse CSV:', csvUrl, err)
    },
  })
})

function renderChart() {
  if (chartInstance.value) chartInstance.value.destroy()

  // Calculate average rating per genre
  const genreMap = {}
  chartData.value.forEach((row) => {
    const rating = Number(row.rating)
    if (rating == null || Number.isNaN(rating)) return

    // `genres` may contain multiple comma-separated values
    const raw = row.genres || ''
    const parts = String(raw)
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)

    if (parts.length === 0) return

    parts.forEach((genre) => {
      if (!genreMap[genre]) genreMap[genre] = []
      genreMap[genre].push(rating)
    })
  })

  // Turn the genreMap into an array so we can sort and slice the top N
  const genreEntries = Object.keys(genreMap).map((g) => {
    const arr = genreMap[g]
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length
    return { genre: g, avg: parseFloat(avg.toFixed(2)), count: arr.length }
  })

  // Sort by average rating (desc) then by count (desc) and take top N
  genreEntries.sort((a, b) => {
    if (b.avg === a.avg) return b.count - a.count
    return b.avg - a.avg
  })

  const top = genreEntries.slice(0, TOP_N)
  const labels = top.map((e) => e.genre)
  const averages = top.map((e) => e.avg)
  const counts = top.map((e) => e.count)
  // Assign pastel colors to each bar (wrap if fewer colors than bars)
  const colors = top.map((_, i) => PASTEL_COLORS[i % PASTEL_COLORS.length])

  // Compute dynamic canvas height so labels and bars have room
  const canvasHeight = Math.max(400, labels.length * 40)
  // Set the wrapper height rather than the canvas directly to avoid layout resize loops
  if (chartWrapper.value && chartWrapper.value.style) {
    // set a fixed wrapper height and force full-width; avoid touching canvas directly
    chartWrapper.value.style.height = canvasHeight + 'px'
    chartWrapper.value.style.width = '100%'
    chartWrapper.value.style.marginLeft = 'auto'
    chartWrapper.value.style.marginRight = 'auto'
  }

  if (chartCanvas.value && chartCanvas.value.style) {
    chartCanvas.value.style.display = 'block'
    chartCanvas.value.style.width = '100%'
  }

  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'bar',
    // Standard vertical bars: genres on X axis, numeric average on Y axis
    indexAxis: 'x',
    data: {
      labels,
      datasets: [
        {
          label: 'Average Rating',
          data: averages,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      // Y axis is numeric (Average Rating); X axis shows genres
      scales: {
        x: {
          // categories (genre labels) — allow auto-skipping and rotation
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1,
          },
          title: {
            display: true,
            text: 'Average Rating',
            padding: { top: 6, bottom: 6 },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            // Show average and count in the tooltip
            label: (ctx) => {
              const idx = ctx.dataIndex
              const avg = ctx.formattedValue
              const count = counts[idx]
              return `Avg: ${avg} (n=${count})`
            },
          },
        },
      },
    },
  })
}

function addEntry() {
  // Normalize the field names so saved entries match parsed CSV rows
  const entry = {
    title: newAnime.value.title ?? '',
    genres: newAnime.value.genre ?? '',
    rating: Number(newAnime.value.rating),
  }

  // mark as user entry for future filtering
  entry.isUser = true
  chartData.value.push(entry)

  // Persist user-added entries to localStorage (keep only user entries in the saved array)
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const saved = raw ? JSON.parse(raw) : []
    if (Array.isArray(saved)) {
      saved.push({ title: entry.title, genres: entry.genres, rating: entry.rating })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } else {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([{ title: entry.title, genres: entry.genres, rating: entry.rating }]),
      )
    }
    userEntriesCount.value = (userEntriesCount.value || 0) + 1
  } catch (err) {
    console.warn('Failed to save entry to localStorage', err)
  }

  renderChart()
  newAnime.value = { title: '', genre: '', rating: null }
}

function clearSavedEntries() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Failed to remove saved entries from localStorage', err)
  }

  // Remove entries we marked as user-added from chartData
  chartData.value = chartData.value.filter((r) => !r.isUser)
  userEntriesCount.value = 0
  renderChart()
}

// Build and download a CSV representing the combined dataset (original + saved entries)
function downloadCSV() {
  // CSV header matches original file columns minimally
  const header = ['Title', 'Genres', 'Score']

  // Use chartData which already contains parsed CSV rows plus user entries
  const rows = chartData.value.map((r) => {
    // Ensure values are strings and escape quotes
    const title = String(r.title ?? '').replace(/"/g, '""')
    const genres = String(r.genres ?? r.genre ?? '').replace(/"/g, '""')
    const score = r.rating == null ? '' : String(r.rating)
    return `"${title}","${genres}",${score}`
  })

  const csvContent = [header.join(','), ...rows].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'anime-ratings-with-user-entries.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
canvas {
  width: 100%;
}
</style>
