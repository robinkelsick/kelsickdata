<template>
  <section
    class="py-6 sm:py-10 flex flex-col items-center px-4"
    style="background-color: #111827; color: #e5e7eb; font-family: 'Inter', sans-serif"
  >
    <h2
      class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center"
      style="font-family: 'Poppins', sans-serif; color: #e5e7eb"
    >
      Popularity vs Rating
    </h2>

    <!-- Controls Section -->
    <div class="mb-4 flex flex-col gap-4 w-full max-w-4xl">
      <!-- Mode and Scale Controls -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            @click="mode = 'scatter'"
            class="py-1 px-3 rounded text-white text-sm"
            :style="mode === 'scatter' ? 'background-color:#7C3AED;' : 'background-color:#1E293B;'"
          >
            Scatter
          </button>
          <button
            type="button"
            @click="mode = 'aggregate'"
            class="py-1 px-3 rounded text-white text-sm"
            :style="
              mode === 'aggregate' ? 'background-color:#7C3AED;' : 'background-color:#1E293B;'
            "
          >
            Aggregate
          </button>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs sm:text-sm whitespace-nowrap" style="color: #9ca3af">X axis:</span>
          <button
            type="button"
            @click="xScaleType = 'linear'"
            class="py-1 px-3 rounded text-white text-sm"
            :style="
              xScaleType === 'linear' ? 'background-color:#7C3AED;' : 'background-color:#1E293B;'
            "
          >
            Linear
          </button>
          <button
            type="button"
            @click="xScaleType = 'log'"
            class="py-1 px-3 rounded text-white text-sm"
            :style="
              xScaleType === 'log' ? 'background-color:#7C3AED;' : 'background-color:#1E293B;'
            "
          >
            Log
          </button>
        </div>
      </div>

      <!-- Stats Box -->
      <div class="p-3 rounded text-xs sm:text-sm" style="background-color: #1e293b; color: #e5e7eb">
        <div class="flex flex-wrap gap-2 sm:gap-4">
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
        <div class="mt-2 flex flex-wrap gap-2 sm:gap-4">
          <div>
            Std ★: <strong>{{ stats.stdRating ?? '—' }}</strong>
          </div>
          <div>
            Members: <strong>{{ stats.minMembers ?? '—' }}</strong> /
            <strong>{{ stats.maxMembers ?? '—' }}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div ref="chartWrapper" class="max-w-4xl w-full mb-6 sm:mb-10 mx-auto">
      <canvas ref="chartCanvas" class="w-full" style="height: 400px; max-height: 500px"></canvas>
    </div>

    <!-- Add Entry Form -->
    <form
      @submit.prevent="addEntry"
      class="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg w-full max-w-md"
      style="background-color: #1e293b"
    >
      <h3 class="text-lg sm:text-xl font-semibold" style="font-family: 'Poppins', sans-serif">
        Add Your Own Anime
      </h3>
      <input
        v-model="newAnime.title"
        placeholder="Title"
        class="p-2 rounded text-white text-sm sm:text-base"
        style="background-color: #111827"
        required
      />
      <input
        v-model.number="newAnime.members"
        placeholder="Members (popularity count)"
        type="number"
        class="p-2 rounded text-white text-sm sm:text-base"
        style="background-color: #111827"
        required
      />
      <input
        v-model.number="newAnime.rating"
        placeholder="Rating (1–10)"
        type="number"
        step="0.1"
        min="1"
        max="10"
        class="p-2 rounded text-white text-sm sm:text-base"
        style="background-color: #111827"
        required
      />
      <button
        type="submit"
        class="py-2 rounded text-white transition-transform text-sm sm:text-base"
        style="background-color: #7c3aed; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.4)"
        @mouseover="hoverAdd = true"
        @mouseleave="hoverAdd = false"
        @touchstart="hoverAdd = true"
        @touchend="hoverAdd = false"
        :style="hoverAdd ? 'background-color:#3B82F6; transform:translateY(-2px);' : ''"
      >
        Add Entry
      </button>
    </form>

    <!-- Action Buttons -->
    <div
      class="w-full max-w-md mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
    >
      <button
        type="button"
        @click="downloadCSV"
        class="py-2 px-4 rounded text-white transition text-sm"
        style="background-color: #10b981"
      >
        Download CSV
      </button>

      <div class="flex items-center gap-2 sm:gap-3">
        <span class="text-xs sm:text-sm whitespace-nowrap" style="color: #9ca3af">Saved:</span>
        <span
          class="text-xs sm:text-sm px-2 py-1 rounded"
          style="background-color: #1e293b; color: #e5e7eb"
          >{{ userEntriesCount }}</span
        >
        <button
          type="button"
          @click="clearSavedEntries"
          class="py-2 px-3 rounded text-xs sm:text-sm text-white whitespace-nowrap"
          style="background-color: #e11d48"
        >
          Clear saved
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import Papa from 'papaparse'

