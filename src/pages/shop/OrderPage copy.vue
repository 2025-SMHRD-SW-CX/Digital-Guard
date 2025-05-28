<template>
  <div class="order-page" v-if="shopStore.orderItems.length">
    <header class="header">
      <h1>주문/결제</h1>
    </header>

    <!-- 배송지 입력 -->
    <section class="address-box">
      <div class="address-title">
        <strong>배송지 | {{ name }}</strong>
        <button class="change-btn" @click="openAddressSearch">배송지 변경</button>
      </div>
      <div class="address-info">
        <div class="default-label">기본 배송지</div>
        <p v-html="address.replaceAll('\n', '<br />')"></p>
        <input v-model="name" type="text" class="info-input" placeholder="이름" />
        <input v-model="phone" class="info-input" type="tel" placeholder="전화번호" />
        <p v-if="!isValidPhone(phone) && phone" class="error-msg">형식: 01012345678</p>
      </div>

      <label class="request-label">배송 요청사항</label>
      <select class="request-select" v-model="selectedRequest">
        <option disabled value="">요청사항을 선택하세요</option>
        <option>문 앞에 놔주세요</option>
        <option>경비실에 맡겨주세요</option>
        <option>배송전에 연락주세요</option>
        <option>그외 장소(계단,밑,옥상 등)</option>
      </select>
    </section>

    <!-- 주문 상품 선택 -->
    <section class="product-section">
      <h2>주문 상품</h2>
      <div v-for="item in shopStore.orderItems" :key="item.id" class="product-box">
        <input type="checkbox" :value="item.id" v-model="selectedIds" />
        <img :src="item.image" class="product-img" />
        <div class="product-info">
          <p class="product-name">{{ item.brand }}</p>
          <p class="product-desc">{{ item.name }}</p>
          <p class="product-qty">1개</p>
          <p class="product-price">{{ item.price.toLocaleString() }} Point</p>
        </div>
      </div>
    </section>

    <!-- 결제 요약 -->
    <section class="summary-section">
      <h2>구매</h2>
      <div class="summary-row">
        <span>보유 포인트</span><span>{{ userStore.total_point }} Point</span>
      </div>
      <div class="summary-row">
        <span>결제 포인트</span><span>- {{ totalPrice.toLocaleString() }} Point</span>
      </div>
      <div class="summary-row total">
        <span>남은 포인트</span>
        <span>{{ Math.max(remainingPoint, 0).toLocaleString() }} Point</span>
      </div>
    </section>

    <!-- 결제 버튼 -->
    <footer class="bottom-bar">
      <button class="pay-button" @click="submitOrder">결제하기</button>
    </footer>
  </div>

  <!-- 모달 영역 -->
  <ModalView v-model:modelValue="showConfirmModal" title="결제 정보를 확인해주세요" type="confirm" @confirm="handleConfirmPayment">
    <template #default>
      <p style="white-space: pre-line">{{ confirmMessage }}</p>
    </template>
  </ModalView>

  <ModalView v-model:modelValue="showSuccessModal" title="완료" type="alert" @confirm="router.push('/shop/OrderFinish')">
    <template #default>
      <p>✅ 결제가 완료되었습니다!</p>
    </template>
  </ModalView>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop';
import { useUserStore } from '@/stores/user.js'
import { useHead } from '@vueuse/head'
import ModalView from '@/components/ModalView.vue'
import { useAlertStore } from "@/stores/alert";
import { addPoint, PointReason, updateUserTotalPoint } from "@/services/pointService";

const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const confirmMessage = ref('')

const router = useRouter()
const userStore = useUserStore()
const shopStore = useShopStore()
const alertStore = useAlertStore();

const selectedRequest = ref('')
const address = ref('')
const name = ref(userStore.name)
const phone = ref(userStore.phone)
const selectedIds = ref(shopStore.orderItems.map(item => item.id))

useHead({
  script: [
    {
      src: '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
      async: true,
      defer: true
    }
  ]
})

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('orderInfo'))
  if (saved) {
    name.value = saved.name
    phone.value = saved.phone
    address.value = saved.address
    selectedRequest.value = saved.request
  }
})

const totalPrice = computed(() =>
  shopStore.orderItems.filter(i => selectedIds.value.includes(i.id)).reduce((sum, item) => sum + item.price, 0)
)

