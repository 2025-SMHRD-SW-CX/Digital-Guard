<script setup>
import HelloWorld from '../components/HelloWorld.vue'
</script>

<template>
  <HelloWorld></HelloWorld>
  <button class="btn">버튼</button>
</template>

<style scoped>
.btn {
  background: var(--color-primary);
  color: white;
  font-family: var(--font-base);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}
</style>