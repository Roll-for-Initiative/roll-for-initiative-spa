import { ref } from 'vue'
import { defineStore } from 'pinia'

const storeId = 'modal'

export type ModalStore = ReturnType<typeof useModalStore>

export const useModalStore = defineStore(storeId, () => {
  const modalIsOpen = ref<boolean>(false)

  const showModal = () => (modalIsOpen.value = true)
  const closeModal = () => (modalIsOpen.value = false)

  return {
    modalIsOpen,
    showModal,
    closeModal
  }
})
