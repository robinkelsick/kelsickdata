<template>
  <section
    class="py-10 flex flex-col items-center"
    style="background-color: #111827; color: #e5e7eb; font-family: 'Inter', sans-serif"
  >
    <h2
      class="text-3xl font-bold mb-6 text-center"
      style="font-family: 'Poppins', sans-serif; color: #e5e7eb"
    >
      Average Rating by Genre
    </h2>

    <!-- Chart -->
    <div ref="chartWrapper" class="max-w-3xl w-full mb-10 mx-auto">
      <canvas ref="chartCanvas" class="w-full" style="min-height: 400px"></canvas>
    </div>

    <!-- Add Entry Form -->
    <form
      @submit.prevent="addEntry"
      class="flex flex-col gap-4 p-6 rounded-lg w-full max-w-md"
      style="background-color: #1e293b"
    >
      <h3 class="text-xl font-semibold" style="font-family: 'Poppins', sans-serif">
        Add Your Own Rating
      </h3>
      <input
        v-model="newAnime.title"
        placeholder="Title"
        class="p-2 rounded text-white"
        style="background-color: #111827"
        required
      />
      <input
        v-model="newAnime.genre"
        placeholder="Genre"
        class="p-2 rounded text-white"
        style="background-color: #111827"
        required
      />
      <input
        v-model.number="newAnime.rating"
        placeholder="Rating (1–10)"
        type="number"
        min="1"
        max="10"
        class="p-2 rounded text-white"
        style="background-color: #111827"
        required
      />
      <button
        type="submit"
        class="py-2 rounded text-white transition-transform"
        style="background-color: #7c3aed; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.4)"
        @mouseover="hoverAdd = true"
        @mouseleave="hoverAdd = false"
        :style="hoverAdd ? 'background-color:#3B82F6; transform:translateY(-2px);' : ''"
      >
        Add Entry
      </button>
    </form>

    <!-- Bottom Controls -->
    <div class="w-full max-w-md mt-3 flex items-center justify-between gap-3">
      <button
        type="button"
        @click="downloadCSV"
        class="py-2 px-4 rounded text-white transition"
        style="background-color: #10b981"
      >
        Download CSV
      </button>

      <div class="flex items-center gap-3">
        <span class="text-sm" style="color: #9ca3af">Saved:</span>
        <span class="text-sm px-2 py-1 rounded" style="background-color: #1e293b; color: #e5e7eb">
          {{ userEntriesCount }}
        </span>
        <button
          type="button"
          @click="clearSavedEntries"
          class="py-2 px-3 rounded text-sm text-white"
          style="background-color: #e11d48"
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

/* ===== COSMIC DATA THEME (Chart.js global defaults) ===== */
Chart.defaults.color = '#E5E7EB'
Chart.defaults.font.family = "'Inter', sans-serif"
Chart.defaults.borderColor = 'rgba(59,130,246,0.3)' // gridlines
Chart.defaults.elements.bar.borderRadius = 6
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17,24,39,0.9)'
Chart.defaults.plugins.tooltip.titleColor = '#7C3AED'
Chart.defaults.plugins.tooltip.bodyColor = '#E5E7EB'
/* ======================================================== */

const chartCanvas = ref(null)
const chartWrapper = ref(null)
const chartInstance = ref(null)
const chartData = ref([])
const newAnime = ref({ title: '', genre: '', rating: null })
const STORAGE_KEY = 'genreChartUserEntries'
const userEntriesCount = ref(0)
const TOP_N = 10
const hoverAdd = ref(false)

// Cosmic gradient palette
const COSMIC_COLORS = [
  '#7C3AED',
  '#6366F1',
  '#3B82F6',
  '#22D3EE',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#A855F7',
  '#14B8A6',
]

