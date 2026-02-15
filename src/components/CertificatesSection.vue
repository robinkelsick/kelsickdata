<template>
  <section
    id="certificates"
    class="flex flex-col justify-center items-center py-12 sm:py-16 md:py-20 text-center w-full"
    style="background-color: #0b1220; color: #e6eef8; font-family: 'Inter', sans-serif"
  >
    <h2 class="text-3xl sm:text-4xl font-bold mb-8" style="font-family: 'Poppins', sans-serif;">
      Certificates
    </h2>

    <div class="max-w-4xl w-full px-4">
      <ul class="space-y-4">
        <li
          v-for="cert in certificates"
          :key="cert.title + cert.issuer"
          class="rounded-lg p-4 bg-[#071024] border border-gray-800 shadow-sm text-left"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-semibold">{{ cert.title }}</h3>
              <p class="text-sm text-gray-300 mt-1">{{ cert.issuer }} — <span class="text-gray-400">{{ cert.date }}</span></p>
            </div>
            <div class="ml-4 text-right">
              <a
                v-if="cert.href"
                :href="cert.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block text-sm text-[#38bdf8] hover:underline"
              >
                View
              </a>
            </div>
          </div>

          <p v-if="cert.description" class="text-sm text-gray-300 mt-3">{{ cert.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const certificates = ref([
  {
    title: 'Google Data Analytics',
    issuer: 'Google',
    date: '2026',
    href: 'https://coursera.org/share/157ad1b8245ecfa03e0c4fc1074e8d60',
    credentialId: 'BL93J5VM2U7Q',
    description: ''
  },
  {
    title: 'Quantium Data Analytics Job Simulation',
    issuer: 'Quantium (Via Forage)',
    date: '2026',
    href: 'https://www.theforage.com/completion-certificates/32A6DqtsbF7LbKdcq/NkaC7knWtjSbi6aYv_32A6DqtsbF7LbKdcq_697b4dce4fbf8c8be5fba240_1771019576362_completion_certificate.pdf',
    credentialId: 'BsbtnLBrTvS4oCfqh',
    description: ''
  }
])
</script>
