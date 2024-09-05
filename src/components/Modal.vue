<template>
  <dialog ref="modal" :open="playerStore.modalIsOpen" @keydown.esc="closeModal">
    <slot></slot>
  </dialog>
</template>

<script setup lang="ts">
import { onUpdated, ref } from 'vue'
import { usePlayerStore } from '@/stores/players'

const playerStore = usePlayerStore()

const modal = ref<HTMLElement | null>(null)

const closeModal = () => {
  playerStore.closeModal()
}

onUpdated(() => {
  if (playerStore.modalIsOpen) {
    modal.value?.focus()
  }
})
</script>

<style lang="scss">
@use '@/assets/scss/variables' as *;

dialog {
  background-color: var(--rfi-body-bg);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  border: 0;
  color: unset;
}
</style>
