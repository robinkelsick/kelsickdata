<template>
  <footer
    class="mt-6 sm:mt-10 py-4 sm:py-6 px-4 sm:px-6 text-center text-gray-300"
    style="
      background-color: #0f172a;
      border-top: 1px solid rgba(124, 58, 237, 0.3);
      font-family: 'Inter', sans-serif;
    "
  >
    <div class="max-w-5xl mx-auto flex flex-col items-center justify-between gap-3 sm:gap-4">
      <!-- Top: Branding -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span class="text-base sm:text-lg font-semibold" style="color: #a78bfa"
          >Robin Kelsick II</span
        >
        <span class="text-gray-500 text-xs sm:text-sm">• Data Analyst & Developer</span>
      </div>

      <!-- Middle: Navigation -->
      <nav class="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm justify-center">
        <router-link to="/" class="hover:text-indigo-400 transition">Home</router-link>
        <router-link to="/about-me" class="hover:text-indigo-400 transition">About</router-link>
        <router-link to="/projects" class="hover:text-indigo-400 transition">Projects</router-link>
        <router-link to="/contact" class="hover:text-indigo-400 transition">Contact</router-link>
      </nav>

      <!-- Bottom: Socials -->
      <div class="flex gap-4 sm:gap-5 items-center justify-center">
        <a
          href="https://github.com/robinkelsick"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-indigo-400 transition"
          aria-label="GitHub"
        >
          <vIcon name="fa-github-alt" :scale="isMobile ? '1' : '1.2'" />
        </a>
        <a
          href="https://www.linkedin.com/in/robinkelsickii/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-indigo-400 transition"
          aria-label="LinkedIn"
        >
          <vIcon name="co-linkedin-in" :scale="isMobile ? '1' : '1.2'" />
        </a>
      </div>
    </div>

    <!-- Bottom line -->
    <div class="mt-3 sm:mt-4 text-xs text-gray-500 px-2">
      <div class="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span>© {{ new Date().getFullYear() }} Robin Kelsick II</span>
        <span class="hidden sm:inline">•</span>
        <span>Built with Vue & Chart.js</span>
      </div>
      <div class="mt-1" style="color: #818cf8">Data tells stories among the stars.</div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaGithubAlt, CoLinkedinIn } from 'oh-vue-icons/icons'

addIcons(FaGithubAlt, CoLinkedinIn)
const vIcon = OhVueIcon

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
