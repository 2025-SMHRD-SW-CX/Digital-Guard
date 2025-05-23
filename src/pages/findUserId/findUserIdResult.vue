<template>
  <div class="result-page">
    <p class="label-text">등록된 아이디는</p>
    <p class="user-id">{{ userId }}</p>
    <p class="label-text">입니다.</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.result-page {
  max-width: 400px;
  margin: 40px auto;
  padding: 30px 20px;
  border-radius: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
  background-color: #e0f0ff; /* 연한 파랑 배경 */
  color: #2563eb; /* 메인 파랑 */
}

/* '등록된 아이디는', '입니다.' 텍스트 */
.label-text {
  font-weight: 400; /* 얇게 */
  font-size: 1.1rem;
  margin: 0;
  margin-bottom: 8px;
}

/* 아이디 부분을 크게, 더 굵게 */
.user-id {
  font-weight: 700;
  font-size: 2.4rem;
  margin: 0 0 12px 0;
  color: #1e40af; /* 더 진한 파랑 */
  letter-spacing: 2px;
  user-select: all; /* 아이디 복사 편하게 */
}
</style>