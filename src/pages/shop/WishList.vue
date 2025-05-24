<template>
  <div class="wishlist-wrapper">
    <!-- 상단 헤더 -->
    <header class="wishlist-header">
      <span class="back-icon" @click="goBack">←</span>
      <h2 class="wishlist-title">
      <img src="/images/heart_icon_filled.png" alt="장바구니" class="icon-img">
          찜한 아이템
        <img src="/images/heart_icon_filled.png" alt="장바구니" class="icon-img">
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

<script setup>
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop';

const router = useRouter()
const shopStore = useShopStore();

function goBack() {
  router.back()
}

function remove(id) {
  shopStore.wish = shopStore.wish.filter(i => i.id !== id)
}

function addToCart(item) {
  const exists = shopStore.cart.find(i => i.id === item.id)
  if (exists) {
    alert(`${item.name}은(는) 이미 장바구니에 담겨 있습니다!`)
  } else {
    shopStore.cart.push(item)
    alert(`${item.name} 장바구니에 담겼습니다!`)
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
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
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
