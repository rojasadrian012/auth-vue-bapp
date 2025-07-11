<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen pt-20">
    <div class="max-w-4xl mx-auto bg-ct-dark-200 rounded-md flex justify-center items-center flex-col">
      <p class="text-5xl font-semibold pt-5 px-10">Bienvenido a Burnout Test CBI</p>
      <p class="py-5 px-10">Este test utiliza el Copenhagen Burnout Inventory (CBI), una herramienta que mide el nivel
        de
        agotamiento emocional en tres áreas clave: personal, relacionado con el trabajo y con los clientes. El CBI se ha
        desarrollado para abordar el burnout en diferentes contextos, no solo laborales, ayudando a identificar cómo se
        percibe y se vive el agotamiento emocional según el entorno de cada persona.
        Con tres escalas independientes, este cuestionario permite una evaluación precisa del burnout en trabajadores de
        diferentes sectores y en diversas situaciones. El objetivo es ayudar a detectar el grado de fatiga y agotamiento
        emocional, crucial para implementar estrategias efectivas de prevención y bienestar.
      </p>
      <p v-if="!true" class="pb-5 px-10">¡<router-link to="/register" class="text-blue-600">Crea tu cuenta</router-link>
        para
        comenzar el test y obtener resultados valiosos sobre tu bienestar emocional!</p>
      <p v-else class="pb-5 px-10">¡<router-link to="/cbi-test" class="text-blue-600">Inicia el test</router-link> para
        comenzar el test y obtener resultados valiosos sobre tu bienestar emocional!</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';

</script>
