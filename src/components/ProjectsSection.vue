<template>
  <section
    id="projects"
    class="flex flex-col justify-center items-center py-12 sm:py-16 md:py-20 text-center w-full"
    style="background-color: #111827; color: #e5e7eb; font-family: 'Inter', sans-serif"
  >
    <h2
      class="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 px-4"
      style="font-family: 'Poppins', sans-serif; color: #e5e7eb"
    >
      Projects
    </h2>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 w-full"
    >
      <!-- Project 1 -->
      <router-link
        to="/genre-ratings"
        class="rounded-xl p-5 sm:p-6 block transition-transform"
        style="
          background-color: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(124, 58, 237, 0.2);
        "
        @mouseover="hover1 = true"
        @mouseleave="hover1 = false"
        @touchstart="hover1 = true"
        @touchend="hover1 = false"
        :style="
          hover1 ? 'transform:translateY(-4px); box-shadow:0 0 18px rgba(124,58,237,0.4);' : ''
        "
      >
        <h3 class="text-xl sm:text-2xl font-semibold mb-2" style="color: #e5e7eb">
          Anime Ratings by Genre
        </h3>
        <p class="mb-4 text-sm sm:text-base" style="color: #9ca3af">
          Visualizing which anime genres score highest on average.
        </p>
        <span style="color: #7c3aed" class="font-medium hover:underline text-sm sm:text-base">
          View Project →
        </span>
      </router-link>

      <!-- Project 2 -->
      <router-link
        to="/popularity-vs-rating"
        class="rounded-xl p-5 sm:p-6 block transition-transform"
        style="
          background-color: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.2);
        "
        @mouseover="hover2 = true"
        @mouseleave="hover2 = false"
        @touchstart="hover2 = true"
        @touchend="hover2 = false"
        :style="
          hover2 ? 'transform:translateY(-4px); box-shadow:0 0 18px rgba(59,130,246,0.4);' : ''
        "
      >
        <h3 class="text-xl sm:text-2xl font-semibold mb-2" style="color: #e5e7eb">
          Popularity vs Rating
        </h3>
        <p class="mb-4 text-sm sm:text-base" style="color: #9ca3af">
          Do popular anime always score higher? Let's find out.
        </p>
        <span style="color: #3b82f6" class="font-medium hover:underline text-sm sm:text-base">
          View Project →
        </span>
      </router-link>

      <!-- Kaggle Work (external links) -->
      <a
        href="https://www.kaggle.com/robinkelsick"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-xl p-5 sm:p-6 block transition-transform"
        style="
          background-color: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(96,165,250,0.08);
        "
        @mouseover="hover3 = true"
        @mouseleave="hover3 = false"
        @touchstart="hover3 = true"
        @touchend="hover3 = false"
        :style="hover3 ? 'transform:translateY(-4px); box-shadow:0 0 18px rgba(59,130,246,0.25);' : ''"
        aria-label="Kaggle Work"
      >
        <h3 class="text-xl sm:text-2xl font-semibold mb-2" style="color: #e5e7eb">
          Kaggle Work
        </h3>
        <p class="mb-4 text-sm sm:text-base" style="color: #9ca3af">
          Selected notebooks and dataset — click to view on Kaggle.
        </p>
        <ul class="text-sm sm:text-base space-y-2 text-gray-300">
          <li>
            <a href="https://www.kaggle.com/code/robinkelsick/wubl-greats-who-is-the-goat" target="_blank" rel="noopener noreferrer" class="text-[#20beff] hover:underline" aria-label="WUBL Greats - Who is the GOAT">WUBL Greats — Who is the GOAT</a>
          </li>
          <li>
            <a href="https://www.kaggle.com/code/robinkelsick/wubl-greats-draft-class-magic" target="_blank" rel="noopener noreferrer" class="text-[#20beff] hover:underline" aria-label="WUBL Greats - Draft Class Magic">WUBL Greats — Draft Class Magic</a>
          </li>
          <li>
            <a href="https://www.kaggle.com/code/robinkelsick/wubl-greats-do-they-live-up-to-their-potential" target="_blank" rel="noopener noreferrer" class="text-[#20beff] hover:underline" aria-label="WUBL Greats - Do they live up to their potential">WUBL Greats — Do they live up to their potential</a>
          </li>
          <li>
            <a href="https://www.kaggle.com/datasets/robinkelsick/wubl-stats-1871-2025" target="_blank" rel="noopener noreferrer" class="text-[#a78bfa] hover:underline" aria-label="WUBL dataset">Dataset — WUBL Stats (1871–2025)</a>
          </li>
        </ul>
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
const hover1 = ref(false)
const hover2 = ref(false)
const hover3 = ref(false)
</script>
