<template>
  <div class="file-input">
    <label :for="idAttribute" class="button file-input__label">{{ buttonText }}</label>
    <input
      :id="idAttribute"
      class="file-input__input"
      type="file"
      :name="name"
      accept="image/png, image/jpeg"
      @change="handleUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  id: string
}
const props = defineProps<Props>()
const model = defineModel<string>({ required: false })

const idAttribute = computed(() => `${props.name}-${props.id}`)
const image = new Image()

const buttonText = computed(() => (model.value ? 'Remove artwork' : 'Add artwork'))

const handleUpload = (event: any) => {
  const file = event.target.files[0]

  if (!file.type.match(/image.*/)) {
    return
  }

  const reader = new FileReader()
  reader.onload = (readerEvent: any) => {
    image.onload = resizeImage
    image.src = readerEvent.target.result
  }

  reader.readAsDataURL(file)
}

const resizeImage = () => {
  // Resize the image
  const canvas: any = document.createElement('canvas')
  const max_size = 320
  let width = image.width
  let height = image.height

  if (width > height) {
    if (width > max_size) {
      height *= max_size / width
      width = max_size
    }
  } else {
    if (height > max_size) {
      width *= max_size / height
      height = max_size
    }
  }
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(image, 0, 0, width, height)
  const dataUrl = canvas.toDataURL('image/jpeg')
  model.value = dataUrl
}
</script>

<style lang="scss">
.file-input {
  width: 100%;
}

.file-input__input {
  display: none;
}

.file-input__label {
  width: 100%;
}
</style>
