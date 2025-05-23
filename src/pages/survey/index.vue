<template>

    <p>설문페이지!</p><p>설문페이지!</p><p>설문페이지!</p><p>설문페이지!</p>

</template>

<script setup>
    import { useHeaderStore } from '@/stores/header';
    import { onMounted } from 'vue';
    
    const header = useHeaderStore();

    onMounted(() => {
        header.setTitle("설문조사");
    })
</script>

<style lang="scss" scoped>

</style>