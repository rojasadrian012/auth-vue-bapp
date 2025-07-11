<template>
  <header class="bg-white h-20">
    <nav class="h-full flex justify-between container items-center">
      <div>
        <router-link to="/" class="text-ct-dark-600 font-semibold">Burnout Test CBI</router-link>
      </div>
      <ul class="flex items-center gap-4">
        <li><router-link to="/" class="text-ct-dark-600">Inicio</router-link></li>
        <li v-if="!user">
          <router-link to="/register" class="text-ct-dark-600">Registrase</router-link>
        </li>
        <li v-if="!user">
          <router-link to="/login" class="text-ct-dark-600">Iniciar Sesión</router-link>
        </li>
        <li v-if="user">
          <router-link to="/cbi-test" class="text-ct-dark-600">Iniciar Test</router-link>
        </li>
        <li v-if="user">
          <router-link to="/profile" class="text-ct-dark-600">Mi perfil</router-link>
        </li>
        <li v-if="user" class="cursor-pointer" @click="handleLogout">Cerrar Sesión</li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { logoutUserFn } from '@/api/authApi';
import { useMutation } from 'vue-query';
import { useAuthStore } from '@/stores/authStore';
import { createToast } from 'mosha-vue-toastify';

const authStore = useAuthStore();

const user = authStore.authUser;

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
    authStore.setAuthUser(null);
    document.location.href = '/login';
  },
  onError: (error) => {
    if (Array.isArray((error as any).response.data.error)) {
      (error as any).response.data.error.forEach((el: any) =>
        createToast(el.message, {
          position: 'top-right',
          type: 'warning',
        })
      );
    } else {
      createToast((error as any).response.data.message, {
        position: 'top-right',
        type: 'danger',
      });
    }
  },
});

const handleLogout = () => {
  logoutUser();
};
</script>
