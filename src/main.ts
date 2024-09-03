import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/scss/main.scss'

import App from './App.vue'
import Scene from '@/components/Scene.vue'

const app = createApp(App)
app.component('Scene', Scene)

app.use(createPinia())

app.mount('#app')
