<template>
  <div class="cart-wrapper">
    <!-- 상단 헤더 -->
    <header class="cart-header">
      <div class="top-bar-icons">
        <h2 class="cart-title">
          <img :src="`${BASE_URL}/images/shop/icons/bags_icon.png`" alt="장바구니" class="icon-img">
          장바구니
        </h2>
      </div>
    </header>

    <!-- 비어있을 때 -->
    <div v-if="shopStore.cart.length === 0">
      장바구니가 비어 있습니다.
    </div>
    <div v-else class="select-all-box">
      <label class="custom-checkbox" for="select-all">
        <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" id="select-all" />
        <span></span>
        <p>전체선택</p>
      </label>
    </div>

    <!-- 장바구니 아이템 -->
    <div class="cart-grid">
      <div class="cart-card" v-for="item in shopStore.cart" :key="item.id">
        <!-- 체크박스 클릭영역 (별도) -->
        <div class="checkbox-wrapper" @click.stop>
          <label class="custom-checkbox">
            <input type="checkbox" :value="item.id" v-model="shopStore.selectedCartIds" class="item-check" />
            <span></span>
          </label>
        </div>
        <!-- 상품정보 클릭시 상세이동 -->
        <div class="card-content" @click="goToDetail(item)"
          style="flex:1;display:flex;align-items:center;cursor:pointer;">
          <img :src="item.image" class="item-image" />
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-price">{{ item.price.toLocaleString() }} Point</div>
            <button class="delete-btn" @click.stop="remove(item.id)">🗑 삭제</button>
          </div>
        </div>
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
import { BASE_URL } from "@/js/baseUrl";
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore, ITEMS } from '@/stores/shop'
import { useUserStore } from '@/stores/user'
import { useAlertStore } from '@/stores/alert'
import { db } from '@/services/supabase'

const shopStore = useShopStore()
const userStore = useUserStore()
const alertStore = useAlertStore()
const router = useRouter()

function goToDetail(item) {
  if (item.route) {
    router.push(`/shop/view/${item.route}`);
  } else {
    alertStore.danger(`[${item.name}] 상품은 상세페이지가 준비되어 있지 않습니다!`, 3000);
  }
}

const isAllSelected = computed(() =>
  shopStore.cart.length > 0 &&
  shopStore.cart.every(item => shopStore.selectedCartIds.includes(item.id))
)

function toggleSelectAll(e) {
  if (e.target.checked) {
    shopStore.selectedCartIds = shopStore.cart.map(item => item.id)
  } else {
    shopStore.selectedCartIds = []
  }
}

const totalPrice = computed(() =>
  shopStore.cart
    .filter(i => shopStore.selectedCartIds.includes(i.id))
    .reduce((sum, item) => sum + item.price, 0)
)

async function remove(id) {
  const item = shopStore.cart.find(i => i.id === id)
  if (!item) return

  // Supabase에서 삭제
  const { error } = await db.from('cart').delete().match({
    user_id: userStore.id,
    item_id: id
  })

  if (error) {
    alertStore.danger('장바구니 항목 삭제 실패', 3000)
    return
  }

  // 로컬 상태에서도 제거
  shopStore.cart = shopStore.cart.filter(i => i.id !== id)
  shopStore.selectedCartIds = shopStore.selectedCartIds.filter(sid => sid !== id)
  alertStore.info(`[${item.name}] 장바구니에서 제거되었습니다`, 3000)
}

function buy() {
  const selected = shopStore.cart.filter(i =>
    shopStore.selectedCartIds.includes(i.id)
  )

  if (selected.length === 0) {
    alertStore.warning('❗ 상품을 선택하지 않았습니다. <br /> 🎁구매할 상품을 선택해주세요.', 3000)
    return
  }

  // ★ 구매불가(포인트부족) 체크 추가!
  const totalSelectedPrice = selected.reduce((sum, item) => sum + item.price, 0)
  if (totalSelectedPrice > userStore.total_point) {
    alertStore.warning('❌ 포인트가 부족합니다.<br>보유 포인트보다 상품 총액이 큽니다.', 3000)
    return
  }

  shopStore.orderItems = selected
  router.push('/shop/OrderPage')
}

onMounted(async () => {
  await userStore.syncLoginCookieState()

  if (!userStore.id) return

  // cart DB에서 로딩
  const { data: cartList, error } = await db
    .from('cart')
    .select('item_id')
    .eq('user_id', userStore.id)

  if (!error && cartList) {
    const cartIds = cartList.map(c => Number(c.item_id))
    shopStore.cart = ITEMS.filter(item => cartIds.includes(item.id))
  }
})
</script>

<style lang="scss" scoped>
$color-primary: #1e3a8a;

.cart-wrapper {
  padding: 16px;
  font-family: 'Arial', sans-serif;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  // margin-bottom: 16px;
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
  object-fit: contain;
}

.cart-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}

.cart-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  width: calc(50% - 0.5rem);
  box-sizing: border-box;

  @media (max-width: 600px) {
    width: 100%;
  }
}

/* 체크박스 별도 영역 */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.8rem;
  user-select: none;
  height: 100%;
  gap: 1rem;
}

/* 카드내부 클릭영역 */
.card-content {
  flex: 1;
  display: flex;
  align-items: center;
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
  font-size: 14px;
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
  background: $color-primary;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.select-all-box {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  // gap: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  padding-left: 1.25rem;

  .checkbox-wrapper {
    margin-right: 0.6rem;
    // padding: 4px 0;
    padding: 0.5rem
  }
}

/* Custom Checkbox 스타일 */
.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 0.6rem; // 텍스트와 체크박스 사이 여백
  cursor: pointer;

  input[type="checkbox"] {
    display: none;
  }

  span {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #f1f5fa;
    border: 2.5px solid #bfc6d7;
    position: relative;
    transition: border-color 0.15s, background 0.15s;
    box-sizing: border-box;

    &::after {
      content: "";
      display: block;
      width: 12px;
      height: 7px;
      border-left: 3px solid transparent;
      border-bottom: 3px solid transparent;
      position: absolute;
      left: 7px;
      top: 8px;
      opacity: 0;
      transform: scale(1.3) rotate(-45deg);
      transition: opacity 0.15s, transform 0.15s, border-color 0.15s;
    }
  }

  input[type="checkbox"]:checked+span {
    background: $color-primary;
    border-color: $color-primary;

    &::after {
      border-left: 3px solid #fff;
      border-bottom: 3px solid #fff;
      opacity: 1;
      transform: scale(1) rotate(-45deg);
    }
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    font-weight: bold;
    user-select: none;
  }
}
</style>
