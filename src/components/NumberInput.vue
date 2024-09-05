<template>
  <div class="number-input">
    <button class="number-input__button" @click="decrement">-</button>
    <input
      class="number-input__input"
      v-model="model"
      :id="idAttribute"
      :name="name"
      type="number"
      :aria-label="name"
    />
    <button class="number-input__button" @click="increment">+</button>
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
@use '@/assets/scss/mixins' as *;

.number-input {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  width: 100%;
}

.number-input__input {
  display: block;
  flex: 1 1 0;
  min-width: 0;
  text-align: center;
  background-color: transparent;
  border: none;
  padding: 0;
  color: var(--rfi-yellow);
  font-size: 1.625rem;
  line-height: 1;

  &:focus {
    outline: none;
  }
}

.number-input__button {
  @include button;
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
