<template>
    <div class="order-page">
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
                <p v-if="!isValidPhone(phone) && phone" class="error-msg">형식: 010-1234-5678</p>
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
            <div v-for="item in globalStore.orderItems" :key="item.id" class="product-box">
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
                <span>보유 포인트</span><span>{{ userPoint.toLocaleString() }} Point</span>
            </div>
            <div class="summary-row">
                <span>결제 포인트</span><span>- {{ totalPrice.toLocaleString() }} Point</span>
            </div>
            <div class="summary-row total">
                <span>남은 포인트</span><span>{{ remainingPoint.toLocaleString() }} Point</span>
            </div>
        </section>

        <!-- 결제 버튼 -->
        <footer class="bottom-bar">
            <button class="pay-button" @click="submitOrder">결제하기</button>
        </footer>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { globalStore } from '@/services/globalStore.js'
import { useHead } from '@vueuse/head'

const router = useRouter()

// 배송정보
const selectedRequest = ref('')
const address = ref('(04567) 광주광역시 중구 상산로 123,\n상상타워 10층 1001호')
const name = ref('홍길동')
const phone = ref('010-1234-5678')
const userPoint = ref(20000)

// 주소 API 삽입
useHead({
    script: [
        {
            src: '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
            async: true,
            defer: true
        }
    ]
})

// 선택된 상품 ID
const selectedIds = ref(globalStore.orderItems.map(item => item.id))

const totalPrice = computed(() =>
    globalStore.orderItems
        .filter(i => selectedIds.value.includes(i.id))
        .reduce((sum, item) => sum + item.price, 0)
)

const remainingPoint = computed(() => userPoint.value - totalPrice.value)

function isValidPhone(phone) {
    const regex = /^01[016789]-\d{3,4}-\d{4}$/;
    return regex.test(phone)
}

function openAddressSearch() {
    new window.daum.Postcode({
        oncomplete(data) {
            address.value = `(${data.zonecode}) ${data.address}`
        }
    }).open()
}
onMounted(() => {
    const saved = JSON.parse(localStorage.getItem('orderInfo'))
    if (saved) {
        name.value = saved.name
        phone.value = saved.phone
        address.value = saved.address
        selectedRequest.value = saved.request
    }
})
function submitOrder() {
    if (!selectedRequest.value) return alert("배송 요청사항을 선택해 주세요.")
    if (!name.value.trim()) return alert("이름을 입력해 주세요.")
    if (!isValidPhone(phone.value)) return alert("올바른 전화번호 형식이 아닙니다. 예: 010-1234-5678")
    if (remainingPoint.value < 0) return alert("포인트가 부족합니다.")

    const orderedItems = globalStore.orderItems.filter(i => selectedIds.value.includes(i.id))

    // ✅ 주문 정보를 전역 상태에 저장
    localStorage.setItem('orderInfo', JSON.stringify({
        name: name.value,
        phone: phone.value,
        address: address.value,
        request: selectedRequest.value,
        orderedItems: orderedItems, // ✅ 주문 상품 저장
        totalPrice: totalPrice.value, // ✅ 결제 포인트 저장
        remainingPoint: remainingPoint.value // ✅ 남은 포인트 저장
    }))

    // ✅ 주문 내역 리스트에 추가 (마이페이지용)-----------------------------------
    const prevOrders = JSON.parse(localStorage.getItem('orderList')) || []
    prevOrders.push({
        id: Date.now(),
        date: new Date().toISOString(),
        name: name.value,
        phone: phone.value,
        address: address.value,
        request: selectedRequest.value,
        orderedItems,
        totalPrice: totalPrice.value,
        remainingPoint: remainingPoint.value
    })
    localStorage.setItem('orderList', JSON.stringify(prevOrders))
    // ---------------------------------------------------------------------

    const productList = orderedItems.map(i => `• ${i.brand} - ${i.name} (${i.price.toLocaleString()}P)`).join('\n')

    const confirmMsg = `✅ 결제 정보를 확인해주세요:

🧾 주문 내역:
${productList}

📍 배송지: ${address.value}
👤 수령인: ${name.value}
📞 연락처: ${phone.value}
📦 요청사항: ${selectedRequest.value}

💰 결제 금액: -${totalPrice.value.toLocaleString()}P
💳 남은 포인트: ${remainingPoint.value.toLocaleString()}P`

    const userConfirmed = confirm(confirmMsg)
    if (!userConfirmed) return

    // 장바구니 정리
    globalStore.cart = globalStore.cart.filter(i => !selectedIds.value.includes(i.id))
    globalStore.selectedCartIds = globalStore.selectedCartIds.filter(id => !selectedIds.value.includes(id))

    alert("✅ 결제가 완료되었습니다!")
    router.push('/shop/OrderFinish')

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
