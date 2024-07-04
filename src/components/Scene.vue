<script setup lang="ts">
import Scene from '@/babylon/scene'
import { ref, onMounted, type Ref } from 'vue'

const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)

onMounted(() => {
  console.log(canvasRef.value)
  if (canvasRef.value) {
    new Scene(canvasRef.value)
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
  height: 100vh;
  width: 100vw;
}

.scene__render-target {
  height: 100%;
  width: 100%;

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
