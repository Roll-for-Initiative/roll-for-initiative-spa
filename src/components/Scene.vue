<script setup lang="ts">
import { ref, watch, onMounted, type Ref } from 'vue'

import Scene from '@/babylon/scene'
import { usePlayerStore } from '@/stores/players'

const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)
const playerStore = usePlayerStore()

let scene: Scene | null = null

onMounted(async () => {
  if (canvasRef.value) {
    scene = new Scene(canvasRef.value, playerStore)
    await scene.init()
  }
})

watch(
  () => playerStore.results,
  async (val) => {
    if (scene) {
      await scene.clearScene()
      await scene.readPlayersFromLocalStore()
    }
  }
)
</script>

<template>
  <main class="scene">
    <canvas ref="canvasRef" class="scene__render-target"></canvas>
  </main>
</template>

<style>
.scene {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/models/1280x960-terrain-wa.avif');
  background-size: cover;
}

.scene__render-target {
  width: 100%;
  height: 100%;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  /* mobile webkit */
}
</style>
