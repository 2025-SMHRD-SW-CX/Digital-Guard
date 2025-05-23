<template>
  <div class="welcome-page" @click="goToLogin">
    <div class="image-container">
      <img src="/images/fluent-emoji-high-contrast_party-popper.png" alt="환영 이미지" />
    </div>

    <div></div>
    <section class="welcome-message">
      <h2>디지털 가드 가입을</h2>
      <h2>환영합니다.</h2>
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
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
  padding: 40px 20px;
  font-family: 'Noto Sans KR', sans-serif;
}

.image-container {
  width: 100%;
  max-width: 350px; /* 최대 이미지 크기 제한 */
  margin-bottom: 30px;
}

.image-container img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.welcome-message {
  line-height: 1.5rem;
  font-size: 28px;
  font-weight: 600;
  color: #283A97;
  text-align: center;
}
</style>