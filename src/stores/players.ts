import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { type Player } from '../types/player'

const storeId = 'players'

export type PlayerStore = ReturnType<typeof usePlayerStore>

export const usePlayerStore = defineStore(storeId, () => {
  const generatePlayer = (name: string): Player => ({
    id: crypto.randomUUID(),
    name,
    modifier: 0,
    imgUrl: '',
    roll: 0,
    reroll: null
  })

  const dungeonMaster = ref<Player>(generatePlayer('Monsters'))
  const players = ref<Player[]>([generatePlayer('Player 1')])
  const results = ref<Player[]>([dungeonMaster.value, ...players.value])

  const playerCount = computed(() => players.value.length)

  const addPlayer = () => {
    const name = `Player ${playerCount.value + 1}`
    players.value.push(generatePlayer(name))
  }

  const deletePlayer = (id: string) => {
    const index = players.value.findIndex((p) => p.id === id)

    if (index > -1) {
      players.value.splice(index, 1)
    }
  }

  const updatePlayer = (id: string, value: any) => {
    const index = players.value.findIndex((p) => p.id === id)

    players.value[index].name = value.name
    players.value[index].modifier = value.modifier
    players.value[index].imgUrl = value.imgUrl
  }

  const updateDungeonMaster = (value: any) => {
    dungeonMaster.value.name = value.name
    dungeonMaster.value.modifier = value.modifier
    dungeonMaster.value.imgUrl = value.imgUrl
  }

  const randomDice = (modifier: number, faceCount: number = 20): number =>
    Math.floor(Math.random() * faceCount) + 1 + modifier

  const roll = () => {
    // group DM and players together
    const allPlayers = [dungeonMaster.value, ...players.value]

    // do initial round of rolls
    allPlayers.forEach((player) => {
      player.reroll = null
      player.roll = randomDice(player.modifier)
    })

    // decide initial
    allPlayers.sort((a, b) => b.roll - a.roll)

    for (let i = 0; i < allPlayers.length - 1; i++) {
      const playerA = allPlayers[i]
      const playerB = allPlayers[i + 1]

      // if two players rolled the same, reroll until unique results
      if (playerA.roll === playerB.roll) {
        while (playerA.reroll === playerB.reroll) {
          playerA.reroll = randomDice(playerA.modifier)
          playerB.reroll = randomDice(playerB.modifier)
        }

        // swap positions if player B has a higher roll
        if (playerB.reroll! > playerA.reroll!) {
          allPlayers[i] = playerB
          allPlayers[i + 1] = playerA
        }
      }
    }

    results.value = allPlayers
  }

  const clearPlayers = () => {
    players.value = [generatePlayer('Player 1')]
  }

  const clearAll = () => {
    dungeonMaster.value = generatePlayer('Monsters')
    players.value = [generatePlayer('Player 1')]
  }

  return {
    dungeonMaster,
    players,
    playerCount,
    results,
    addPlayer,
    deletePlayer,
    updatePlayer,
    updateDungeonMaster,
    roll,
    clearPlayers,
    clearAll
  }
})
