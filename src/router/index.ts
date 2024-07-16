import { createRouter, createWebHistory } from 'vue-router'
import SetupView from '../views/SetupView.vue'
import RollView from '../views/RollView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'roll',
      component: RollView
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupView
    }
  ]
})

export default router
