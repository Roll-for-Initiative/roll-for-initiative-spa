<template>
  <transition>
    <dialog class="modal" ref="modal" v-if="modalStore.modalIsOpen" :open="true">
      <div class="modal__wrapper">
        <div class="container">
          <h1 class="modal__title display-2">{{ title }}</h1>

          <div class="modal__content row">
            <div class="col-12">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, onUnmounted, ref } from 'vue'
import { useModalStore } from '@/stores/modal'
import { addSceneKeyBindings } from '@/composables/useKeyBindings'

interface Props {
  title: string
}
defineProps<Props>()

const modalStore = useModalStore()
const modal = ref<HTMLElement | null>(null)

onMounted(() => {
  document.removeEventListener('keydown', addSceneKeyBindings)
})

onUpdated(() => {
  if (modalStore.modalIsOpen) {
    modal.value?.focus()
    document.removeEventListener('keydown', addSceneKeyBindings)
  } else {
    document.addEventListener('keydown', addSceneKeyBindings)
  }
})

onUnmounted(() => {
  document.addEventListener('keydown', addSceneKeyBindings)
})
</script>

<style lang="scss">
@use '@/assets/scss/variables' as *;

.modal {
  background-color: transparent;
  position: absolute;
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
  overflow: hidden;
}

.modal__wrapper {
  position: absolute;
  background-color: var(--rfi-body-bg);
  overflow-y: scroll;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
}

.modal__title {
  width: 100%;
  position: fixed;
  color: var(--rfi-gray-600);
  margin: 0;
  top: 1.5rem;
  z-index: 0;
}

.modal__content {
  position: relative;
  z-index: 10;
  margin-block: 6.5rem;
}
</style>

<style lang="scss" scoped>
.v-leave-from {
  opacity: 1;
}

.v-leave-to {
  opacity: 0;
}

.v-leave-active {
  pointer-events: none;
  transition: opacity 3s ease;

  .modal__wrapper {
    display: none;
  }
}
</style>