const remainingPoint = computed(() => userStore.total_point - totalPrice.value)

function isValidPhone(phone) {
  return /^01[016789]\d{7,8}$/.test(phone)
}

function openAddressSearch() {
  new window.daum.Postcode({
    oncomplete(data) {
      address.value = `(${data.zonecode}) ${data.address}`
    }
  }).open()
}

async function submitOrder() {
  if (!address.value) return alertStore.warning("배송지를 선택해 주세요.", 5000);
  if (!selectedRequest.value) return alertStore.warning("배송 요청사항을 선택해 주세요.", 5000);
  if (!name.value.trim()) return alertStore.warning("이름을 입력해 주세요.", 5000);
  if (!isValidPhone(phone.value)) return alertStore.warning("올바른 전화번호 형식이 아닙니다. 예: 01012345678", 5000);
  if (remainingPoint.value < 0) return alertStore.warning("포인트가 부족합니다.", 5000);

  const productList = shopStore.orderItems
    .filter(i => selectedIds.value.includes(i.id))
    .map(i => `• ${i.brand} - ${i.name} (${i.price.toLocaleString()}P)`)
    .join('\n')

  confirmMessage.value = `✅ 결제 정보를 확인해주세요:\n\n🧾 주문 내역:\n${productList}\n\n📍 배송지: ${address.value}\n👤 수령인: ${name.value}\n📞 연락처: ${phone.value}\n📦 요청사항: ${selectedRequest.value}\n\n💰 결제 금액: -${totalPrice.value.toLocaleString()}P\n💳 남은 포인트: ${remainingPoint.value.toLocaleString()}P`
  showConfirmModal.value = true
}

async function handleConfirmPayment() {
  showConfirmModal.value = false

  if (remainingPoint.value < 0) {
    alertStore.warning("포인트가 부족합니다.", 5000);
    return;
  }

  const orderedItems = shopStore.orderItems.filter(i => selectedIds.value.includes(i.id))
  const total = totalPrice.value
  const futureRemaining = userStore.total_point - total

  // 이 시점에서 실제로만 차감
  userStore.addPoint(-total)
  await addPoint(userStore.id, -total, PointReason.PURCHASE_ITEM)
  await updateUserTotalPoint(userStore.id)

  localStorage.setItem('orderInfo', JSON.stringify({
    name: name.value,
    phone: phone.value,
    address: address.value,
    request: selectedRequest.value,
    orderedItems,
    totalPrice: total,
    remainingPoint: userStore.total_point
  }))

  const prevOrders = JSON.parse(localStorage.getItem('orderList')) || []
  prevOrders.push({
    id: Date.now(),
    date: new Date().toISOString(),
    name: name.value,
    phone: phone.value,
    address: address.value,
    request: selectedRequest.value,
    orderedItems,
    totalPrice: total,
    remainingPoint: futureRemaining
  })
  localStorage.setItem('orderList', JSON.stringify(prevOrders))

  shopStore.cart = shopStore.cart.filter(i => !selectedIds.value.includes(i.id))
  shopStore.selectedCartIds = shopStore.selectedCartIds.filter(id => !selectedIds.value.includes(id))

  showSuccessModal.value = true
}

</script>

<style scoped>
.order-page {
  max-width: 480px;
  margin: auto;
  font-family: Arial, sans-serif;
}

.header {
  padding: 16px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.address-box,
.product-section,
.summary-section {
  padding: 16px;
  border-bottom: 8px solid #f2f2f2;
}

.product-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  font-size: 13px;
}

.product-name {
  font-weight: bold;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}

.total {
  font-weight: bold;
}

.bottom-bar {
  padding: 16px;
  border-top: 1px solid #eee;
}

.pay-button {
  width: 100%;
  background: black;
  color: white;
  font-size: 16px;
  padding: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.change-btn {
  background: #eee;
  border: none;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.default-label {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  background: #eee;
  border-radius: 6px;
  color: #333;
  line-height: 1.2;
  vertical-align: middle;
}


.request-label {
  font-size: 13px;
  font-weight: bold;
  margin-top: 12px;
  display: block;
}

.request-select {
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0 8px;
  font-size: 13px;
  margin-top: 6px;
}

.info-input {
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.error-msg {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>
