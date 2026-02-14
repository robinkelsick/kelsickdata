<template>
  <section
    id="projects"
    class="flex flex-col justify-center items-center py-12 sm:py-16 md:py-20 text-center w-full"
    style="background-color: #111827; color: #e5e7eb; font-family: 'Inter', sans-serif"
  >
    <h2
      class="text-3xl sm:text-4xl font-bold mb-10"
      style="font-family: 'Poppins', sans-serif;"
    >
      Projects
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 w-full">

      <a
        v-for="(project, index) in projects"
        :key="project.title"
        :href="project.primaryHref"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-xl p-6 block transition-transform text-left"
        :style="cardStyle(index)"
        @mouseover="setHover(index, true)"
        @mouseleave="setHover(index, false)"
      >
        <!-- Title -->
        <h3 class="text-2xl font-semibold mb-2">
          {{ project.title }}
        </h3>

        <!-- Impact -->
        <p class="text-sm mb-3 text-gray-400">
          <span class="font-semibold text-gray-300">Impact:</span>
          {{ project.impact }}
        </p>

        <!-- Tech -->
        <p class="text-xs mb-4 text-gray-300">
          <span class="font-semibold">Tech:</span>
          {{ project.tech.join(' | ') }}
        </p>

        <!-- Highlights -->
        <ul class="text-sm text-gray-300 space-y-2 mb-4">
          <li v-for="(item, i) in project.highlights" :key="i">
            • {{ item }}
          </li>
        </ul>

        <!-- Links -->
        <div class="space-y-2">
          <a
            v-for="(link, i) in project.links"
            :key="i"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="block hover:underline text-sm"
            :class="link.color"
          >
            {{ link.label }}
          </a>
        </div>

        <p class="mt-4 text-sm text-[#20beff] font-medium">
          {{ project.cta }}
        </p>
      </a>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const hoverStates = ref([false, false, false])

function setHover(index, value) {
  hoverStates.value[index] = value
}

function cardStyle(index) {
  return `
    background-color: #1e293b;
    border: 1px solid rgba(96,165,250,0.08);
    box-shadow: ${
      hoverStates.value[index]
        ? '0 0 18px rgba(59,130,246,0.25)'
        : '0 4px 12px rgba(0,0,0,0.3)'
    };
    transform: ${
      hoverStates.value[index]
        ? 'translateY(-4px)'
        : 'translateY(0)'
    };
  `
}

const projects = [
  {
    title: 'WUBL Greats Analytics (Kaggle)',
    impact:
      'Built a historical analytics framework to evaluate GOAT rankings, draft outcomes, and long-term player development across league history.',
    tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter', 'Kaggle'],
    highlights: [
      'Engineered cross-era performance normalization',
      'Ranked players using aggregated career metrics',
      'Analyzed draft class hit rates and outcome variance',
      'Published reusable historical dataset'
    ],
    primaryHref: 'https://www.kaggle.com/robinkelsick',
    cta: 'Open Kaggle profile →',
    links: [
      {
        label: 'View Notebooks',
        href: 'https://www.kaggle.com/robinkelsick',
        color: 'text-[#20beff]'
      }
    ]
  },

  {
    title: 'Retail Customer Segmentation Analysis',
    impact:
      'Segmented retail customers by lifestage and value tier to identify revenue-driving groups and inform category strategy.',
    tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Google Colab'],
    highlights: [
      'Cleaned and validated transaction & customer datasets',
      'Removed outliers to improve signal quality',
      'Segmented customers by value tier and behavior',
      'Delivered category growth recommendations'
    ],
    primaryHref:
      'https://colab.research.google.com/drive/1ZlZsh1GjNlB0h0e9mVaybCgWfYyXvInw?usp=sharing',
    cta: 'View analysis notebook →',
    links: [
      {
        label: 'Open Notebook',
        href:
          'https://colab.research.google.com/drive/1ZlZsh1GjNlB0h0e9mVaybCgWfYyXvInw?usp=sharing',
        color: 'text-[#20beff]'
      }
    ]
  },

  {
    title: 'Quantium Retail Analytics – Trial vs Control Evaluation',
    impact:
      'Measured the performance impact of a new store layout using matched control stores and statistical testing to determine true sales uplift.',
    tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'SciPy', 'Google Colab'],
    highlights: [
      'Matched control stores using pre-trial similarity metrics',
      'Measured 9–13% sales uplift in mid-performing stores',
      'Identified increased customer traffic as primary driver',
      'Delivered targeted rollout recommendation'
    ],
    primaryHref:
      'https://colab.research.google.com/drive/12RxfCpMi0lbV4stoHVct3bZf1pWUhSYu?usp=sharing',
    cta: 'View trial evaluation notebook →',
    links: [
      {
        label: 'Open Notebook',
        href:
          'https://colab.research.google.com/drive/12RxfCpMi0lbV4stoHVct3bZf1pWUhSYu?usp=sharing',
        color: 'text-[#20beff]'
      },
      {
        label: 'View Presentation (Slides)',
        href:
          'https://docs.google.com/presentation/d/1qzmb8GIqAfAfO__-40hTvqTIspJPWh-8Q29hGvoh3pA/edit?usp=sharing',
        color: 'text-[#a78bfa]'
      }
    ]
  }
]
</script>

