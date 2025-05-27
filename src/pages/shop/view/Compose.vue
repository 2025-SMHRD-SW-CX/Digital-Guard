<template>
  <ShopItemViewer :id="32" :likedCount="978">
    <section class="store-info">
      <img :src="`${BASE_URL}/images/shop/compose_americano/compose-banner.png`" alt="컴포즈커피 로고" class="banner" />
      <br />
      <div class="info-box">
        <h2 class="info-title">이용안내</h2>
        <ul class="info-list">
          <li>결제 시 모바일 쿠폰을 제시해 주시면 됩니다.</li>
          <li>본 상품은 테이크아웃만 가능합니다.</li>
          <li>테이크아웃 할인 미적용 매장은 이용가능매장 확인 부탁드립니다.</li>
          <li>추가 요금 1,000원 결제 시 매장에서 이용 가능합니다.</li>
          <li>본 교환권은 타 제조음료로 교환 가능하며, 차액 발생 시 추가금에 대해 지불해야 합니다. (단, 쿠폰가보다 낮은 상품으로 교환 시 잔액은 환불 드리지 않습니다.)</li>
          <li>타 쿠폰 중복사용여부, 포인트 적립 및 제휴카드 할인은 브랜드사 정책에 따릅니다.</li>
          <li>현금으로 교환이 불가합니다.</li>
        </ul>
      </div>
    </section>
  </ShopItemViewer>

</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import ShopItemViewer from '@/components/ShopItemViewer.vue';

</script>

<style lang="scss" scoped>
.store-info {
  display: flex;
  flex-direction: column;

  .banner {
    width: 100%;
  }

  .info-box {
    text-align: left;
    padding: 1rem;

    .info-title {
      text-align: center;
    }

    .info-list {
      padding-left: 2rem;
      
      li {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>