// Load CSV + merge localStorage entries
onMounted(() => {
  const base = import.meta.env.BASE_URL || '/'
  const csvUrl = base.endsWith('/') ? base + 'anime-ratings.csv' : base + '/anime-ratings.csv'

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: (results) => {
      const rows = (results.data || []).filter(Boolean).map((r) => {
        const rawGenres = r.Genres ?? r.genres ?? r.Genre ?? ''
        const rawRating = r.Score ?? r.score ?? r.Rating ?? ''
        const rating = parseFloat(String(rawRating).replace(',', '.'))
        return {
          title: r.Title ?? r.title ?? '',
          genres: String(rawGenres),
          rating: Number.isNaN(rating) ? null : rating,
        }
      })

      chartData.value = rows.filter((r) => r.genres && r.rating != null)

      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          if (Array.isArray(saved) && saved.length) {
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
        console.warn('Failed to load saved entries', err)
      }

      renderChart()
    },
  })
})

function renderChart() {
  if (chartInstance.value) chartInstance.value.destroy()

  // Compute average rating per genre
  const genreMap = {}
  chartData.value.forEach((row) => {
    const rating = Number(row.rating)
    if (!Number.isFinite(rating)) return
    const parts = String(row.genres)
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)
    parts.forEach((g) => {
      if (!genreMap[g]) genreMap[g] = []
      genreMap[g].push(rating)
    })
  })

  const genreEntries = Object.keys(genreMap).map((g) => {
    const arr = genreMap[g]
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length
    return { genre: g, avg: parseFloat(avg.toFixed(2)), count: arr.length }
  })

  genreEntries.sort((a, b) => (b.avg === a.avg ? b.count - a.count : b.avg - a.avg))
  const top = genreEntries.slice(0, TOP_N)

  const labels = top.map((e) => e.genre)
  const averages = top.map((e) => e.avg)
  const counts = top.map((e) => e.count)
  const colors = top.map((_, i) => COSMIC_COLORS[i % COSMIC_COLORS.length])

  // Bar chart
  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Average Rating',
          data: averages,
          backgroundColor: colors.map((c) => `${c}B3`), // translucent fill
          borderColor: colors,
          borderWidth: 1.5,
          hoverBackgroundColor: colors.map((c) => `${c}`),
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: '#E5E7EB', font: { size: 12 } },
        },
        y: {
          beginAtZero: true,
          max: 10,
          title: { display: true, text: 'Average Rating', color: '#A5B4FC' },
          ticks: { color: '#E5E7EB', stepSize: 1 },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const i = ctx.dataIndex
              return `Avg: ${ctx.formattedValue} (n=${counts[i]})`
            },
          },
        },
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart',
      },
    },
  })
}

function addEntry() {
  const entry = {
    title: newAnime.value.title ?? '',
    genres: newAnime.value.genre ?? '',
    rating: Number(newAnime.value.rating),
    isUser: true,
  }
  chartData.value.push(entry)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const saved = raw ? JSON.parse(raw) : []
    const next = Array.isArray(saved) ? saved : []
    next.push({ title: entry.title, genres: entry.genres, rating: entry.rating })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    userEntriesCount.value = next.length
  } catch (err) {
    console.warn('Failed to save entry', err)
  }

  renderChart()
  newAnime.value = { title: '', genre: '', rating: null }
}

function clearSavedEntries() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn(err)
  }
  chartData.value = chartData.value.filter((r) => !r.isUser)
  userEntriesCount.value = 0
  renderChart()
}

function downloadCSV() {
  const header = ['Title', 'Genres', 'Score']
  const rows = chartData.value.map((r) => {
    const title = String(r.title ?? '').replace(/"/g, '""')
    const genres = String(r.genres ?? '').replace(/"/g, '""')
    const score = r.rating == null ? '' : String(r.rating)
    return `"${title}","${genres}",${score}`
  })
  const csvContent = [header.join(','), ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'genre-average-ratings.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
canvas {
  width: 100%;
  min-height: 400px;
}
</style>
