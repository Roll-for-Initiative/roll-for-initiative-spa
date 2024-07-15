import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/scss/main.scss'

import App from './App.vue'
import router from './router'
import Scene from '@/components/Scene.vue'

const app = createApp(App)
app.component('Scene', Scene)

app.use(createPinia())
app.use(router)

app.mount('#app')
