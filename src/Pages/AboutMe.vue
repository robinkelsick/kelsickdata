<template>
  <section
    class="about-container grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto p-6"
  >
    <!-- Left: Illustration -->
    <div class="photo-section flex justify-center md:justify-end">
      <img
        src="https://cdn.jsdelivr.net/gh/robinkelsick/kelsickdata@main/public/me_illustration.png"
        alt="A digital illustration of Robin Kelsick II with blond dreadlocks and a nose ring, looking upward. They wear a red hoodie and white shirt, exuding confidence."
        class="w-64 h-auto max-w-full rounded-full shadow-md"
      />
    </div>

    <!-- Right: Text Content -->
    <div class="text-section text-center md:text-left space-y-4">
      <h1 class="text-3xl font-bold">Hi, I’m Robin Kelsick II</h1>
      <p class="text-gray-700 text-lg leading-relaxed">
        I’m a data analyst who loves finding stories hidden in the numbers. From anime datasets to
        business metrics, I turn raw data into insights that make people say “whoa.”
      </p>
      <button
        @click="downloadResume"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
      >
        Download Resume
      </button>
    </div>
  </section>
  <section class="my-journey max-w-4xl mx-auto p-6 space-y-4">
    <h2 class="text-2xl font-semibold">My Journey</h2>

    <p class="text-gray-700 leading-relaxed">
      My path into data analytics began in customer-facing roles where every day was an exercise in
      problem-solving. I discovered that I loved recognizing patterns — connecting small details to
      the bigger picture and finding order in the noise.
    </p>

    <p class="text-gray-700 leading-relaxed">
      That curiosity evolved into a passion for data. Now I’m focused on using tools like Python,
      SQL, and Tableau to uncover insights that inform smarter decisions and tell clearer stories.
    </p>
  </section>
  <section class="my-toolbox max-w-4xl mx-auto p-6 space-y-4">
    <h2 class="text-2xl font-semibold">My Toolbox</h2>

    <p class="text-gray-700 leading-relaxed">
      Tools and languages I use to turn data into insight:
    </p>

    <div class="flex flex-wrap gap-3">
      <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center gap-1">
        <vIcon name="co-python" scale="1.2" class="text-yellow-500" /> Python
      </span>

      <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center gap-1">
        <vIcon name="vi-file-type-sql" scale="1.2" class="text-blue-500" /> SQL
      </span>

      <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center gap-1">
        <vIcon name="bi-file-earmark-excel-fill" scale="1.2" class="text-green-600" /> Excel
      </span>

      <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center gap-1">
        <vIcon name="co-tableau" scale="1.2" class="text-indigo-500" /> Tableau
      </span>

      <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center gap-1">
        <vIcon name="co-vue-js" scale="1.2" class="text-green-500" /> Vue.js
      </span>

      <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center gap-1">
        <vIcon name="si-pandas" scale="1.2" class="text-black" /> Pandas
      </span>

      <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center gap-1">
        <vIcon name="fa-github-alt" scale="1.2" class="text-gray-700" /> GitHub
      </span>
    </div>
  </section>
</template>

<script setup>
import { OhVueIcon, addIcons } from 'oh-vue-icons'

// import all the icons you want
import {
  CoPython,
  ViFileTypeSql,
  BiFileEarmarkExcelFill,
  CoTableau,
  CoVueJs,
  SiPandas,
  FaGithubAlt,
} from 'oh-vue-icons/icons'

// register them together
addIcons(CoPython, ViFileTypeSql, BiFileEarmarkExcelFill, CoTableau, CoVueJs, SiPandas, FaGithubAlt)

// make the icon component available in the template
const vIcon = OhVueIcon

function downloadResume() {
  const link = document.createElement('a')
  link.href = '/current_resume.pdf'
  link.download = 'Robin_Kelsick_Resume.pdf'
  link.click()
}
</script>
