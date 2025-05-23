<template>
  <div
    class="card"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  onClick: {
    type: Function,
    default: null
  }
})

function handleClick(event) {
  // onClick prop이 전달되었으면 실행
  if (props.onClick) props.onClick(event)
}
</script>


<style lang="scss" scoped>

.card {
  background-color: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.253);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  
}
</style>
