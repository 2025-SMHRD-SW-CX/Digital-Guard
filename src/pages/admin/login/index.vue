<template>
  <div class="container">
    <CardView class="admin-login-card">
      <h1 class="login-title">관리자 로그인</h1>

      <div class="input-wrap">
        <InputField
          v-model="adminId"
          placeholder="아이디를 입력하세요"
          autocomplete="username"
          :error="showError"
          @enter="handleLogin"
        />
        <InputField
          v-model="adminPw"
          type="password"
          placeholder="비밀번호를 입력하세요"
          autocomplete="current-password"
          :error="showError"
          @enter="handleLogin"
        />
      </div>

      <button
        class="login-button"
        :disabled="isLoginDisabled || loading"
        :class="{ disabled: isLoginDisabled || loading }"
        @click="handleLogin"
      >
        {{ loading ? '로그인 중...' : '로그인' }}
      </button>
    </CardView>
    <!-- AlertView는 보통 App.vue에서 전역 렌더링됨 (여기서 import 필요 X) -->
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import CardView from '@/components/CardView.vue'
import InputField from '@/components/InputField.vue'

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useAlertStore } from '@/stores/alert'

const router = useRouter()
const adminStore = useAdminStore()
const alertStore = useAlertStore()

const adminId = ref('')
const adminPw = ref('')
const showError = ref(false)
const loading = ref(false)
const isLoginDisabled = computed(() => !adminId.value || !adminPw.value || loading.value)

const handleLogin = async () => {
  showError.value = false
  loading.value = true
  try {
    const ok = await adminStore.loginWithSupabase(adminId.value, adminPw.value)
    loading.value = false

    if (ok) {
      alertStore.success('관리자님 환영합니다!', 2000)
      router.replace('/admin/main')
    } else {
      showError.value = true
      alertStore.danger('아이디 또는 비밀번호가 올바르지 않습니다.', 2000)
    }
  } catch (e) {
    loading.value = false
    showError.value = true
    alertStore.danger('서버 오류가 발생했습니다.', 2000)
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-login-card {
  min-width: 20rem;
  max-width: 30rem;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 1.5rem;
}

.login-title {
  color: $color-primary;
  font-size: 1.7rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
}

.input-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.login-button {
  margin-top: 0.8rem;
  width: 100%;
  height: 48px;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 8px;
  color: #fff;
  background-color: $color-primary;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: background 0.2s;
}
.login-button.disabled {
  background-color: #d9d9d9;
  color: $color-dark-gray;
  cursor: not-allowed;
}

</style>