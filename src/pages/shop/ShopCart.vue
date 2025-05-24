<template>
  <div class="cart-wrapper">
    <!-- 상단 헤더 -->
    <header class="cart-header">
      <!-- <span class="back-icon" @click="goBack">←</span> -->
      <div class="top-bar-icons">
        <h2 class="cart-title">
          <img src="/images/bags_icon.png" alt="장바구니" class="icon-img">
          장바구니
        </h2>

      </div>
    </header>

    <!-- 비어있을 때 -->
    <div v-if="shopStore.cart.length === 0">
      장바구니가 비어 있습니다.
    </div>

    <!-- 장바구니 아이템 -->
    <div v-for="item in shopStore.cart" :key="item.id" class="cart-item">
      <input type="checkbox" :value="item.id" v-model="shopStore.selectedCartIds" />
      <img :src="item.image" class="item-image" />
      <div class="item-info">
        <div class="item-name">{{ item.name }}</div>
        <div class="item-price">{{ item.price.toLocaleString() }}Point</div>
        <button class="delete-btn" @click="remove(item.id)">🗑 삭제</button>
      </div>
    </div>

    <!-- 총액 및 구매버튼 -->
    <div class="total">
      선택된 상품 총액: <strong>{{ totalPrice.toLocaleString() }}Point</strong>
    </div>

    <button class="buy-button" @click="buy">선택한 상품 구매하기</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop';

const shopStore = useShopStore();
const router = useRouter()

// function goBack() {
//   router.back()
// }

function remove(id) {
  shopStore.cart = shopStore.cart.filter(i => i.id !== id)
  shopStore.selectedCartIds = shopStore.selectedCartIds.filter(
    sid => sid !== id
  )
}

const totalPrice = computed(() =>
  shopStore.cart
    .filter(i => shopStore.selectedCartIds.includes(i.id))
    .reduce((sum, item) => sum + item.price, 0)
)

function buy() {
  const selected = shopStore.cart.filter(i =>
    shopStore.selectedCartIds.includes(i.id)
  )

  if (selected.length === 0) {
    alert('구매할 상품을 선택해주세요.')
    return
  }

  shopStore.orderItems = selected
  router.push('/shop/OrderPage')
}
</script>

<style scoped>
.cart-wrapper {
  padding: 16px;
  font-family: 'Arial', sans-serif;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
}

.cart-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.icon-img {
  width: 2rem;
  height: 4rem;
  object-fit:contain;
}

.back-icon {
  position: absolute;
  left: 0;
  font-size: 20px;
  cursor: pointer;
  margin-left: 8px;
}

.cart-item {
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
  margin: 0 12px;
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
  color: #444;
  font-size: 14px;
  margin-bottom: 8px;
}

.delete-btn {
  padding: 6px 10px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  background-color: #ffdddd;
  color: #a00;
  cursor: pointer;
}

.total {
  margin-top: 12px;
  font-size: 16px;
  font-weight: bold;
}

.buy-button {
  margin-top: 16px;
  width: 100%;
  padding: 12px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>
