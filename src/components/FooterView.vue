<template>
  <div class="footer-wrap" v-if="showFooter">
    <button class="footer-btn" :class="{ active: isActive('education') }" @click="goToEdu">
      <img src="/images/footer_edu.png" alt="교육" />
    </button>
    <button class="footer-btn" :class="{ active: isActive('survey') }" @click="goToSurvey">
      <img src="/images/footer_survey.png" alt="설문" />
    </button>

    <div class="footer-logo-wrap" @click="goToMainView">
      <img src="/images/logo.png" class="footer-logo" alt="로고" />
    </div>
    <button class="footer-btn" :class="{ active: isActive('shop') }" @click="goToShop">
      <img src="/images/footer_shop.png" alt="상점" />
    </button>
    <button class="footer-btn" :class="{ active: isActive('mypage') }" @click="goToMypage">
      <img id="mypage-icon" src="/images/footer_mypage.png" alt="마이페이지" />
    </button>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

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
const goToMainView = () => {
    router.push('/mainView')
}
</script>

<style lang="scss" scoped>
.footer-wrap {
  background-color: $color-thin-sky;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3.5rem;
  z-index: 0;
  position: relative;
}

.footer-logo-wrap {
  height: 4rem;
  position: relative;
  bottom: 0.6rem;
}

.footer-logo {
  height: 100%;
  width: 100%;
}

.footer-btn {
  background: none;
  border: none;
  padding: 0;
  height: 2rem;
  display: flex;
  align-items: center;
  transform: translateY(30%);


  img {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.7;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  &.active img {
    opacity: 1; // 기본보다 더 선명하게
    filter: drop-shadow(0 0 8px $color-primary); // 강조 효과 (선택)
    border-bottom: 2px solid $color-primary; // 밑줄 강조 등 자유롭게
  }

  #mypage-icon {
    height: 2.3rem;
  }
}
</style>
