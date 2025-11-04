<template>
  <nav class="flex items-center justify-between p-4 bg-gray-900 text-white">
    <!-- Left: Logo or Name -->
    <router-link to="/" class="text-xl font-bold tracking-tight">
      Kelsick<span class="text-blue-400">Data</span>
    </router-link>

    <!-- Right: Links -->
    <div class="flex gap-6">
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
        to="/contact"
        class="hover:text-blue-400 transition-colors"
        active-class="text-blue-400 font-semibold"
      >
        Contact
      </router-link>
    </div>
  </nav>
</template>
