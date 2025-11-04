<template>
  <section
    class="min-h-screen flex flex-col items-center justify-center text-center px-6"
    style="background-color: #111827; color: #e5e7eb"
  >
    <h1 class="text-5xl md:text-6xl font-extrabold mb-4" style="color: #e5e7eb">
      Turning raw data into clear stories
    </h1>

    <p class="text-lg max-w-xl mb-8" style="color: #9ca3af">
      Hi, I’m Robin Kelsick. I help teams find clarity in data—and build the tools to make it
      happen.
    </p>

    <div class="flex flex-col md:flex-row gap-4 justify-center">
      <a
        href="/projects"
        class="px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform"
        style="background-color: #7c3aed; color: #fff"
        @mouseover="hover1 = true"
        @mouseleave="hover1 = false"
        :style="hover1 ? 'background-color:#3B82F6; transform:translateY(-2px)' : ''"
      >
        View My Work
      </a>

      <a
        href="/about-me"
        class="px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform"
        style="background-color: #7c3aed; color: #fff"
        @mouseover="hover2 = true"
        @mouseleave="hover2 = false"
        :style="hover2 ? 'background-color:#3B82F6; transform:translateY(-2px)' : ''"
      >
        About Me
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
const hover1 = ref(false)
const hover2 = ref(false)
</script>
