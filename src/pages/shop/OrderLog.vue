<template>
  <div class="order-log-wrapper">
    <h1>나의 주문 내역</h1>
    <OrderList :orderList="orderList" @clear="clearOrderList"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import OrderList from '@/components/OrderList.vue'

const orderList = ref([])
onMounted(() => {
  const rawList = localStorage.getItem('orderList')
  orderList.value = rawList ? JSON.parse(rawList).reverse() : []
})
function clearOrderList() {
  localStorage.removeItem('orderList')
  orderList.value = []
  alert("주문 내역이 삭제되었습니다.")
}
</script>

<style scoped>
.order-log-wrapper {
  /* max-width: 8; */
  margin: auto;
  padding: 40px 20px 20px 20px;
  font-family: Arial, sans-serif;
}
h1 {
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
}
</style>
