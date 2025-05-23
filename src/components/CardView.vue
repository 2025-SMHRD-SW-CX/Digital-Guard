<template>
    <div class="slot-wrap">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>

.slot-wrap {
    border: 2px solid gray;
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 2vh;
}
.skyblue {
    border: 2px solid #cceeff;
  background-color: #cceeff !important;
  border-radius: 1.5vw;
  padding: 4vw 3vw;
}

</style>