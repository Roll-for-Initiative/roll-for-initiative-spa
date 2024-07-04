import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { type Player } from '../types/player'

const storeId = 'players'

export const usePlayerStore = defineStore(storeId, () => {
  const dungeonMaster = ref<Player>({
    id: crypto.randomUUID(),
    name: 'Monsters',
    modifier: 0
  })

  const players = ref<Player[]>([
    {
      id: crypto.randomUUID(),
      name: 'Player 1',
      modifier: 0
    }
  ])

  const playerCount = computed(() => players.value.length)

  const addPlayer = () => {
    const name = `Player ${playerCount.value + 1}`
    players.value.push({
      id: crypto.randomUUID(),
      name: name,
      modifier: 0
    })
  }

  const deletePlayer = (id: string) => {
    const index = players.value.findIndex((p) => p.id === id)

    if (index > -1) {
      players.value.splice(index, 1)
    }
  }

  return {
    dungeonMaster,
    players,
    playerCount,
    addPlayer,
    deletePlayer
  }
})
