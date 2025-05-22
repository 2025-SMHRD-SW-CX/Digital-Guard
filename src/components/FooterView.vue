<template>
  <!-- 푸터 -->
  <div class="footer-wrap">
    <button class="footer-btn" @click="goToEdu">
      <img src="/images/footer_edu.png" alt="교육" />
    </button>
    <button class="footer-btn" @click="goToSurvey">
      <img src="/images/footer_survey.png" alt="설문" />
    </button>

    <div class="footer-logo-wrap" @click="goToHome">
      <img src="/images/logo.png" class="footer-logo" alt="로고" />
    </div>

    <button class="footer-btn" @click="goToShop">
      <img src="/images/footer_shop.png" alt="상점" />
    </button>
    <button class="footer-btn" @click="goToMypage">
      <img src="/images/footer_mypage.png" alt="마이페이지" />
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToEdu = () => {
  router.push('/education')
}
const goToSurvey = () => {
  router.push('/survey')
}
const goToShop = () => {
  router.push('/shop')
}
const goToMypage = () => {
  router.push('/mypage')
}
const goToHome = () => {
    router.push('/home')
}
</script>

<style lang="scss" scoped>
.footer-wrap {
  border: 1px solid blue;
  background-color: rgb(202, 233, 239);
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  z-index: 0;
  
}

.footer-logo-wrap {
  border: 1px solid purple;
  height: 60px;
  position: relative;
}

.footer-logo {
  height: 100%;
  width: 100%;
}

.footer-btn {
  background: none;
  border: none;
  padding: 0;
  height: 35px;
  display: flex;
  align-items: center;
  transform: translateY(30%);
  


  img {
    height: 100%;
    display: block;
    
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}
</style>
