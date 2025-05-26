<template>
  <div class="app-wrapper">
    <!-- admin이 아닌 경우만 로더/공통레이아웃 노출 -->
    <template v-if="firstToken !== 'admin'">
      <transition name="loader-fade" mode="out-in">
        <LoadingScreen v-if="isLoading" key="loader" />
      </transition>

      <div v-if="!isLoading" class="page-container">
        <transition name="page-fade-float" mode="out-in">
          <div class="page-clipper" :key="route.fullPath" ref="scrollContainer">
            <HeaderView />
            <div class="content"><router-view /></div>
          </div>
        </transition>
        <FooterView />
        <TopButton :scroll-target="scrollContainer" />
      </div>
    </template>

    <!-- admin 경로일 때는 오직 컨텐츠만 -->
    <template v-else>
      <div class="admin-content-only">
        <router-view />
      </div>
    </template>

    <AlertView />
  </div>
</template>

<script setup>

import HeaderView from '@/components/HeaderView.vue'
import FooterView from '@/components/FooterView.vue'
import TopButton from '@/components/TopButton.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import AlertView from '@/components/AlertView.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePathToken } from '@/composables/usePathToken'

const scrollContainer = ref(null)
const isLoading = ref(true)
const router = useRouter()
const route = useRoute()
const { firstToken } = usePathToken()

onMounted(async () => {
  setAppVh()
  window.addEventListener('resize', setAppVh)

  await router.isReady()
  setTimeout(() => { isLoading.value = false }, 3000)
})

onUnmounted(() => {
  window.removeEventListener('resize', setAppVh)
})

function setAppVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--app-vh', `${vh * 100}px`)
}


// -------------------------------------------------------
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const DEFAULT_POINT = 20000 // ⬅️ DEFAULT_VALUES.totalReward와 같게

if (userStore.totalReward === DEFAULT_POINT) {
  localStorage.removeItem('orderList')
  console.log('🗑 주문내역 초기화됨 (기본 포인트 감지)')
}


// FIXME 작동안됨
// 라우트별 스크롤 위치 저장 객체(메모리)
// const scrollPositions = {}

// onMounted(() => {
//   // 라우트 변경 감지
//   watch(
//     () => route.fullPath,
//     async (to, from) => {
//       // 1. from이 있으면, 이전 라우트의 스크롤 위치 저장
//       if (from && scrollContainer.value) {
//         scrollPositions[from] = scrollContainer.value.scrollTop
//       }
//       // 2. 새 라우트 진입 후, DOM 업데이트를 기다렸다가 복원
//       await nextTick()
//       setTimeout(() => {
//         if (scrollPositions[to] !== undefined && scrollContainer.value) {
//           scrollContainer.value.scrollTop = scrollPositions[to]
//         } else if (scrollContainer.value) {
//           scrollContainer.value.scrollTop = 0
//         }
//       }, 0)
//     },
//     { immediate: true }
//   )
// })


</script>


<style lang="scss" scoped>
/* -------------------------------------------------------------------------- */
/* 애니메이션용 래퍼 + 내부 스크롤 영역                                         */
/* -------------------------------------------------------------------------- */
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: var(--app-vh, 100vh); // ← 이 부분만 수정!
  inset: 0;
  overflow: auto;
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
// 이 스타일태그 지우기 x</style>