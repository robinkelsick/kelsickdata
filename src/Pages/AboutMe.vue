<template>
  <section class="about-container flex flex-col md:flex-row items-center gap-10 p-6">
    <div class="photo-section w-full md:w-1/2 flex justify-center">
      <img
        src="https://cdn.jsdelivr.net/gh/robinkelsick/kelsickdata@main/public/me_illustration.png"
        alt="A digital illustration of a Robin Kelsick II with blond dreadlocks and a nose ring, looking upward. They wear a red hoodie and white shirt, exuding confidence."
        class="w-64 h-auto max-w-full rounded-full shadow-md"
      />
    </div>

    <div class="text-section w-full md:w-1/2 space-y-4">
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
</template>

<script setup>
function downloadResume() {
  const link = document.createElement('a')
  link.href = '/current_resume.pdf'
  link.download = 'Robin_Kelsick_Resume.pdf'
  link.click()
}
</script>
