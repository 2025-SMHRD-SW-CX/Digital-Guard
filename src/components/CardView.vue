<template>
  <div
    class="card"
    @click="handleClick"
    :style="{
        padding: props.padding,
        ...props.style
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
const props = defineProps({
  onClick: {
    type: Function,
    default: null
  },
  padding: {
    type: String,
    default: "1.35rem"
  },
  style: {
    type: Object
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
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.205);
  width: 100%;
  text-align: center;
}
</style>