/* ===== Chart.js GLOBAL THEME ===== */
Chart.defaults.color = '#E5E7EB'
Chart.defaults.font.family = "'Inter', sans-serif"
Chart.defaults.borderColor = 'rgba(59,130,246,0.3)'
Chart.defaults.elements.point.backgroundColor = 'rgba(124,58,237,0.7)'
Chart.defaults.elements.point.borderColor = 'rgba(59,130,246,0.8)'
Chart.defaults.elements.line.borderColor = 'rgba(124,58,237,0.9)'
/* ================================= */

const chartCanvas = ref(null)
const chartWrapper = ref(null)
const chartInstance = ref(null)
const chartData = ref([])
const mode = ref('scatter')
const newAnime = ref({ title: '', members: null, rating: null })
const STORAGE_KEY = 'popularityChartUserEntries'
const userEntriesCount = ref(0)
const MAX_POINTS = 300
const BIN_COUNT = 8
const xScaleType = ref('linear')
const hoverAdd = ref(false)

const stats = ref({
  count: 0,
  meanRating: null,
  medianRating: null,
  stdRating: null,
  minMembers: null,
  maxMembers: null,
})

function computeStats() {
  const rows = chartData.value.filter(
    (r) => Number.isFinite(r.members) && Number.isFinite(r.rating),
  )
  const count = rows.length
  if (count === 0) {
    return {
      count: 0,
      meanRating: null,
      medianRating: null,
      stdRating: null,
      minMembers: null,
      maxMembers: null,
    }
  }

  const meanRating = rows.reduce((s, r) => s + r.rating, 0) / count
  const ratings = rows.map((r) => r.rating).sort((a, b) => a - b)
  const medianRating =
    count % 2 === 1 ? ratings[(count - 1) / 2] : (ratings[count / 2 - 1] + ratings[count / 2]) / 2
  const variance = rows.reduce((s, r) => s + (r.rating - meanRating) ** 2, 0) / count
  const stdRating = Math.sqrt(variance)
  const members = rows.map((r) => r.members).sort((a, b) => a - b)
  const minMembers = members[0]
  const maxMembers = members[members.length - 1]

  return {
    count,
    meanRating: parseFloat(meanRating.toFixed(3)),
    medianRating: parseFloat(medianRating.toFixed(3)),
    stdRating: parseFloat(stdRating.toFixed(3)),
    minMembers,
    maxMembers,
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
        const membersClean = String(rawMembers).replace(/[^0-9.-]/g, '')
        const members = membersClean === '' ? NaN : parseInt(membersClean, 10)
        const ratingClean = String(rawRating).replace(',', '.')
        const rating = ratingClean === '' ? NaN : parseFloat(ratingClean)
        return {
          title: r.Title ?? r.title ?? '',
          members: Number.isNaN(members) ? null : members,
          rating: Number.isNaN(rating) ? null : rating,
        }
      })

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

      renderChart()
    },
    error: (err) => {
      console.error('Failed to load CSV:', err)
    },
  })
})

watch(mode, renderChart)
watch(xScaleType, renderChart)

