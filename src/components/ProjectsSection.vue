<template>
  <section
    id="projects"
    class="flex flex-col justify-center items-center py-20 bg-gray-800 text-white text-center h-full w-full"
  >
    <h2 class="text-4xl font-bold mb-10">Projects</h2>

    <div
      class="grid gap-8 max-w-6xl mx-auto px-4 justify-center"
      style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))"
    >
      <router-link
        to="/genre-ratings"
        class="bg-gray-900 rounded-xl p-6 hover:bg-gray-700 transition-all block"
      >
        <h3 class="text-2xl font-semibold mb-2">Anime Ratings by Genre</h3>
        <p class="text-gray-400 mb-4">Visualizing which anime genres score highest on average.</p>
        <span class="text-indigo-400 hover:text-indigo-300">View Project →</span>
      </router-link>

      <router-link
        to="/popularity-vs-rating"
        class="bg-gray-900 rounded-xl p-6 hover:bg-gray-700 transition-all block"
      >
        <h3 class="text-2xl font-semibold mb-2">Popularity vs Rating</h3>
        <p class="text-gray-400 mb-4">Do popular anime always score higher? Let’s find out.</p>
        <span class="text-indigo-400 hover:text-indigo-300">View Project →</span>
      </router-link>
    </div>
  </section>
</template>
