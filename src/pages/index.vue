<template>
  <WorkFlow/>
  <!-- <button class="btn">버튼</button> -->
  <!-- <router-link to="/about" tag="button" class="btn">
    About 버튼
  </router-link> -->
</template>

<script setup>
import WorkFlow from '@/components/WorkFlow.vue'
</script>

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