function renderChart() {
  stats.value = computeStats()

  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  const ctx = chartCanvas.value
  if (!ctx) return

  if (mode.value === 'aggregate') {
    const rows = chartData.value.filter(
      (r) => Number.isFinite(r.members) && Number.isFinite(r.rating) && r.members > 0,
    )
    if (rows.length === 0) return

    const membersVals = rows.map((r) => r.members)
    const min = Math.min(...membersVals)
    const max = Math.max(...membersVals)
    const useLog = xScaleType.value === 'log'

    let binEdges = []
    if (useLog) {
      const logMin = Math.log10(min)
      const logMax = Math.log10(max)
      for (let i = 0; i <= BIN_COUNT; i++)
        binEdges.push(10 ** (logMin + ((logMax - logMin) * i) / BIN_COUNT))
    } else {
      for (let i = 0; i <= BIN_COUNT; i++) binEdges.push(min + ((max - min) * i) / BIN_COUNT)
    }

    const bins = []
    for (let i = 0; i < BIN_COUNT; i++)
      bins.push({ low: binEdges[i], high: binEdges[i + 1], items: [] })

    rows.forEach((r) => {
      for (let i = 0; i < bins.length; i++) {
        const b = bins[i]
        if (
          (r.members >= b.low && r.members < b.high) ||
          (i === bins.length - 1 && r.members <= b.high)
        ) {
          b.items.push(r)
          break
        }
      }
    })

    const agg = bins
      .map((b) => {
        const count = b.items.length
        if (count === 0) return null
        const avg = b.items.reduce((s, it) => s + it.rating, 0) / count
        const variance = b.items.reduce((s, it) => s + (it.rating - avg) ** 2, 0) / count
        const std = Math.sqrt(variance)
        const center = useLog ? Math.sqrt(b.low * b.high) : (b.low + b.high) / 2
        return { center, avg: +avg.toFixed(3), std: +std.toFixed(3), count }
      })
      .filter(Boolean)

    const labels = agg.map((a) => a.center)
    const avgs = agg.map((a) => a.avg)
    const stds = agg.map((a) => a.std)
    const counts = agg.map((a) => a.count)

    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Average Rating',
            data: avgs.map((v, i) => ({ x: labels[i], y: v })),
            backgroundColor: 'rgba(124, 58, 237, 0.25)',
            tension: 0.2,
            fill: false,
            pointRadius: counts.map((c) => Math.min(20, 4 + Math.sqrt(c))),
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: useLog ? 'logarithmic' : 'linear',
            title: { display: true, text: 'Members' },
            ticks: { callback: (v) => Number(v).toLocaleString() },
          },
          y: {
            title: { display: true, text: 'Avg Rating' },
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
    })
    return
  }

  // Scatter mode
  const points = chartData.value
    .filter((r) => Number.isFinite(r.members) && Number.isFinite(r.rating))
    .slice(0, MAX_POINTS)
    .map((r) => ({ x: r.members, y: r.rating, title: r.title }))

  chartInstance.value = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Anime',
          data: points,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Members' },
          type: xScaleType.value === 'log' ? 'logarithmic' : 'linear',
          ticks: { callback: (v) => Number(v).toLocaleString() },
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
        tooltip: { callbacks: { label: (ctx) => `${ctx.raw.title} — ★${ctx.raw.y}` } },
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

  if (!Number.isFinite(entry.members) || !Number.isFinite(entry.rating)) {
    alert('Please enter valid numbers for members and rating')
    return
  }

  chartData.value.push(entry)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const saved = raw ? JSON.parse(raw) : []
    const next = Array.isArray(saved) ? saved : []
    next.push({ title: entry.title, members: entry.members, rating: entry.rating })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    userEntriesCount.value = next.length
  } catch (err) {
    console.warn('Failed to save entry to localStorage', err)
  }

  renderChart()
  newAnime.value = { title: '', members: null, rating: null }
}

function clearSavedEntries() {
  if (!confirm('Are you sure you want to clear all saved entries?')) return

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
  const rows = chartData.value.map(
    (r) => `"${String(r.title ?? '').replace(/"/g, '""')}",${r.members ?? ''},${r.rating ?? ''}`,
  )
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
  width: 100% !important;
  height: 400px !important;
  max-height: 500px !important;
}
</style>
