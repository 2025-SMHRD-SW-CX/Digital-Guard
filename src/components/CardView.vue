<template>
  <div
    class="card"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>

.card {
  background-color: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
}
</style>
