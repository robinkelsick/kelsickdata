<template>
  <!-- Background wrapper -->
  <div style="background-color: #111827; color: #e5e7eb; font-family: 'Inter', sans-serif">
    <!-- About section -->
    <section
      class="about-container grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto p-6"
    >
      <!-- Left: Illustration -->
      <div class="photo-section flex justify-center md:justify-end">
        <img
          src="https://cdn.jsdelivr.net/gh/robinkelsick/kelsickdata@main/public/me_illustration.png"
          alt="A digital illustration of Robin Kelsick II with blond dreadlocks and a nose ring, looking upward. They wear a red hoodie and white shirt, exuding confidence."
          class="w-64 h-auto max-w-full rounded-full shadow-md"
          style="box-shadow: 0 0 25px rgba(124, 58, 237, 0.4)"
        />
      </div>

      <!-- Right: Text Content -->
      <div class="text-section text-center md:text-left space-y-4">
        <h1 class="text-3xl font-bold" style="font-family: 'Poppins', sans-serif; color: #e5e7eb">
          Hi, I’m Robin Kelsick II
        </h1>
        <p class="text-lg leading-relaxed" style="color: #9ca3af">
          I’m a data analyst who loves finding stories hidden in the numbers. From anime datasets to
          business metrics, I turn raw data into insights that make people say “whoa.”
        </p>
        <button
          @click="downloadResume"
          class="px-4 py-2 rounded-md font-semibold transition-transform"
          style="
            background-color: #7c3aed;
            color: #fff;
            box-shadow: 0 4px 10px rgba(124, 58, 237, 0.4);
          "
          @mouseover="hover = true"
          @mouseleave="hover = false"
          :style="hover ? 'background-color:#3B82F6; transform:translateY(-2px)' : ''"
        >
          Download Resume
        </button>
      </div>
    </section>

    <!-- Journey -->
    <section class="max-w-4xl mx-auto p-6 space-y-4">
      <h2 class="text-2xl font-semibold" style="font-family: 'Poppins', sans-serif; color: #e5e7eb">
        My Journey
      </h2>
      <p class="leading-relaxed" style="color: #9ca3af">
        My path into data analytics began in customer-facing roles where every day was an exercise
        in problem-solving. I discovered that I loved recognizing patterns — connecting small
        details to the bigger picture and finding order in the noise.
      </p>
      <p class="leading-relaxed" style="color: #9ca3af">
        That curiosity evolved into a passion for data. Now I’m focused on using tools like Python,
        SQL, and Tableau to uncover insights that inform smarter decisions and tell clearer stories.
      </p>
    </section>

    <!-- Toolbox -->
    <section class="max-w-4xl mx-auto p-6 space-y-4">
      <h2 class="text-2xl font-semibold" style="font-family: 'Poppins', sans-serif; color: #e5e7eb">
        My Toolbox
      </h2>
      <p class="leading-relaxed" style="color: #9ca3af">
        Tools and languages I use to turn data into insight:
      </p>

      <div class="flex flex-wrap gap-3">
        <span
          class="px-3 py-1 rounded-md flex items-center gap-1"
          style="background-color: #1e293b; color: #e5e7eb"
        >
          <vIcon name="co-python" scale="1.2" class="text-yellow-400" /> Python
        </span>
        <span
          class="px-3 py-1 rounded-md flex items-center gap-1"
          style="background-color: #1e293b; color: #e5e7eb"
        >
          <vIcon name="vi-file-type-sql" scale="1.2" class="text-blue-400" /> SQL
        </span>
        <span
          class="px-3 py-1 rounded-md flex items-center gap-1"
          style="background-color: #1e293b; color: #e5e7eb"
        >
          <vIcon name="bi-file-earmark-excel-fill" scale="1.2" class="text-green-400" /> Excel
        </span>
        <span
          class="px-3 py-1 rounded-md flex items-center gap-1"
          style="background-color: #1e293b; color: #e5e7eb"
        >
          <vIcon name="co-tableau" scale="1.2" class="text-indigo-400" /> Tableau
        </span>
        <span
          class="px-3 py-1 rounded-md flex items-center gap-1"
          style="background-color: #1e293b; color: #e5e7eb"
        >
          <vIcon name="co-vue-js" scale="1.2" class="text-green-400" /> Vue.js
        </span>
        <span
          class="px-3 py-1 rounded-md flex items-center gap-1"
          style="background-color: #1e293b; color: #e5e7eb"
        >
          <vIcon name="si-pandas" scale="1.2" class="text-pink-400" /> Pandas
        </span>
        <span
          class="px-3 py-1 rounded-md flex items-center gap-1"
          style="background-color: #1e293b; color: #e5e7eb"
        >
          <vIcon name="fa-github-alt" scale="1.2" class="text-gray-400" /> GitHub
        </span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  CoPython,
  ViFileTypeSql,
  BiFileEarmarkExcelFill,
  CoTableau,
  CoVueJs,
  SiPandas,
  FaGithubAlt,
} from 'oh-vue-icons/icons'

addIcons(CoPython, ViFileTypeSql, BiFileEarmarkExcelFill, CoTableau, CoVueJs, SiPandas, FaGithubAlt)
const vIcon = OhVueIcon

const hover = ref(false)

function downloadResume() {
  // Open Google Docs export URL (PDF) in a new tab so the user can download or view.
  const url = 'https://docs.google.com/document/d/1hxXNp7PZ7OW4Ml6QXtybF5ZoTdfe7ImNR2BsdqCCasA/export?format=pdf'
  window.open(url, '_blank', 'noopener')
}
</script>
