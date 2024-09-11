import { useModalStore } from '@/stores/modal'
import { usePlayerStore } from '@/stores/players'

export const addGlobalKeyBindings = (e: KeyboardEvent) => {
  const modalStore = useModalStore()

  if (e.key === 'Escape') {
    modalStore.closeModal()
  }

  if (e.key === 'ArrowLeft') {
    console.log('change background')
  }

  if (e.key === 'ArrowRight') {
    console.log('change background')
  }
}

export const addSceneKeyBindings = (e: KeyboardEvent) => {
  const modalStore = useModalStore()
  const playerStore = usePlayerStore()

  if (e.key === 'p') {
    modalStore.showModal()
  }

  if (e.key === 'r') {
    modalStore.closeModal()
    playerStore.roll()
  }
}
