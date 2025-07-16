<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { getCbiQuestionsFn } from '@/api/question/questionApi'
import type { ICbiQuestionResult } from '@/api/question/question.types'
import CbiTest from '@/components/CbiForm.vue'
import type { Question } from '@/components/CbiForm.utils'

const questions = ref<Question[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Methods
const loadQuestions = async () => {
  try {
    loading.value = true
    error.value = null
    const response: ICbiQuestionResult = await getCbiQuestionsFn()

    questions.value = response.data.questions
  } catch (err) {
    error.value = 'Error al cargar las preguntas. Por favor, intenta de nuevo.'
    console.error('Error loading questions:', err)
  } finally {
    loading.value = false
  }
}

const retryLoad = () => {
  loadQuestions()
}

// Lifecycle
onMounted(() => {
  loadQuestions()
})
</script>

<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen pt-20">
    <div class="max-w-4xl mx-auto bg-ct-dark-100 rounded-md p-8">

      <div v-if="loading" class="text-center">
        <p class="text-white text-xl">Cargando preguntas...</p>
      </div>

      <div v-else-if="error" class="text-center">
        <p class="text-red-500 text-xl">{{ error }}</p>
        <button @click="retryLoad" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Reintentar
        </button>
      </div>

      <div v-else>
        <CbiTest :questions="questions" />
      </div>

    </div>
  </section>
</template>
