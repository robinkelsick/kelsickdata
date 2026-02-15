<template>
  <nav class="flex items-center justify-between p-4 bg-gray-900 text-white">
    <!-- Left: Logo or Name -->
    <router-link to="/" class="text-xl font-bold tracking-tight z-50">
      Kelsick<span class="text-blue-400">Data</span>
    </router-link>

    <!-- Hamburger Button (Mobile Only) -->
    <button
      @click="isOpen = !isOpen"
      class="md:hidden z-50 flex flex-col gap-1.5 w-6 h-6 justify-center"
      aria-label="Toggle menu"
    >
      <span
        class="block h-0.5 w-full bg-white transition-transform"
        :class="isOpen ? 'rotate-45 translate-y-2' : ''"
      ></span>
      <span
        class="block h-0.5 w-full bg-white transition-opacity"
        :class="isOpen ? 'opacity-0' : ''"
      ></span>
      <span
        class="block h-0.5 w-full bg-white transition-transform"
        :class="isOpen ? '-rotate-45 -translate-y-2' : ''"
      ></span>
    </button>

    <!-- Desktop Links (Hidden on Mobile) -->
    <div class="hidden md:flex gap-6">
      <router-link
        to="/"
        class="hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
      >
        Home
      </router-link>

      <router-link
        to="/about-me"
        class="hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
      >
        About
      </router-link>

      <router-link
        to="/projects"
        class="hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
      >
        Projects
      </router-link>

      <router-link
        to="/certificates"
        class="hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
      >
        Certificates
      </router-link>

      <router-link
        to="/contact"
        class="hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
      >
        Contact
      </router-link>
    </div>

    <!-- Mobile Menu (Full Screen Overlay) -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-900 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
    >
      <router-link
        to="/"
        class="text-2xl hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
        @click="isOpen = false"
      >
        Home
      </router-link>

      <router-link
        to="/about-me"
        class="text-2xl hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
        @click="isOpen = false"
      >
        About
      </router-link>

      <router-link
        to="/projects"
        class="text-2xl hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
        @click="isOpen = false"
      >
        Projects
      </router-link>

      <router-link
        to="/certificates"
        class="text-2xl hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
        @click="isOpen = false"
      >
        Certificates
      </router-link>

      <router-link
        to="/contact"
        class="text-2xl hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
        @click="isOpen = false"
      >
        Contact
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>
