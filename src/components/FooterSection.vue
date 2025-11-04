<template>
  <footer
    class="mt-10 py-6 px-6 text-center text-gray-300"
    style="
      background-color: #0f172a;
      border-top: 1px solid rgba(124, 58, 237, 0.3);
      font-family: 'Inter', sans-serif;
    "
  >
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Left: Branding -->
      <div class="flex items-center justify-center md:justify-start gap-2">
        <span class="text-lg font-semibold" style="color: #a78bfa">Robin Kelsick II</span>
        <span class="text-gray-500 text-sm">• Data Analyst & Developer</span>
      </div>

      <!-- Center: Navigation (optional small site map) -->
      <nav class="flex gap-4 text-sm">
        <router-link to="/" class="hover:text-indigo-400 transition">Home</router-link>
        <router-link to="/about-me" class="hover:text-indigo-400 transition">About</router-link>
        <router-link to="/projects" class="hover:text-indigo-400 transition">Projects</router-link>
        <router-link to="/contact" class="hover:text-indigo-400 transition">Contact</router-link>
      </nav>

      <!-- Right: Socials -->
      <div class="flex gap-4 items-center justify-center md:justify-end">
        <a
          href="https://github.com/robinkelsick"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-indigo-400 transition"
        >
          <vIcon name="fa-github-alt" scale="1.2" />
        </a>
        <a
          href="https://www.linkedin.com/in/robinkelsickii/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-indigo-400 transition"
        >
          <vIcon name="co-linkedin-in" scale="1.2" />
        </a>
      </div>
    </div>

    <!-- Bottom line -->
    <div class="mt-4 text-xs text-gray-500">
      © {{ new Date().getFullYear() }} Robin Kelsick II • Built with Vue & Chart.js •
      <span style="color: #818cf8">Data tells stories among the stars.</span>
    </div>
  </footer>
</template>

<script setup>
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaGithubAlt, CoLinkedinIn } from 'oh-vue-icons/icons'

addIcons(FaGithubAlt, CoLinkedinIn)
const vIcon = OhVueIcon
</script>
