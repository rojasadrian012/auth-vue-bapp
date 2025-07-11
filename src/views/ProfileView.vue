<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen pt-20">
    <div
      class="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center"
    >
      <div>
        <p class="text-5xl font-semibold">Perfil de usuario</p>
        <div class="mt-8">
          <p class="mb-4">Identificador: {{ user?.id }}</p>
          <p class="mb-4">Nombre: {{ user?.name }}</p>
          <p class="mb-4">Correo: {{ user?.email }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useAuthStore } from '@/stores/authStore';
const authStore = useAuthStore();
const user = authStore.authUser;
</script>
