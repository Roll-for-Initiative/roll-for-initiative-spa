<template>
  <div>
    {{ player.name }}
    {{ player.modifier }}
  </div>
</template>

<script setup lang="ts">
import { type Player } from '../types/player'

defineProps<{ player: Player }>()
</script>
