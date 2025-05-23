<template>
  <div class="welcome-page" @click="goToLogin">
    <div class="image-container">
      <img src="/images/fluent-emoji-high-contrast_party-popper.png" alt="환영 이미지" />
    </div>

    <div></div>
    <section class="welcome-message">
      <h2>디지털 가드 가입을 환영합니다.</h2>
    </section>
  </div>
</template>

<script setup>
defineOptions({
  name: "WelcomePage",
});

import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () =>{
    router.push('/login');
}
</script>

<style scoped>
.welcome-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Noto Sans KR', sans-serif;
}

.image-container {
  height: 100%;
  max-height: 30vh;
  margin-bottom: 30px;
}

.image-container img {
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.welcome-message {
  text-wrap: balance;
  word-break: keep-all;
  font-size: 1.5rem;
  font-weight: 600;
  color: #283A97;
  text-align: center;
}
</style>