<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen pt-20">
    <div class="max-w-4xl mx-auto bg-ct-dark-100 rounded-md p-8">

      <!-- Loading -->
      <div v-if="loading" class="text-center">
        <p class="text-white text-xl">Cargando preguntas...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center">
        <p class="text-red-500 text-xl">{{ error }}</p>
        <button @click="retryLoad" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Reintentar
        </button>
      </div>

      <!-- Test -->
      <div v-else>
        <h1 class="text-5xl font-semibold text-center mb-8">CBI Test</h1>

        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pregunta {{ currentQuestionIndex + 1 }} de {{ questions.length }}</span>
            <span>{{ Math.round(((currentQuestionIndex + 1) / questions.length) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"></div>
          </div>
        </div>

        <!-- Single question display -->
        <div v-if="currentQuestion" class="mb-8 bg-white p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">
            {{ currentQuestion.id }}. {{ currentQuestion.question }}
          </h3>

          <div class="space-y-2">
            <label v-for="option in currentQuestion.options" :key="option.value"
              class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input type="radio" :value="option.value" v-model="answers[currentQuestion.id]" class="w-4 h-4"
                @change="handleAnswerChange">
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="flex justify-between items-center">
          <button @click="goToPreviousQuestion" :disabled="currentQuestionIndex === 0"
            class="py-2 px-4 rounded-lg transition-colors duration-200" :class="currentQuestionIndex === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'">
            ← Anterior
          </button>

          <!-- Show submit button only on last question -->
          <button v-if="isLastQuestion" @click="submitTest" :disabled="!isCurrentAnswered || submitting"
            class="py-3 px-6 rounded-lg transition-colors duration-200" :class="isCurrentAnswered && !submitting
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'">
            {{ submitting ? 'Enviando...' : 'Enviar Test' }}
          </button>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { getCbiQuestionsFn, submitCbiTest } from '@/api/question/questionApi'
import type { ICbiQuestionResult } from '@/api/question/question.types'

// Types
interface TestSubmission {
  answers: Record<number, number>
  completedAt: string
  totalQuestions: number
}

interface TestResult {
  personalBurnout: number
  workBurnout: number
  clientBurnout: number
  overallScore: number
  interpretation: string
}

// Reactive state
const questions = ref<ICbiQuestionResult['data']>([])
const loading = ref(true)
const error = ref<string | null>(null)
const submitting = ref(false)
const answers = ref<Record<number, number>>({})
const currentQuestionIndex = ref(0)

// Computed properties
const answeredCount = computed(() => Object.keys(answers.value).length)
const isTestComplete = computed(() =>
  questions.value.length > 0 && answeredCount.value === questions.value.length
)
const currentQuestion = computed(() =>
  questions.value[currentQuestionIndex.value] || null
)
const isLastQuestion = computed(() =>
  currentQuestionIndex.value === questions.value.length - 1
)
const isCurrentAnswered = computed(() =>
  currentQuestion.value ? currentQuestion.value.id in answers.value : false
)

// Methods
const loadQuestions = async () => {
  try {
    loading.value = true
    error.value = null
    const response: ICbiQuestionResult = await getCbiQuestionsFn()
    questions.value = response.data
    console.log(questions.value);
    
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

const updateProgress = () => {
  // This could trigger auto-save functionality if needed
  console.log(`Progreso: ${answeredCount.value}/${questions.value.length}`)
}

const handleAnswerChange = () => {
  updateProgress()

  // Auto-advance to next question after a short delay
  setTimeout(() => {
    if (!isLastQuestion.value) {
      goToNextQuestion()
    }
  }, 300) // Small delay for better UX
}

const goToNextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  }
}

const goToPreviousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const validateAnswers = (): boolean => {
  const missingAnswers = questions.value.filter(q => !(q.id in answers.value))

  if (missingAnswers.length > 0) {
    const missingIds = missingAnswers.map(q => q.id).join(', ')
    console.warn(`Faltan respuestas para las preguntas: ${missingIds}`)
    return false
  }

  return true
}

const submitTest = async () => {
  if (!validateAnswers()) {
    return
  }

  try {
    submitting.value = true

    const submission: TestSubmission = {
      answers: { ...answers.value },
      completedAt: new Date().toISOString(),
      totalQuestions: questions.value.length
    }

    const result: TestResult = await submitCbiTest(submission)

    // Handle successful submission
    console.log('Test enviado exitosamente:', result)

    // You could navigate to results page or show results modal
    // router.push({ name: 'TestResults', params: { result } })

  } catch (err) {
    console.error('Error al enviar el test:', err)
    error.value = 'Error al enviar el test. Por favor, intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadQuestions()
})
</script>