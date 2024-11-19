<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from './stores/user'

const useStore = useUserStore()
const isLoading = ref<boolean>(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      useStore.userId = user.uid
    } else {
      useStore.userId = ''
    }
    isLoading.value = false
  })
})
</script>

<template>
  <app-progress-spinner v-if="isLoading" class="absolute translate-center grid place-items inset-0 top-50 left-50 -translate-x-[50%]" />
  <div class="container" v-else>
    <AppHeader />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1280px;
  margin: auto;
  padding: 20px;
}
.translate-center {
  transform: translate(-50%, -50%);
}
</style>
