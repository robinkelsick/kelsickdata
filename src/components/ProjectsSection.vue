<template>
  <section
    id="projects"
    class="flex flex-col justify-center items-center py-20 text-center w-full"
    style="background-color: #111827; color: #e5e7eb; font-family: 'Inter', sans-serif"
  >
    <h2 class="text-4xl font-bold mb-10" style="font-family: 'Poppins', sans-serif; color: #e5e7eb">
      Projects
    </h2>

    <div
      class="grid gap-8 max-w-6xl mx-auto px-4 justify-center"
      style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))"
    >
      <!-- Project 1 -->
      <router-link
        to="/genre-ratings"
        class="rounded-xl p-6 block transition-transform"
        style="
          background-color: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(124, 58, 237, 0.2);
        "
        @mouseover="hover1 = true"
        @mouseleave="hover1 = false"
        :style="
          hover1 ? 'transform:translateY(-4px); box-shadow:0 0 18px rgba(124,58,237,0.4);' : ''
        "
      >
        <h3 class="text-2xl font-semibold mb-2" style="color: #e5e7eb">Anime Ratings by Genre</h3>
        <p class="mb-4" style="color: #9ca3af">
          Visualizing which anime genres score highest on average.
        </p>
        <span style="color: #7c3aed" class="font-medium hover:underline"> View Project → </span>
      </router-link>

      <!-- Project 2 -->
      <router-link
        to="/popularity-vs-rating"
        class="rounded-xl p-6 block transition-transform"
        style="
          background-color: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.2);
        "
        @mouseover="hover2 = true"
        @mouseleave="hover2 = false"
        :style="
          hover2 ? 'transform:translateY(-4px); box-shadow:0 0 18px rgba(59,130,246,0.4);' : ''
        "
      >
        <h3 class="text-2xl font-semibold mb-2" style="color: #e5e7eb">Popularity vs Rating</h3>
        <p class="mb-4" style="color: #9ca3af">
          Do popular anime always score higher? Let’s find out.
        </p>
        <span style="color: #3b82f6" class="font-medium hover:underline"> View Project → </span>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
const hover1 = ref(false)
const hover2 = ref(false)
</script>
