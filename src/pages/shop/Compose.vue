<template>
  <div>
    <!-- <div class="page-wrapper">
    <header class="top-bar">
      <span class="back">←</span>
      <img src="/images/brand.png" alt="Digital Guard" class="logo-image" />
      <div class="header-icons">
        <span class="icon" @click="goToWishlist">❤️</span>
        <span class="icon" @click="goToCart">🛍️</span>
      </div>
    </header> -->

    <main class="content">
      <div class="image-wrapper">
        <img src="/images/컴포즈아메.webp" alt="컴포즈 커피 쿠폰" class="card-image" />
      </div>
      <section class="product-info">
        <img src=/images/compose-logo.png alt="Compose coffee" class="brand-logo" />
        <!-- <p>컴포즈커피</p> -->
        <h2 class="title">아메리카노</h2>
        <!-- <div class="rating">
          ⭐⭐⭐⭐⭐ <span class="review">(134개의 후기)</span>
        </div> -->

        <div class="price-section">
          <div class="discount-line">
            <span class="discount">할인가</span>
            <span class="percent">
              -{{ calculateDiscount(product.originalPrice, product.price) }}%
            </span>
          </div>
          <div class="original-price">{{ product.originalPrice.toLocaleString() }}Point</div>
        </div>

        <div class="final-price-section">
          <div class="final-price">{{ product.price.toLocaleString() }} Point</div>
          <div class="icon-buttons">
            <button class="cart-btn" @click="addToCart">🛒</button>
          </div>
        </div>


        <div class="info-block">
          <div>📦 모바일 금액권</div>
          <div>⏳ 유효 기간 90일</div>
        </div>
      </section>

      <section class="store-info">
        <img src="/images/compose-banner.png" alt="컴포즈커피 로고" class="banner" />
        <br />
        <!-- <img src="/images/compose-상세.PNG" alt="compose상세" class="banner" /> -->
        <!-- 이용 안내 -->
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

    </main>

    <footer class="bottom-bar">
      <div class="bottom-actions">
        <div class="like-wrapper">
          <button class="like-btn" @click="toggleLike">
            {{ liked ? '❤️' : '🤍' }}
          </button>
          <span class="like-count">+{{ likeCount }}</span>
        </div>

        <button class="buy-button" @click="purchase">구매하기</button>
      </div>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop';
const shopStore = useShopStore();

const calculateDiscount = (original, price) => {
  return Math.round(((original - price) / original) * 100)
}

const router = useRouter()

const liked = ref(false)
const likeCount = ref(978)

const product = {
  id: 32,
  brand: '컴포즈커피',
  name: '아메리카노',
  price: 1600,
  originalPrice: 1800,
  image: '/images/컴포즈아메.webp'
}

onMounted(() => {
  liked.value = shopStore.wish.some(i => i.id === product.id)
})

function toggleLike() {
  const isWished = shopStore.wish.some(i => i.id === product.id)

  if (isWished) {
    shopStore.wish = shopStore.wish.filter(i => i.id !== product.id)
    liked.value = false
    likeCount.value -= 1
    alert('찜이 해제되었습니다!')
  } else {
    shopStore.wish.push(product)
    liked.value = true
    likeCount.value += 1
    alert('찜하셨습니다!')
  }
}

function addToCart() {
  const exists = shopStore.cart.find(i => i.id === product.id)
  if (!exists) {
    shopStore.cart.push(product)
    alert('장바구니에 담겼습니다!')
  } else {
    alert('이미 장바구니에 있습니다.')
  }
}
function goToCart() {
  if (confirm("장바구니로 이동하시겠습니까?")) {
    router.push('/shop/ShopCart')
  }
}
function goToWishlist() {
  if (confirm("찜목록으로 이동하시겠습니까?")) {
    router.push('/shop/WishList')
  }
}
function purchase() {
  if (confirm('결제 페이지로 이동합니다. 진행하시겠습니까?')) {
    router.push('/shop/OrderPage')
  }
}
</script>




<style scoped>
/* .page-wrapper {
  width: 100%;
  max-width: 402px;
  height: 874px;
  margin: auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: 'Arial', sans-serif;
  border: 1px solid #ddd;
} */

.top-bar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid #eee;
}

.like-box {
  background: black;
  color: white;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  min-height: 56px;
  /* ✅ 높이 맞춤 */
}

.like-btn {
  background: transparent;
  /* ✅ 배경 없애기 */
  border: none;
  font-size: 20px;
  color: red;
  cursor: pointer;
  padding: 0;
  /* ✅ 여백 제거 */
  line-height: 1;
}

.like-btn:hover {
  transform: scale(1.2);
}

.like-count {
  font-size: 12px;
  margin-top: 4px;
  color: #333;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
  /* footer 공간 확보 */
}


.buy-button {
  flex: 1;
  height: 48px;
  display: flex;
  /* ✅ 버튼 안에서 텍스트 정렬 */
  align-items: center;
  /* 수직 가운데 정렬 */
  justify-content: center;
  /* 수평 가운데 정렬 */
  background: black;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  white-space: nowrap;
}

.card-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
}

.product-info .brand {
  font-size: 14px;
  font-weight: bold;
}

.like-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
}

.discount-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.product-info .title {
  font-size: 18px;
  margin-top: 4px;
}

.rating {
  font-size: 13px;
  color: #666;
  margin-top: 6px;
}

.review {
  color: #999;
  font-size: 12px;
}

.price-section {
  margin-top: 12px;
}

.final-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.discount {
  color: red;
  font-weight: bold;
  font-size: 13px;
}

.percent {
  color: red;
  font-size: 14px;
  margin-left: 4px;
}

.original-price {
  text-decoration: line-through;
  color: gray;
  font-size: 14px;
}

.final-price {
  font-size: 20px;
  font-weight: bold;
  color: black;
}

.info-block {
  margin-top: 12px;
  font-size: 13px;
  color: #444;
  border-top: 1px solid #eee;
  padding-top: 8px;
}

.store-info {
  margin-top: 20px;
  text-align: center;
}

.banner {
  width: 80%;
  margin-bottom: 8px;
}

.store-text {
  font-size: 13px;
  line-height: 1.4;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 402px;
  margin: auto;
  padding: 12px 16px;
  border-top: 1px solid #eee;
  background: white;
  z-index: 100;
}


.bottom-actions {
  display: flex;
  align-items: flex-start;
  /* 핵심: 위쪽 정렬 */
  gap: 12px;
}

/* .bottom-bar button {
  width: 100%;
  padding: 14px;
  background: black;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;

} */
.bottom-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-image {
  height: 24px;
  object-fit: contain;
}

.brand-logo {
  height: 20px;
  object-fit: contain;
  margin-bottom: 4px;
}

.image-wrapper {
  background-color: #f5f5f573;
  /* 연한 회색 */
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.card-image {
  width: 100%;
  border-radius: 8px;
  object-fit: contain;

}

.icon-buttons {
  display: flex;
  gap: 8px;
}

.icon-buttons button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.icon-buttons button:hover {
  transform: scale(1.2);
}

.header-icons {
  display: flex;
  gap: 8px;
  font-size: 20px;
  cursor: pointer;
}

.icon {
  cursor: pointer;
}
</style>
