<template>
  <section
    class="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6"
    style="background-color: #111827; color: #e5e7eb"
  >
    <h1
      class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight"
      style="color: #e5e7eb"
    >
      Turning raw data into clear stories
    </h1>

    <p class="text-base sm:text-lg max-w-xl mb-8 px-4" style="color: #9ca3af">
      Hi, I'm Robin Kelsick. I help teams find clarity in data—and build the tools to make it
      happen.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md px-4">
      <router-link
        to="/projects"
        class="px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all text-center"
        style="background-color: #7c3aed; color: #fff"
        @mouseover="hover1 = true"
        @mouseleave="hover1 = false"
        @touchstart="hover1 = true"
        @touchend="hover1 = false"
        :style="hover1 ? 'background-color:#3B82F6; transform:translateY(-2px)' : ''"
      >
        View My Work
      </router-link>

      <router-link
        to="/about-me"
        class="px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all text-center"
        style="background-color: #7c3aed; color: #fff"
        @mouseover="hover2 = true"
        @mouseleave="hover2 = false"
        @touchstart="hover2 = true"
        @touchend="hover2 = false"
        :style="hover2 ? 'background-color:#3B82F6; transform:translateY(-2px)' : ''"
      >
        About Me
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
const hover1 = ref(false)
const hover2 = ref(false)
</script>
