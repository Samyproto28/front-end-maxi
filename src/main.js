import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import router from './router'
import App from './App.vue'

const app = createApp(App)

// ✅ CONFIGURAR PINIA - Crear instancia y usar
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')

console.log('✅ Pinia configurado correctamente')
