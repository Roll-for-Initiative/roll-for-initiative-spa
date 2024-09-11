import { usePlayerStore } from '@/stores/players'

export const useLocalStorage = () => {
  const playerStore = usePlayerStore()

  const loadStateFromLocalStorage = () => {
    const jsonState = localStorage.getItem(playerStore.$id)

    if (jsonState) {
      const state = JSON.parse(jsonState || '{}')
      playerStore.$patch(state)
    }
  }

  loadStateFromLocalStorage()
}
