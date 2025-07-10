<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen pt-20">
    <div class="max-w-4xl mx-auto bg-ct-dark-100 rounded-md p-8">

      <!-- Loading -->
      <div v-if="loading" class="text-center">
        <p class="text-white text-xl">Cargando preguntas...</p>
      </div>

      <!-- Test -->
      <div v-else>
        <h1 class="text-5xl font-semibold text-center mb-8">CBI Test</h1>

        <div v-for="question in questions" :key="question.id" class="mb-8 bg-white p-6 rounded-lg">

          <h3 class="text-lg font-medium mb-4">
            {{ question.id }}. {{ question.question }}
          </h3>

          <div class="space-y-2">
            <label v-for="option in question.options" :key="option.value"
              class="flex items-center space-x-3 cursor-pointer">
              <input type="radio" :value="option.value" v-model="answers[question.id]" class="w-4 h-4">
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <button @click="submitTest" class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600">
          Enviar Test
        </button>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { ref, onMounted } from 'vue'
import { getCbiQuesions, type Question } from '@/api/data'

// State
const questions = ref<Question[]>([])
const loading = ref(true)
const answers = ref<Record<number, number>>({}) // 👈 Tipado más específico

// Cargar datos cuando el componente se monta
onMounted(async () => {
  try {
    questions.value = await getCbiQuesions()
  } catch (error) {
    console.error('Error cargando preguntas:', error)
  } finally {
    loading.value = false
  }
})

// Función para enviar el test
const submitTest = () => {
  console.log('Respuestas:', answers.value)

  // Ejemplo de lo que verías en la consola:
  // { 1: 50, 2: 75, 3: 25, 4: 100, ... }

  // Calcular puntuación total
  const total = Object.values(answers.value).reduce((sum, value) => sum + value, 0)
  const average = total / Object.keys(answers.value).length

  console.log('Puntuación promedio:', average)
}
</script>