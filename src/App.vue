<template>

  <div class="app-wrapper">
    <!-- 1) 로더 페이드 애니메이션 -->
    <transition name="loader-fade" mode="out-in">
      <LoadingScreen v-if="isLoading" key="loader" />
    </transition>

    <!-- 2) 메인 페이지 애니메이션 + 스크롤 영역 -->
    <div v-if="!isLoading" class="page-container">

      <transition name="page-fade-float" mode="out-in">
        <!-- 애니메이션 래퍼 -->
        <div class="page-clipper" :key="route.fullPath">
          <!-- 실제 스크롤되는 영역 -->
          <HeaderView></HeaderView>
          <div class="content"><router-view /></div>
        </div>
      </transition>

      <FooterView></FooterView>
      <!-- 여기까지 공통레이아웃 -->
    </div>
  </div>

</template>


<script setup>

import HeaderView from '@/components/HeaderView.vue';
import FooterView from '@/components/FooterView.vue'








// --------------------------------------








import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoadingScreen from '@/components/LoadingScreen.vue'

const isLoading = ref(true)
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  await router.isReady()
  setTimeout(() => { isLoading.value = false }, 3000)
})

// -------------------------------------------------------
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const DEFAULT_POINT = 20000 // ⬅️ DEFAULT_VALUES.totalReward와 같게

if (userStore.totalReward === DEFAULT_POINT) {
  localStorage.removeItem('orderList')
  console.log('🗑 주문내역 초기화됨 (기본 포인트 감지)')
}


</script>


<style lang="scss" scoped>
/* -------------------------------------------------------------------------- */
/* 애니메이션용 래퍼 + 내부 스크롤 영역                                         */
/* -------------------------------------------------------------------------- */
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  inset: 0;
  overflow: auto;
  /* 래퍼는 클리핑만 담당 */
}

.page-clipper {
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .content {
    flex-grow: 1;
    background-color: $color-content-background;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    align-items: center;
  }
}

/* -------------------------------------------------------------------------- */
/* 1) 로더 페이드 아웃                                                          */
/* -------------------------------------------------------------------------- */
.loader-fade-leave-active {
  transition: opacity 0.4s ease;
}

.loader-fade-leave-to {
  opacity: 0;
}

/* -------------------------------------------------------------------------- */
/* 2) 페이지 페이드 + 플로팅                                                     */
/* -------------------------------------------------------------------------- */
.page-fade-float-enter-active {
  transition:
    opacity 0.3s ease 0.2s,
    transform 0.3s ease 0.2s;
}

.page-fade-float-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-float-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-float-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.page-fade-float-leave-to {
  opacity: 0;
}
</style>



<style lang="scss">
// 이 스타일태그 지우기 x
</style>