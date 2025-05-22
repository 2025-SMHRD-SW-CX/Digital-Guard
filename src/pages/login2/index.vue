<template>
  <div class="container">
    <h1 class="login-title">로그인</h1>

    <div class="input-wrap">
        <!-- 아이디 입력 -->
        <input
        type="text"
        placeholder="아이디를 입력하세요"
        v-model="userId"
        :class="['input', { 'error-border': showError, 'normal-border': !userId }]"
        />

        <!-- 비밀번호 입력 -->
        <input
        type="password"
        placeholder="비밀번호를 입력하세요"
        v-model="password"
        :class="['input', { 'error-border': showError, 'normal-border': !password }]"
        />
    </div>
    
    <!-- 오류 메시지 -->
    <div v-if="showError" class="error-message">
    아이디나 비밀번호를 잘못 입력하셨습니다.
  <br />
  <span class="error-line-2">다시 한번 확인해주세요.</span>
</div>

    <!-- 로그인 버튼 -->
    <div class="login-button-wrapper">
      <button
        class="login-button"
        :disabled="!userId || !password"
        :class="{ disabled: !userId || !password }"
        @click="handleLogin"
      >
        로그인
      </button>
    </div>

    <!-- 아이디/비밀번호 찾기 -->
    <div class="find-section">
      <span class="find-link">아이디 찾기</span>
      <span class="divider">|</span>
      <span class="find-link">비밀번호 찾기</span>
    </div>

    <!-- 구분선 + 텍스트 -->
    <div class="divider-with-text">
      <span class="line"></span>
      <span class="divider-text">다른 앱과 연동을 하셨다면</span>
      <span class="line"></span>
    </div>

    <!-- 소셜 로그인 원형 버튼들 -->
    <div class="social-circle-login">
      <button class="circle google" title="Google"></button>
      <button class="circle kakao" title="Kakao"></button>
      <button class="circle naver" title="Naver"></button>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userId = ref("");
const password = ref("");
const showError = ref(false);
const router = useRouter();

const handleLogin = () => {
      // 예시 조건: 아이디와 비밀번호가 둘 다 "admin"일 때만 통과
      if (userId.value === "admin" && password.value === "admin") {
        alert("로그인 성공!");
        showError.value = false;
        router.push('/mainView');
      } else {
        showError.value = true;
      }
    }

  const isValidInput = () => {
    if (showError.value) {

    }
  }

// export default {
//   data() {
//     return {
//       userId: "",
//       password: "",
//       showError: false,
//     };
//   },
//   methods: {
//     handleLogin() {
//       // 예시 조건: 아이디와 비밀번호가 둘 다 "admin"일 때만 통과
//       if (this.userId === "admin" && this.password === "admin") {
//         alert("로그인 성공!");
//         this.showError = false;
//       } else {
//         this.showError = true;
//       }
//     },
//   },
// };
</script>

<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');


/* 전체 모바일 컨테이너 */
.container {
  /* width: 100vw; */
  margin: 0 auto;
  padding: 24px;
  font-family: sans-serif;
}

.login-title{
    color : $color-primary;
}

.input-wrap {
    /* border: 1px solid red; */
    /* width: 100%; */
}

/* 입력칸 공통 스타일 */
.input {
  width: 100%;
  /* padding: 12px; */
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  padding: 0.7rem;
}

.input:focus {
  border: 2px solid $color-primary; 
  outline: none; 
}

/* 에러 테두리 */
.error-border {
  border-color: red;
}

.normal-border {
  border-color: #ccc;
}

/* 로그인 버튼 래퍼 */
.login-button-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

/* 로그인 버튼 */
.login-button {
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
}

/* 비활성화 상태 */
.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 아이디/비밀번호 찾기 */
.find-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.find-link {
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s;
}

/* 마우스를 올렸을 때 파란색으로 변경 */
.find-link:hover {
  color: $color-primary;
  font-weight: 600;
}

.divider {
  margin: 0 12px;
  color: #ccc;
}

/* 에러 메시지 */
.error-message {
  color: red;
  text-align: center;
  font-size: 14px;
  margin-bottom: 12px;
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
  background-color: #ccc;
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

/* 공통된 원형 버튼 스타일 */
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

/* 카카오톡 */
.kakao {
  background-color: #fee500;
  background-image: url('https://cdn-icons-png.flaticon.com/512/3669/3669973.png');
  background-size: 90%;
}

/* 네이버 */
.naver {
  background-color: white;
  background-image: url('https://mblogthumb-phinf.pstatic.net/MjAyMjEyMTVfMTE0/MDAxNjcxMDkwNjU3NTkw.KoGra3iQfkuqnbSFoQ7PA3YMqnExItsdfOLk960Rxnkg.umx5uLYTj2TEMhx7rMA5uNxvyJD2T42OSeSFsxNUQygg.PNG.y2kwooga/%EB%84%A4%EC%9D%B4%EB%B2%84_AI-04.png?type=w800');
  background-size: 140%;
  border: 1px solid #03c75a;
}
</style>