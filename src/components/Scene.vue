<script setup lang="ts">
import Scene from '@/babylon/scene'
import { usePlayerStore } from '@/stores/players'
import { ref, onMounted, type Ref } from 'vue'

const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)
const playerStore = usePlayerStore()

onMounted(() => {
  if (canvasRef.value) {
    const scene = new Scene(canvasRef.value, playerStore)
  }
})
</script>

<template>
  <div class="scene">
    <canvas ref="canvasRef" class="scene__render-target"></canvas>
  </div>
</template>

<style>
.scene {
  width: 100%;
  height: calc(100vh - 24px);
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
