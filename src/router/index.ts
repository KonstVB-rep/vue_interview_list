import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  let isAuth = false
  onAuthStateChanged(getAuth(), (user) => {
    if (user && !isAuth) {
      isAuth = true
      return next()
    }
    if (!user && !isAuth) {
      isAuth = true
      return next({ name: 'Auth' })
    }
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/PageHome.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/PageAuth.vue'),
  },
  {
    path: '/interview/:id',
    name: 'Interview',
    component: () => import('@/views/PageInterview.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/interviews/',
    name: 'Interviews',
    component: () => import('@/views/PageInterviews.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/statistics/',
    name: 'Statistics',
    component: () => import('@/views/PageStatistics.vue'),
    beforeEnter: checkAuth,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router