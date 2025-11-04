<template>
  <section class="max-w-3xl mx-auto p-6 space-y-6">
    <header class="text-center space-y-2">
      <h1 class="text-3xl font-bold">Contact</h1>
      <p class="text-gray-700">Have a project, a question, or feedback? Drop me a note.</p>
    </header>

    <!-- v-if toggles between form and success message -->
    <form
      v-if="!submitted"
      name="contact"
      netlify
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      class="space-y-4"
      @submit.prevent="handleSubmit"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p class="hidden">
        <label>
          Don’t fill this out if you’re human:
          <input name="bot-field" />
        </label>
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="block mb-1 font-medium">Name</span>
          <input
            v-model="form.name"
            type="text"
            name="name"
            required
            class="w-full border rounded-md px-3 py-2"
            placeholder="Your name"
          />
        </label>

        <label class="block">
          <span class="block mb-1 font-medium">Email</span>
          <input
            v-model="form.email"
            type="email"
            name="email"
            required
            class="w-full border rounded-md px-3 py-2"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label class="block">
        <span class="block mb-1 font-medium">Message</span>
        <textarea
          v-model="form.message"
          name="message"
          rows="6"
          required
          class="w-full border rounded-md px-3 py-2"
          placeholder="Tell me a bit about what you’re looking for…"
        ></textarea>
      </label>

      <button
        type="submit"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition"
      >
        Send Message
      </button>
    </form>

    <!-- Success message -->
    <div v-else class="text-center space-y-3">
      <h2 class="text-2xl font-semibold text-green-700">Thank you!</h2>
      <p class="text-gray-700">
        Your message has been sent successfully. I’ll get back to you soon!
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

// reactive form state
const form = reactive({
  name: '',
  email: '',
  message: '',
})

// flag for successful submission
const submitted = ref(false)

// encode data for Netlify POST
function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

// handle the form submission
async function handleSubmit() {
  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'contact',
        ...form,
      }),
    })
    submitted.value = true
  } catch (error) {
    console.error('Form submission error:', error)
  }
}
</script>
