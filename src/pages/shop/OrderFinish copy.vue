<template>
  <div class="finish-wrapper" v-if="orderInfoReady">
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

    <div class="order-details">
      <h2>배송정보</h2>
      <hr>
      <div class="info-box">
        <p><strong>받는 분:</strong> {{ orderInfo.name }} / {{ orderInfo.phone }}</p>
        <p><strong>주소:</strong> {{ orderInfo.address }}</p>
      </div>
      <!-- 주문내역 컴포넌트로 대체 -->
      <OrderList :orderList="orderList" @clear="clearOrderList"/>
    </div>
  </div>
  <div v-else class="no-order-info">
    <div class="checkmark">❌</div>
    <h1 class="title">주문 정보가 없습니다</h1>
    <button class="home-button" @click="goHome">홈으로 가기</button>
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import OrderList from '@/components/OrderList.vue'

const router = useRouter()
const orderInfo = ref(null)
const orderList = ref([])

onMounted(() => {
  const raw = localStorage.getItem('orderInfo')
  orderInfo.value = raw ? JSON.parse(raw) : null
  const rawList = localStorage.getItem('orderList')
  orderList.value = rawList ? JSON.parse(rawList).reverse() : []
})
const orderInfoReady = computed(() =>
  orderInfo.value && typeof orderInfo.value === 'object' &&
  Object.keys(orderInfo.value).length > 0 &&
  'name' in orderInfo.value && 'phone' in orderInfo.value
)
function goHome() { router.push('/main') }
function goShop() { router.push('/shop') }
function clearOrderList() {
  localStorage.removeItem('orderList')
  orderList.value = []
  alert("주문 내역이 삭제되었습니다.")
}
</script>
<!-- 스타일은 기존 그대로 사용 -->


<style lang="scss" scoped>
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

  hr {
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    margin: 0;
  }

  .upper-hr {
    margin-bottom: 1rem;
  }

  .lower-hr {
    margin-top: 1rem;
  }



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

  .history-order {
    padding: 0.5rem;
  }

  li {
    margin-left: 1.75rem;
  }

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
  margin-top: 1rem;
}

.clear-button:hover {
  background: #b91c1c;
}
</style>
