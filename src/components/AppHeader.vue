<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { ComputedRef } from 'vue';
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userStore = useUserStore()
const router = useRouter()

interface IMenuItem {
  label: string
  icon: string
  path: string,
  show?: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed(() => !userStore.userId),
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed(() => !!userStore.userId),
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/interviews',
    show: computed(() => !!userStore.userId),
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistics',
    show: computed(() => !!userStore.userId),
  },
])

const logout = () => {
  userStore.userId = ''
  router.push('/auth')
}
</script>

<template>
  <app-menubar :model="items">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
        <span :class="item.icon" class="p-menuitem-icon"></span>
        <span class="ml-2">{{ item.label }}</span>
      </router-link>
      </template>
    </template>
    <template #end>
      <div v-if="userStore.userId" @click="logout" class="flex align-items-center menu-exit">
        <span class="pi pi-sign-out p-p-menuitem-icon"></span>
        <span class="ml-2">Выход</span>
      </div>
    </template>
  </app-menubar>
</template>

<style scoped>
.menu {
  margin: 30px auto;
}
.menu-exit {
  cursor: pointer;
}
</style>
