<template>
  <div class="text-input">
    <label class="text-input__label" :for="idAttribute">{{ name }}:</label>
    <input class="text-input__input" v-model="model" :id="idAttribute" :name="name" type="text" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  id: string
}

const props = defineProps<Props>()
const model = defineModel<string>()

const idAttribute = computed(() => `${props.name}-${props.id}`)
</script>

<style lang="scss">
.text-input {
  width: 100%;
}

.text-input__label,
.text-input__input {
  display: block;
  width: 100%;
}

.text-input__label {
  text-transform: capitalize;
}
</style>
