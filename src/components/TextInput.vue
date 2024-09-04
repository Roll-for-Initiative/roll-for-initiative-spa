<template>
  <input
    class="text-input__input"
    v-model="model"
    :id="idAttribute"
    :name="name"
    type="text"
    :aria-label="name"
  />
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
.text-input__input {
  display: block;
  width: 100%;
  font-family: 'Jacquard 12 Charted';
  font-size: 32px;
  line-height: 1;

  border: solid 1px var(--bs-yellow);
  box-shadow: inset -2px 2px 0 #000;

  &:focus {
    outline: none;
  }
}
</style>
