<template>
    <ShopItemViewer :id="31" :likedCount="972">
        <section class="store-info">
            <img src="/images/shop/cu3000/cu-banner.jpg" alt="CU 로고" class="banner" />
            <p class="store-text">전국 CU 매장에서 사용 가능합니다</p>
            <img src="/images/shop/cu3000/CU상세페이지.png" alt="CU상품권영상세설명" class="banner" />
        </section>
    </ShopItemViewer>

</template>

<script setup>
import ShopItemViewer from '@/components/ShopItemViewer.vue';

</script>

<style lang="scss" scoped>
.store-info {
    text-align: center;
    display: flex;
    flex-direction: column;

    .banner {
        width: 100%;
    }

    .store-text {
        font-size: 15px;
        font-weight: 700;
        margin: 1rem;
    }
}
</style>
