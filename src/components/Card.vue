<template>
  <div class="card" :class="{ 'card--centered': centered }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  centered?: boolean
}

withDefaults(defineProps<Props>(), {
  centered: false
})
</script>

<style lang="scss">
.card {
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.5rem;
  border: solid 4px #000;
  border-radius: 3px;
  background-color: var(--rfi-black);
  background-size: cover;
  padding: 0.5rem;
  aspect-ratio: 3/4;
}

.card--centered {
  justify-content: center;
  align-items: center;
}
</style>
