<template>
    <div class="order-page">
        <header class="header">
            <span class="back">←</span>
            <h1>주문/결제</h1>
        </header>

        <section class="address-box">
            <div class="address-title">
                <strong>배송지 | {{ name }}</strong>
                <button class="change-btn" @click="openAddressSearch">배송지 변경</button>
            </div>
            <div class="address-info">
                <div class="default-label">기본 배송지</div>
                <p v-html="address.replaceAll('\n', '<br />')"></p>
                <!-- 이름 입력 -->
                <input v-model="name" type="text" class="info-input" placeholder="이름" />

                <!-- 전화번호 입력 -->
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

        <section class="product-section">
            <h2>주문 상품</h2>
            <div class="product-box">
                <img src="/images/올리브영.png" class="product-img" alt="올리브영 기프트카드" />
                <div class="product-info">
                    <p class="product-name">올리브영</p>
                    <p class="product-desc">기프트 카드 2만원권</p>
                    <p class="product-qty">1개</p>
                    <p class="product-price">18000 Point</p>
                </div>
            </div>
        </section>

        <section class="summary-section">
            <h2>구매</h2>
            <div class="summary-row">
                <span>보유 포인트</span><span>20000 Point</span>
            </div>
            <div class="summary-row">
                <span>결제 포인트</span><span>- 18000 Point</span>
            </div>
            <div class="summary-row total">
                <span>남은 포인트</span><span>2000 Point</span>
            </div>
        </section>

        <footer class="bottom-bar">
            <button class="pay-button" @click="submitOrder">결제하기</button>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

// 주소 검색 불러오는 것
useHead({
    script: [
        {
            src: '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
            async: true,
            defer: true,
        },
    ],
})



const selectedRequest = ref('')
const address = ref('(04567) 광주광역시 중구 상산로 123,\n상상타워 10층 1001호')
const name = ref('홍길동')
const phone = ref('010-1234-5678')

function isValidPhone(phone) {
  const regex = /^01[016789]-\d{3,4}-\d{4}$/
  return regex.test(phone)
}

function submitOrder() {
    if (!selectedRequest.value) {
        alert("배송 요청사항을 선택해 주세요.")
        return
        
    }
    if (!name.value.trim()) {
    alert("이름을 입력해 주세요.")
    return
    }
    if (!isValidPhone(phone.value)) {
    alert("올바른 전화번호 형식이 아닙니다.\n예: 010-1234-5678")
    return
    }
     alert(`결제가 완료되었습니다!
- 이름: ${name.value}
- 전화번호: ${phone.value}
- 주소: ${address.value}
- 요청사항: ${selectedRequest.value}`)

}
function openAddressSearch() {
    new daum.Postcode({
        oncomplete(data) {
            address.value = `(${data.zonecode}) ${data.address}`
        }
    }).open()
}
</script>

<style scoped>
.order-page {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    background: #fff;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
}

.header {
    display: flex;
    align-items: center;
    padding: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
}

.header .back {
    margin-right: 12px;
    cursor: pointer;
}

.address-box {
    padding: 16px;
    border-bottom: 8px solid #f2f2f2;
}

.address-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.change-btn {
    background: #eee;
    border: none;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
}

.address-info p {
    font-size: 13px;
    margin: 4px 0;
}

.default-label {
    font-size: 10px;
    background: #eee;
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 4px;
    color: #333;
}

.request-input {
    margin-top: 10px;
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 8px;
    resize: none;
    font-size: 13px;
}

.product-section {
    padding: 16px;
    border-bottom: 8px solid #f2f2f2;
}

.product-box {
    display: flex;
    gap: 12px;
    margin-top: 12px;
}

.product-img {
    width: 100px;
    height: auto;
    image-rendering: crisp-edges;
    border-radius: 8px;
}

.product-info {
    font-size: 13px;
}

.product-name {
    font-weight: bold;
}

.product-price {
    margin-top: 6px;
    font-weight: bold;
}

.summary-section {
    padding: 16px;
    border-bottom: 8px solid #f2f2f2;
    font-size: 13px;
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

.request-label {
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 6px;
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
