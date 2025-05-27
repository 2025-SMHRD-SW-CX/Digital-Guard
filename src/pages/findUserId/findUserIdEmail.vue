<template>
  <div class="container">
    <!-- 제목 -->
    <h4 class="check-title">아이디를 찾기 위해 이메일을 입력해주세요.</h4>

    <!-- 입력칸 + 버튼을 같은 래퍼 안에 배치 -->
    <div class="input-wrap">
      <!-- 이메일 입력 -->
      <input
        type="text"
        placeholder="이메일"
        v-model="userEmail"
        :class="['input', { 'error-border': showError, 'normal-border': !userEmail }]"
      />

      <!-- 에러 메시지 -->
      <div v-if="showError" class="error-message">
        등록되지 않은 이메일을 입력하셨습니다.
        <br />
        <span class="error-line-2">다시 한번 확인해주세요.</span>
      </div>

      <!-- 확인 버튼 -->
      <button
        class="check-button"
        :disabled="!userEmail"
        :class="{ disabled: !userEmail }"
        @click="handleEmailSubmit"
      >
        확인
      </button>
    </div>
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/services/supabase' // Supabase 인스턴스 import

const userEmail = ref('')
const showError = ref(false)
const router = useRouter()

// 이메일 제출 핸들러
const handleEmailSubmit = async () => {
  // Supabase에서 입력된 이메일로 사용자 정보 조회
  const { data, error } = await db
    .from('user')
    .select('id')         // id만 가져옴 (보안상 최소한의 정보만)
    .eq('email', userEmail.value.trim())
    .single()

  // 조회 실패 또는 데이터 없음
  if (error || !data) {
    showError.value = true
  } else {
    showError.value = false
    // 결과 페이지로 이동하면서 id를 query로 전달
    router.push({
      path: '/findUserId/findUserIdResult',
      query: { id: data.id }
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Noto Sans KR', sans-serif;
}

.check-title {
  color: $color-primary;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.input-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.input:focus {
  border: 2px solid #ccc;
  outline: none;
}

.error-border {
  border-color: red;
}

.normal-border {
  border-color: #ccc;
}

.check-button {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 8px;
  color: white;
  background-color: $color-primary;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.disabled {
  background-color: $color-secondary;
  color : $color-dark-gray;
  cursor: not-allowed;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 14px;
}
</style>