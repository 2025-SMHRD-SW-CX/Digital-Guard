<!-- src/components/OrderList.vue -->
<template>
  <div class="order-history-section">
    <h2>주문 내역</h2>
    <hr class="upper-hr">
    <div v-if="orderList.length">
      <div v-for="order in orderList" :key="order.id" class="history-order">
        <p><strong>주문일 : </strong> {{ formatDate(order.date) }}</p>
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
        <hr class="lower-hr" />
      </div>
      <button class="clear-button" @click="clearOrderList">🗑 주문 목록 초기화</button>
    </div>
    <div v-else class="no-order-msg">주문 내역이 없습니다.</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  orderList: {
    type: Array,
    required: true,
    default: () => [],
  }
})
const emit = defineEmits(['clear'])
function clearOrderList() {
  if (confirm('정말로 모든 주문 내역을 삭제하시겠습니까?')) emit('clear')
}
function formatDate(date) {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.order-history-section {
  width: 75vw;
  margin-top: 40px;
  text-align: left;
  font-size: 13px;
}
.history-order {
  padding: 0.5rem;
}
.upper-hr {
  margin-bottom: 1rem;
}
.lower-hr {
  margin-top: 1rem;
}
li {
  margin-left: 1.75rem;
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
.no-order-msg {
  color: #999;
  text-align: center;
  padding: 1.5rem 0;
}
</style>
