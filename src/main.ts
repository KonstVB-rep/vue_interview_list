import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import { ToastService, Menubar, Button, InputText, Toast } from 'primevue'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyB7MIvPfaFGov-hIU6HNd6Bh5k3h0OfBso',
  authDomain: 'interviews-ceb5f.firebaseapp.com',
  projectId: 'interviews-ceb5f',
  storageBucket: 'interviews-ceb5f.firebasestorage.app',
  messagingSenderId: '325043691617',
  appId: '1:325043691617:web:88f8d25c67c8e2c3b10a20',
  measurementId: 'G-K5Q17VFTHN',
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)

app.mount('#app')
