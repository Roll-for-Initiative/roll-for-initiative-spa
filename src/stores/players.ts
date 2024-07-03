import { ref } from 'vue'
import { defineStore } from 'pinia'

import { type Player } from '../types/player'

const storeId = 'players'

export const usePlayerStore = defineStore(storeId, () => {
  const npc = ref<Player>({
    name: 'Monsters',
    modifier: 0
  })

  const players = ref<Player[]>([
    {
      name: 'Player 1',
      modifier: 0
    }
  ])

  const addPlayer = () => {
    const name = `Player ${players.value.length + 1}`
    players.value.push({
      name: name,
      modifier: 0
    })
  }

  return {
    npc,
    players,
    addPlayer
  }
})
