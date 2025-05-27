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


      <div class="history-section">
        <h2>이전 주문 내역</h2>
        <div v-for="order in orderList" :key="order.id" class="order-history-item">
          <p><strong>주문일 : </strong> {{ new Date(order.date).toLocaleString() }}</p>
          <p><strong>받는 분 : </strong> {{ order.name }} / {{ order.phone }}</p>
          <p><strong>주소 : </strong> {{ order.address }}</p>
          <p><strong>결제한 상품</strong></p>
          <ul>
            <li v-for="item in order.orderedItems" :key="item.id">
              {{ item.brand }} - {{ item.name }} ({{ item.price.toLocaleString() }}P)
            </li>
          </ul>
          <p><strong>결제 금액:</strong> {{ order.totalPrice.toLocaleString() }}P</p>
          <p><strong>남은 포인트:</strong> {{ order.remainingPoint.toLocaleString() }}P</p>
          <hr />
        </div>
      </div>
      <button class="clear-button" @click="clearOrderList">🗑 주문 목록 초기화</button>

    </div>
  </div>

</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useShopStore } from '@/stores/shop';
const shopStore = useShopStore();

const router = useRouter()

function goHome() {
  // localStorage.removeItem('orderInfo')
  router.push('/main')
}
function goShop() {
  router.push('/shop')
}
function clearOrderList() {
  const confirmClear = confirm("정말로 모든 주문 내역을 삭제하시겠습니까?")
  if (!confirmClear) return

  localStorage.removeItem('orderList')
  orderList.value = [] // 화면에서도 즉시 반영
  alert("주문 내역이 삭제되었습니다.")
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
    shopStore.orderInfo = saved
    console.log(shopStore.orderInfo)
    orderInfo.value = saved;
    console.log('야호', orderInfo.value)
  }

})
const orderList = ref([])

onMounted(() => {
  const savedOrders = JSON.parse(localStorage.getItem('orderList')) || []
  orderList.value = savedOrders.reverse() // 최근 주문이 위로 오게
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

.history-section {
  margin-top: 40px;
  text-align: left;
  font-size: 13px;
}

.order-history-item {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.clear-button {
  background: #dc2626;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
}

.clear-button:hover {
  background: #b91c1c;
}
</style>
