<template>
  <section class="bg-gray-900 text-white py-10 flex flex-col items-center">
    <h2 class="text-3xl font-bold mb-6 text-center">Popularity vs Rating</h2>

    <div
      class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full max-w-4xl"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="mode = 'scatter'"
          :class="[
            mode === 'scatter' ? 'bg-indigo-600' : 'bg-gray-700',
            'text-white py-1 px-3 rounded',
          ]"
        >
          Scatter
        </button>
        <button
          type="button"
          @click="mode = 'aggregate'"
          :class="[
            mode === 'aggregate' ? 'bg-indigo-600' : 'bg-gray-700',
            'text-white py-1 px-3 rounded',
          ]"
        >
          Aggregate (binned avg)
        </button>

        <div class="ml-4 flex items-center gap-2">
          <span class="text-sm text-gray-300 mr-1">X axis:</span>
          <button
            type="button"
            @click="xScaleType = 'linear'"
            :class="[
              xScaleType === 'linear' ? 'bg-indigo-600' : 'bg-gray-700',
              'text-white py-1 px-3 rounded',
            ]"
          >
            Linear
          </button>
          <button
            type="button"
            @click="xScaleType = 'log'"
            :class="[
              xScaleType === 'log' ? 'bg-indigo-600' : 'bg-gray-700',
              'text-white py-1 px-3 rounded',
            ]"
          >
            Log
          </button>
        </div>
      </div>

      <div class="bg-gray-800 p-3 rounded text-sm text-gray-200">
        <div class="flex gap-4">
          <div>
            Count: <strong>{{ stats.count }}</strong>
          </div>
          <div>
            Mean ★: <strong>{{ stats.meanRating ?? '—' }}</strong>
          </div>
          <div>
            Median ★: <strong>{{ stats.medianRating ?? '—' }}</strong>
          </div>
        </div>
        <div class="mt-2 flex gap-4">
          <div>
            Std ★: <strong>{{ stats.stdRating ?? '—' }}</strong>
          </div>
          <div>
            Members min/max: <strong>{{ stats.minMembers ?? '—' }}</strong> /
            <strong>{{ stats.maxMembers ?? '—' }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div ref="chartWrapper" class="max-w-4xl w-full mb-10 mx-auto">
      <canvas ref="chartCanvas" class="w-full" style="height: 100%; display: block"></canvas>
    </div>

    <!-- Add Entry Form -->
    <form
      @submit.prevent="addEntry"
      class="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg w-full max-w-md"
    >
      <h3 class="text-xl font-semibold">Add Your Own Anime</h3>
      <input
        v-model="newAnime.title"
        placeholder="Title"
        class="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        v-model.number="newAnime.members"
        placeholder="Members (popularity count)"
        type="number"
        class="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        v-model.number="newAnime.rating"
        placeholder="Rating (1–10)"
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
import { ref, onMounted, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import Papa from 'papaparse'

const chartCanvas = ref(null)
const chartWrapper = ref(null)
const chartInstance = ref(null)
const chartData = ref([])
const mode = ref('scatter') // 'scatter' or 'aggregate'
const newAnime = ref({ title: '', members: null, rating: null })
const STORAGE_KEY = 'popularityChartUserEntries'
const userEntriesCount = ref(0)
const MAX_POINTS = 300 // limit visible points for performance
const BIN_COUNT = 8
const xScaleType = ref('linear') // 'linear' or 'log'

const stats = ref({
  count: 0,
  meanRating: null,
  medianRating: null,
  stdRating: null,
  minMembers: null,
  maxMembers: null,
  medianMembers: null,
})

function computeStats() {
  const rows = chartData.value.filter(
    (r) => Number.isFinite(r.members) && Number.isFinite(r.rating),
  )
  const count = rows.length
  if (count === 0) return { ...stats.value, count: 0 }
  const meanRating = rows.reduce((s, r) => s + r.rating, 0) / count
  const ratings = rows.map((r) => r.rating).sort((a, b) => a - b)
  const medianRating =
    count % 2 === 1 ? ratings[(count - 1) / 2] : (ratings[count / 2 - 1] + ratings[count / 2]) / 2
  const variance = rows.reduce((s, r) => s + (r.rating - meanRating) ** 2, 0) / count
  const stdRating = Math.sqrt(variance)
  const members = rows.map((r) => r.members).sort((a, b) => a - b)
  const minMembers = members[0]
  const maxMembers = members[members.length - 1]
  const medianMembers =
    members.length % 2 === 1
      ? members[(members.length - 1) / 2]
      : (members[members.length / 2 - 1] + members[members.length / 2]) / 2
  return {
    count,
    meanRating: parseFloat(meanRating.toFixed(3)),
    medianRating: parseFloat(medianRating.toFixed(3)),
    stdRating: parseFloat(stdRating.toFixed(3)),
    minMembers,
    maxMembers,
    medianMembers,
  }
}

onMounted(() => {
  const base = import.meta.env.BASE_URL || '/'
  const csvUrl = base.endsWith('/') ? base + 'anime-ratings.csv' : base + '/anime-ratings.csv'

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: (results) => {
      const rows = (results.data || []).filter(Boolean).map((r) => {
        const rawMembers = r.Members ?? r.members ?? r.Popularity ?? ''
        const rawRating = r.Score ?? r.score ?? r.Rating ?? ''

        // Remove any thousands separators or non-numeric characters from members
        const membersClean = String(rawMembers).replace(/[^0-9.-]/g, '')
        // Members should be an integer count
        const members = membersClean === '' ? NaN : parseInt(membersClean, 10)

        // Ratings may use comma as decimal separator in some CSVs
        const ratingClean = String(rawRating).replace(',', '.')
        const rating = ratingClean === '' ? NaN : parseFloat(ratingClean)

        return {
          title: r.Title ?? r.title ?? '',
          members: Number.isNaN(members) ? null : members,
          rating: Number.isNaN(rating) ? null : rating,
        }
      })

      // Keep only rows with finite numeric members and rating
      chartData.value = rows.filter((r) => Number.isFinite(r.members) && Number.isFinite(r.rating))

      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          if (Array.isArray(saved) && saved.length) {
            const normalized = saved
              .map((e) => ({
                title: e.title ?? '',
                members: Number(e.members),
                rating: Number(e.rating),
                isUser: true,
              }))
              .filter((r) => Number.isFinite(r.members) && Number.isFinite(r.rating))
            chartData.value = chartData.value.concat(normalized)
            userEntriesCount.value = normalized.length
          }
        }
      } catch (err) {
        console.warn('Failed to load saved entries from localStorage', err)
      }

      // quick debug: show a small sample in console so you can verify parsing
      try {
        console.info('Parsed popularity sample (first 8):', chartData.value.slice(0, 8))
      } catch {
        /* ignore in constrained environments */
      }

      renderChart()
    },
  })
})

