<template>
  <div class="file-input">
    <label :for="idAttribute" class="file-input__label">Upload image</label>
    <input :id="idAttribute" class="file-input__input" type="file" :name="name" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  id: string
}
const props = defineProps<Props>()

const idAttribute = computed(() => `${props.name}-${props.id}`)
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
  text-align: center;
  padding: 1px 6px;
  border: solid 2px black;
  cursor: pointer;
}
</style>
