<template>
  <ShopItemViewer :id="1" :likedCount="729">
    <section class="store-info">
        <img src="/images/shop/olive/olive-banner.png" alt="올리브영 로고" class="banner" />
        <p class="store-text">전국 올리브영 매장과<br />온라인몰에서 포인트처럼 사용 가능</p>
        <img src="/images/shop/olive/올리브영상세설명.jpg" alt="올리브영상세설명" class="banner" />
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

  .store-text {
    text-align: center;
    padding: 1rem;
  }
}
</style>