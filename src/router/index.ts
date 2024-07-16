import { createRouter, createWebHistory } from 'vue-router'
import SetupView from '../views/SetupView.vue'
import RollView from '../views/RollView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'setup',
      component: SetupView
    },
    {
      path: '/roll',
      name: 'roll',
      component: RollView
    }
  ]
})

export default router
