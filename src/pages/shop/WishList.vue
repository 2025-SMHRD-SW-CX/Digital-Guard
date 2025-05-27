<template>
  <div class="wishlist-wrapper">
    <!-- 상단 헤더 -->
    <header class="wishlist-header">
      <!-- <span class="back-icon" @click="goBack">←</span> -->
      <h2 class="wishlist-title">
      <img :src="`${BASE_URL}/images/shop/icons/heart_icon_filled.png`" alt="장바구니" class="icon-img">
          찜한 아이템
        <img :src="`${BASE_URL}/images/shop/icons/heart_icon_filled.png`" alt="장바구니" class="icon-img">
      </h2>
    </header>

    <!-- 찜 목록이 비어있을 때 -->
    <div v-if="shopStore.wish.length === 0">
      찜한 상품이 없습니다.
    </div>

    <!-- 찜한 상품 목록 -->
    <div
      v-for="item in shopStore.wish"
      :key="item.id"
      class="wishlist-item"
    >
      <img :src="item.image" class="item-image" />
      <div class="item-info">
        <div class="item-name">{{ item.name }}</div>
        <div class="item-price">{{ item.price.toLocaleString() }}Point</div>
        <div class="buttons">
          <button class="unwish-btn" @click="remove(item.id)">❤️ 해제</button>
          <button class="cart-btn" @click="addToCart(item)">🛒 담기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
// import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop';
import { useAlertStore } from '@/stores/alert';

// const router = useRouter()
const shopStore = useShopStore();
const alertStore = useAlertStore(); 

// function goBack() {
//   router.back()
// }

function remove(id) {
  const item = shopStore.wish.find(i => i.id === id);
  shopStore.wish = shopStore.wish.filter(i => i.id !== id);

  if (item) {
    alertStore.warning(`[${item.name}] 찜 목록에서 제거되었습니다.`, 2000);
  }
}

function addToCart(item) {
  const exists = shopStore.cart.find(i => i.id === item.id);
  if (exists) {
    alertStore.danger(`[${item.name}]은(는) 이미 장바구니에 담겨 있습니다!`, 2500);
  } else {
    shopStore.cart.push(item);
    alertStore.success(`[${item.name}] 장바구니에 담겼습니다!`, 2500);
  }
}
</script>

<style scoped>

.icon-img {
  width: 2rem;
  height: 4rem;
  object-fit:contain;
}
.wishlist-wrapper {
  padding: 16px;
  font-family: Arial, sans-serif;
}

.wishlist-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
}

.wishlist-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}


.back-icon {
  position: absolute;
  left: 0;
  font-size: 20px;
  cursor: pointer;
  margin-left: 8px;
}

.wishlist-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
}

.item-price {
  font-size: 14px;
  color: #444;
  margin-bottom: 8px;
}

.buttons {
  display: flex;
  gap: 8px;
}

.unwish-btn,
.cart-btn {
  padding: 6px 10px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.unwish-btn {
  background-color: #ffd1d1;
  color: #c00;
}

.cart-btn {
  background-color: #1e3a8a;
  color: white;
}
</style>
