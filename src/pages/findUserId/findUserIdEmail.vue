<template>
  <div class="container">
    <!-- 제목 -->
    <h1 class="check-title"></h1>

    <!-- 입력칸 + 버튼을 같은 래퍼 안에 배치 -->
    <div class="input-wrap">
      <!-- 이메일 입력 -->
      <input
        type="text"
        placeholder="이메일을 입력하세요"
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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userEmail = ref('')
const showError = ref(false)
const router = useRouter()

const handleEmailSubmit = () => {
  // 예시: 이메일이 "test@example.com"일 경우 성공
  if (userEmail.value === 'test@example.com') {
    showError.value = false
    router.push('/show-id') // 아이디 보여주는 페이지로 이동
  } else {
    showError.value = true
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

.container {
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Noto Sans KR', sans-serif;
}

.check-title {
  color: $color-primary;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.input-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 입력칸 스타일 */
.input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.input:focus {
  border: 2px solid $color-primary;
  outline: none;
}

.error-border {
  border-color: red;
}

.normal-border {
  border-color: #ccc;
}

/* 확인 버튼 스타일 */
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
  background-color: #ccc;
  cursor: not-allowed;
}

/* 에러 메시지 */
.error-message {
  color: red;
  text-align: center;
  font-size: 14px;
}
</style>