<template>
  <ShopItemViewer :id="16" :likedCount="574">
    <section class="store-info">
        <img src="/images/shop/catkey/데배.jpg" alt="배송정보" class="banner" />
        <br />
        <img src="/images/shop/catkey/데2.jpg" alt="브랜드" class="banner" />
        <br />
        <img src="/images/shop/catkey/데상세.jpg" alt="브랜드정보" class="banner" />
        <img src="/images/shop/catkey/데상세2.jpg" alt="브랜드정보" class="banner" />
        <img src="/images/shop/catkey/데상세3.jpg" alt="브랜드정보" class="banner" />
      </section>
  </ShopItemViewer>

</template>

<script setup>
import ShopItemViewer from '@/components/ShopItemViewer.vue';

</script>

<style lang="scss" scoped>
.store-info {
  display: flex;
  flex-direction: column;

  .banner {
    width: 100%;
  }

}
</style>