// re-render when mode changes
watch(mode, () => {
  renderChart()
})

// re-render when x-axis scale type changes
watch(xScaleType, () => {
  renderChart()
})

function renderChart() {
  // update stats every render
  try {
    stats.value = computeStats()
  } catch {
    /* ignore */
  }
  if (chartInstance.value) chartInstance.value.destroy()

  // If aggregate mode, compute bins and show average rating per members bin
  if (mode.value === 'aggregate') {
    const rows = chartData.value.filter(
      (r) => Number.isFinite(r.members) && Number.isFinite(r.rating),
    )
    if (rows.length === 0) {
      chartInstance.value = null
      return
    }

    // Filter out zero or negative members for log-binning
    const positiveRows = rows.filter((r) => r.members > 0)
    const membersVals = positiveRows.map((r) => r.members)
    const min = Math.min(...membersVals)
    const max = Math.max(...membersVals)

    // If too narrow, fallback to linear bins; allow explicit user override via xScaleType
    const autoLog = min > 0 && max / min > 10
    const useLog = xScaleType.value === 'log' || autoLog

    let binEdges = []
    if (useLog) {
      const logMin = Math.log10(min)
      const logMax = Math.log10(max)
      for (let i = 0; i <= BIN_COUNT; i++) {
        const v = 10 ** (logMin + ((logMax - logMin) * i) / BIN_COUNT)
        binEdges.push(v)
      }
    } else {
      for (let i = 0; i <= BIN_COUNT; i++) {
        binEdges.push(min + ((max - min) * i) / BIN_COUNT)
      }
    }

    // Build bins
    const bins = []
    for (let i = 0; i < BIN_COUNT; i++) {
      bins.push({ low: binEdges[i], high: binEdges[i + 1], items: [] })
    }

    positiveRows.forEach((r) => {
      // find bin index
      for (let i = 0; i < bins.length; i++) {
        const b = bins[i]
        // include upper edge on last bin
        if (
          (r.members >= b.low && r.members < b.high) ||
          (i === bins.length - 1 && r.members <= b.high)
        ) {
          b.items.push(r)
          break
        }
      }
    })

    // compute aggregates
    const agg = bins
      .map((b) => {
        const count = b.items.length
        if (count === 0) return null
        const avg = b.items.reduce((s, it) => s + it.rating, 0) / count
        const variance = b.items.reduce((s, it) => s + (it.rating - avg) ** 2, 0) / count
        const std = Math.sqrt(variance)
        // bin center (geometric mean for log) or arithmetic
        const center = useLog ? Math.sqrt(b.low * b.high) : (b.low + b.high) / 2
        return {
          low: b.low,
          high: b.high,
          center,
          avg: parseFloat(avg.toFixed(3)),
          std: parseFloat(std.toFixed(3)),
          count,
        }
      })
      .filter(Boolean)

    const labels = agg.map((a) => a.center)
    const avgs = agg.map((a) => a.avg)
    const stds = agg.map((a) => a.std)
    const counts = agg.map((a) => a.count)

    // create aggregated line chart
    chartInstance.value = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Average Rating (per members bin)',
            data: avgs.map((v, i) => ({ x: labels[i], y: v })),
            borderColor: 'rgba(99,102,241,0.9)',
            backgroundColor: 'rgba(99,102,241,0.2)',
            tension: 0.2,
            fill: false,
            pointRadius: counts.map((c) => Math.min(20, 4 + Math.sqrt(c))),
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            type: xScaleType.value === 'log' ? 'logarithmic' : 'linear',
            title: { display: true, text: 'Members (bin center)' },
            ticks: { callback: (v) => Number(v).toLocaleString() },
          },
          y: {
            title: { display: true, text: 'Average Rating' },
            min: 0,
            max: 10,
            ticks: { stepSize: 1 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const i = ctx.dataIndex
                return `Avg: ${avgs[i]} (n=${counts[i]}, std=${stds[i]})`
              },
            },
          },
        },
      },
      plugins: [
        // plugin to draw vertical error bars using stds
        {
          id: 'errorBars',
          afterDatasetsDraw(chart) {
            const meta = chart.getDatasetMeta(0)
            if (!chart._myPluginData) return
            const { stds: pluginStds } = chart._myPluginData
            const yScale = chart.scales[Object.keys(chart.scales).find((k) => k.startsWith('y'))]
            meta.data.forEach((pt, idx) => {
              const x = pt.x
              const avg = avgs[idx]
              const std = pluginStds[idx]
              const yTop = yScale.getPixelForValue(avg + std)
              const yBottom = yScale.getPixelForValue(avg - std)
              const ctx = chart.ctx
              ctx.save()
              ctx.strokeStyle = 'rgba(0,0,0,0.6)'
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(x, yTop)
              ctx.lineTo(x, yBottom)
              ctx.stroke()
              // caps
              ctx.beginPath()
              ctx.moveTo(x - 4, yTop)
              ctx.lineTo(x + 4, yTop)
              ctx.moveTo(x - 4, yBottom)
              ctx.lineTo(x + 4, yBottom)
              ctx.stroke()
              ctx.restore()
            })
          },
        },
      ],
    })

    // attach arrays for plugin access
    if (chartInstance.value) chartInstance.value._myPluginData = { stds }

    return
  }

  // Default: scatter
  const points = chartData.value
    .filter((r) => Number.isFinite(r.members) && Number.isFinite(r.rating))
    .slice(0, MAX_POINTS)
    .map((r) => ({
      x: r.members,
      y: r.rating,
      title: r.title,
    }))

  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Anime (Members vs Rating)',
          data: points,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Members (Popularity)' },
          type: xScaleType.value === 'log' ? 'logarithmic' : 'linear',
          ticks: { callback: (v) => v.toLocaleString() },
        },
        y: {
          title: { display: true, text: 'Rating' },
          min: 0,
          max: 10,
          ticks: { stepSize: 1 },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw.title} — ★${ctx.raw.y}`,
          },
        },
      },
    },
  })
}

function addEntry() {
  const entry = {
    title: newAnime.value.title ?? '',
    members: Number(newAnime.value.members),
    rating: Number(newAnime.value.rating),
    isUser: true,
  }

  chartData.value.push(entry)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const saved = raw ? JSON.parse(raw) : []
    if (Array.isArray(saved)) {
      saved.push({ title: entry.title, members: entry.members, rating: entry.rating })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } else {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([{ title: entry.title, members: entry.members, rating: entry.rating }]),
      )
    }
    userEntriesCount.value++
  } catch (err) {
    console.warn('Failed to save entry to localStorage', err)
  }

  renderChart()
  newAnime.value = { title: '', members: null, rating: null }
}

function clearSavedEntries() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Failed to clear entries', err)
  }

  chartData.value = chartData.value.filter((r) => !r.isUser)
  userEntriesCount.value = 0
  renderChart()
}

function downloadCSV() {
  const header = ['Title', 'Members', 'Score']
  const rows = chartData.value.map((r) => {
    const title = String(r.title ?? '').replace(/"/g, '""')
    return `"${title}",${r.members ?? ''},${r.rating ?? ''}`
  })
  const csvContent = [header.join(','), ...rows].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'popularity-vs-rating.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
canvas {
  width: 100%;
  min-height: 500px;
}
</style>
