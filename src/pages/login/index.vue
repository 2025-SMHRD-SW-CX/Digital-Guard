<template>
  <div class="container">
    <h1 class="login-title"></h1>

    <div class="input-wrap">
      <InputField v-model="userId" placeholder="아이디를 입력하세요" autocomplete="username" :error="showError"
        @enter="handleLogin" />
      <InputField v-model="userPw" type="password" placeholder="비밀번호를 입력하세요" autocomplete="current-password"
        :error="showError" @enter="handleLogin" />
    </div>

    <!-- 로그인 버튼 -->
    <button class="login-button" :disabled="isLoginDisabled" :class="{ disabled: isLoginDisabled }"
      @click="handleLogin">
      로그인
    </button>

    <!-- 아이디/비밀번호 찾기 -->
    <div class="find-section">
      <span class="find-link" @click="goToRegister">회원가입</span>
      <span class="divider">|</span>
      <span class="find-link" @click="goToFindId">아이디 찾기</span>
      <span class="divider">|</span>
      <span class="find-link" @click="goToFindPw">비밀번호 찾기</span>
    </div>

    <!-- 구분선 + 텍스트 -->
    <div class="divider-with-text">
      <span class="line"></span>
      <span class="divider-text">다른 소셜 플랫폼과 연동을 하셨다면</span>
      <span class="line"></span>
    </div>

    <!-- 소셜 로그인 원형 버튼들 -->
    <div class="social-circle-login">
      <button class="circle google" title="Google"></button>
      <button class="circle facebook" title="Facebook"></button>
      <button class="circle naver" title="Naver"></button>
      <button class="circle kakao" title="Kakao"></button>
    </div>
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAlertStore } from '@/stores/alert'
import InputField from '@/components/InputField.vue'

const userStore = useUserStore()
const alertStore = useAlertStore()
const router = useRouter()

const userId = ref('')
const userPw = ref('')
const showError = ref(false)
const isLoginDisabled = computed(() => !userId.value || !userPw.value)

const handleLogin = async () => {
  try {
    const data = await userStore.loginWithSupabase(userId.value, userPw.value)
    alertStore.success(`${data.nickname || data.name} 님 어서오세요!`, 2000)
    router.push('/main')
  } catch (error) {
    showError.value = true // <--- 이 부분 추가해야 에러 메시지 뜸
    alertStore.danger(error.message, 2000)
    return
  }
}

const goToRegister = () => {
  router.push('/signup')
}

const goToFindId = () => {
  router.push('/findUserId')
}

const goToFindPw = () => {
  router.push('/findUserPw')
}

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  font-family: 'Noto Sans KR', sans-serif;
}

.input-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.login-title {
  color: $color-primary;
}

/* 로그인 버튼 래퍼 */
.login-button-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

/* 로그인 버튼 */
.login-button {
  margin-top: 0.5rem;
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 8px;
  color: #ffffff;
  background-color: $color-primary;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.disabled {
  background-color: #D9D9D9;
  color: $color-dark-gray;
  cursor: not-allowed;
}

/* 아이디/비밀번호 찾기 */
.find-section {
  display: flex;
  margin-top: 0.5rem;
  justify-content: center;
  align-items: center;
}

.find-link {
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s;
}

.find-link:hover {
  color: $color-primary;
  font-weight: 600;
}

.divider {
  margin: 0 12px;
  color: $color-secondary;
}

/* 구분선 + 가운데 텍스트 */
.divider-with-text {
  display: flex;
  align-items: center;
  margin: 24px 0 16px;
}

.divider-with-text .line {
  flex: 1;
  height: 1px;
  background-color: $color-secondary;
}

.divider-text {
  padding: 0 10px;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

/* 소셜 로그인 원형 버튼들 */
.social-circle-login {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-size: 60%;
  background-position: center;
  background-repeat: no-repeat;
}

/* Google 로고 */
.google {
  background-color: white;
  border: 1px solid #ccc;
  background-image: url('https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg');
}

/*페이스북*/
.facebook {
  background-color: #1777F0;
  background-image: url('https://blog.kakaocdn.net/dn/UGS0q/btree5Viurw/l07AH1VgWJHm4stsAHLdL0/img.png');
  background-size: 100%;
}

/* 네이버 */
.naver {
  background-color: white;
  background-image: url('https://m.coffeeclan.net/moa/img/default/login_naver.png');
  background-size: 110%;
  border: 1px solid #2AB605;
}

.kakao {
  background-color: #fee500;
  background-image: url('https://blog.kakaocdn.net/dn/brM6mu/btrcf8lfrea/KLb7HhbYVmlebzfvzGDGXk/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1%20%EB%A1%9C%EA%B3%A0%20%EB%9D%BC%EC%9A%B4%EB%93%9C.png?attach=1&knm=img.png');
  background-size: 80%;
}
</style>
