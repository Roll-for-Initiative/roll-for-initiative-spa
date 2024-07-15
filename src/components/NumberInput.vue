<template>
  <div class="number-input">
    <label class="number-input__label" :for="idAttribute">{{ name }}:</label>
    <button @click="decrement">-</button>
    <input
      class="number-input__input"
      v-model="model"
      :id="idAttribute"
      :name="name"
      type="number"
    />
    <button @click="increment">+</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  id: string
}
const props = defineProps<Props>()
const model = defineModel<number>({ required: true })

const idAttribute = computed(() => `${props.name}-${props.id}`)

const decrement = () => {
  model.value--
}

const increment = () => {
  model.value++
}
</script>

<style lang="scss">
.number-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.number-input__label,
.number-input__input {
  display: block;
}

.number-input__label {
  flex: 1 1 100%;
  text-transform: capitalize;
}

.number-input__input {
  flex: 1 1 auto;
}

/* Chrome, Safari, Edge, Opera */
.number-input__input::-webkit-outer-spin-button,
.number-input__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.number-input__input {
  -moz-appearance: textfield;
}
</style>
