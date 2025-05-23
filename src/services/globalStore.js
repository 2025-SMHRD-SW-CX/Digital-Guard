// src/services/globalStore.js
import { reactive } from 'vue'

export const globalStore = reactive({
  cart: [],
  wish: [],
  selectedCartIds: [] // ✅ 선택된 장바구니 항목의 id 저장
})
