<template>
  <div class="finish-wrapper" v-if="orderInfo">
    <div class="checkmark">✅</div>
    <h1 class="title">주문이 완료되었습니다!</h1>
    <p class="desc">
      주문해 주셔서 감사합니다.<br />
      주문내역은 마이페이지에서 확인하실 수 있습니다.
    </p>

    <div class="button-group">
      <button class="home-button" @click="goHome">홈으로 가기</button>
      <button class="shop-button" @click="goShop">계속 쇼핑하기</button>
    </div>

    <!-- 주문 정보 -->
    <div class="order-details">
      <h2>배송정보</h2>
      <div class="info-box">
        <p><strong>받는 분:</strong> {{ orderInfo.name }} / {{ orderInfo.phone }}</p>
        <p><strong>주소:</strong> {{ orderInfo.address }}</p>
      </div>

      <h2>결제한 상품</h2>
      <div v-for="item in orderedItems" :key="item.id" class="order-item">
        <img :src="item.image" alt="" class="order-img" />
        <div class="order-info">
          <p class="order-brand">{{ item.brand }}</p>
          <p class="order-name">{{ item.name }}</p>
          <p class="order-price">{{ item.price.toLocaleString() }} Point</p>
        </div>
      </div>

      <div class="summary">
        <p><strong>결제 금액:</strong> <span class="highlight">- {{ orderInfo.totalPrice.toLocaleString() }} Point</span></p>
        <p><strong>남은 포인트:</strong> {{ orderInfo.remainingPoint.toLocaleString() }} Point</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { globalStore } from '@/services/globalStore.js'
import { computed, onMounted, ref } from 'vue'

const router = useRouter()

function goHome() {
  // localStorage.removeItem('orderInfo')
  router.push('/mainView')
}
function goShop() {
  router.push('/shop')
}

// ✅ localStorage에서 orderInfo 복원 (필요할 경우)
// onMounted(() => {
//   if (!globalStore.orderInfo.name) {
//     const saved = JSON.parse(localStorage.getItem('orderInfo'))
//     if (saved) {
//       globalStore.orderInfo = {
//         ...globalStore.orderInfo,
//         ...saved
//       }
//     }
//   }
// })
 console.log(JSON.parse(localStorage.getItem('orderInfo')))
onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('orderInfo'))
  console.log(saved)
  if (saved) {
    globalStore.orderInfo = saved
    console.log(globalStore.orderInfo)
    orderInfo.value = saved;
    console.log('야호', orderInfo.value)
  }

})

// let orderInfo = globalStore.orderInfo

let orderInfo = ref(null);

// const name = computed(() => orderInfo.name || '')
// const phone = computed(() => orderInfo.phone || '')
// const address = computed(() => orderInfo.address || '')
// const orderedItems = computed(() => orderInfo.orderedItems || [])
// const totalPrice = computed(() => orderInfo.totalPrice || 0)
// const remainingPoint = computed(() => orderInfo.remainingPoint || 0)

console.log(name)
</script>

<style scoped>
.finish-wrapper {
  max-width: 480px;
  margin: auto;
  padding: 60px 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.checkmark {
  font-size: 64px;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}

.desc {
  font-size: 15px;
  color: #555;
  margin-bottom: 32px;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
}

.shop-button,
.home-button {
  padding: 12px 20px;
  background: #1e3a8a;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.shop-button:hover,
.home-button:hover {
  background: #1a337a;
}

.order-details {
  text-align: left;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
}

.order-details h2 {
  font-size: 16px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
  margin-top: 24px;
}

.info-box {
  margin-bottom: 20px;
  line-height: 1.6;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.order-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.order-info {
  font-size: 13px;
}

.order-brand {
  font-weight: bold;
}

.order-price {
  font-weight: bold;
  color: #444;
}

.summary {
  margin-top: 20px;
  font-size: 14px;
}

.summary .highlight {
  color: red;
  font-weight: bold;
}
</style>
