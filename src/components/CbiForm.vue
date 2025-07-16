<script setup lang="ts">
import { submitCbiTest, type ITestResultApi, type ITestSubmissionApi } from '@/api/question/questionApi';
import { computed, ref } from 'vue';
import type { Question } from './CbiForm.utils';

interface Props {
    questions: Question[];
}

const { questions } = defineProps<Props>();

const title = ref<string>("")
const answers = ref<Record<number, number>>({})
const currentQuestionIndex = ref(0)
const submitting = ref(false)
const error = ref<string | null>(null)

const answeredCount = computed(() => Object.keys(answers.value).length)
const isTestComplete = computed(() =>
    questions.length > 0 && answeredCount.value === questions.length
)
const currentQuestion = computed(() =>
    questions[currentQuestionIndex.value] || null
)
const isLastQuestion = computed(() =>
    currentQuestionIndex.value === questions.length - 1
)
const isCurrentAnswered = computed(() =>
    currentQuestion.value ? currentQuestion.value.id in answers.value : false
)


const goToNextQuestion = () => {
    if (currentQuestionIndex.value < questions.length - 1) {
        currentQuestionIndex.value++
    }
}

const goToPreviousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
    }
}

const handleAnswerChange = () => {
    updateProgress()
    setTimeout(() => {
        if (!isLastQuestion.value) {
            goToNextQuestion()
        }
    }, 250)
}

const updateProgress = () => {
    console.log(answeredCount.value, questions.length, answers.value, isLastQuestion.value);

    console.log(`Progreso: ${answeredCount.value}/${questions.length}`)
}

const validateAnswers = (): boolean => {
    const missingAnswers = questions.filter(q => !(q.id in answers.value))

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

        const submission: ITestSubmissionApi = {
            answers: { ...answers.value },
            completedAt: new Date().toISOString(),
            totalQuestions: questions.length
        }

        const result: ITestResultApi = await submitCbiTest(submission)

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

</script>


<template>

    <h1 class="text-5xl font-semibold text-center mb-8">{{ title }}</h1>

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

    <div v-if="currentQuestion" class="mb-8 bg-white p-6 rounded-lg">
        <h3 class="text-lg font-medium mb-4">
            {{ currentQuestionIndex + 1 }}. {{ currentQuestion.question }}
        </h3>

        <div class="space-y-2">
            <label v-for="option in currentQuestion.options" :key="option.id"
                class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input type="radio" :value="option.id" v-model="answers[+currentQuestion.id]" class="w-4 h-4"
                    @change="handleAnswerChange">
                <span>{{ option.label }}</span>
            </label>
        </div>
    </div>

    <div class="flex justify-between items-center">
        <button @click="goToPreviousQuestion" :disabled="currentQuestionIndex === 0"
            class="py-2 px-4 rounded-lg transition-colors duration-200" :class="currentQuestionIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'">
            ← Anterior
        </button>

        <button v-if="isLastQuestion" @click="submitTest" :disabled="!isCurrentAnswered || submitting"
            class="py-3 px-6 rounded-lg transition-colors duration-200" :class="isCurrentAnswered && !submitting
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'">
            {{ submitting ? 'Enviando...' : 'Enviar Test' }}
        </button>
    </div>
</template>
