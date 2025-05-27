<template>
  <div class="app-wrapper">
    <!-- admin이 아닌 경우만 로더/공통레이아웃 노출 -->
    <template v-if="firstToken !== 'admin'">
      <transition name="loader-fade" mode="out-in">
        <SplashScreen v-if="isLoading" key="loader" />
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderView from '@/components/HeaderView.vue'
import FooterView from '@/components/FooterView.vue'
import TopButton from '@/components/TopButton.vue'
import SplashScreen from '@/components/SplashScreen.vue'
import AlertView from '@/components/AlertView.vue'

// --- Composables ---
import { usePathToken } from '@/composables/usePathToken'
import { useSplash } from '@/composables/useSplash'
import { useAlertQueue } from '@/composables/useAlertQueue'
import { useAppVhSetter } from '@/composables/useAppVhSetter'
import { useUserStore } from '@/stores/user'

const scrollContainer = ref(null)
const router = useRouter()
const route = useRoute()

// 1. 라우트 정보
const { firstToken } = usePathToken()

// 2. Splash 제어
const { isLoading, showSplash } = useSplash()

// 3. AlertQueue (Splash와 AlertStore 연결)
useAlertQueue(isLoading)

// 4. vh 세팅 (리사이즈 반영)
function handleResize() {
  useAppVhSetter(document)
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 5. 유저 쿠키 로그인 복구 (Splash와 동시에 진행)
const userStore = useUserStore()

onMounted(async () => {
  await router.isReady()
  userStore.syncLoginCookieState()
  if (firstToken.value !== 'admin') {
    showSplash() // Splash 시작(3초 후 자동 종료)
  } else {
    // admin은 splash 없이 바로 isLoading = false
    isLoading.value = false
  }
})


// (주문내역 초기화 등 부가 작업은 필요하면 여기에)

// import { useUserStore } from '@/stores/user'
// const userStore = useUserStore()

// const DEFAULT_POINT = 20000 // ⬅️ DEFAULT_VALUES.total_point와 같게

// if (userStore.total_point === DEFAULT_POINT) {
//   localStorage.removeItem('orderList')
//   console.log('🗑 주문내역 초기화됨 (기본 포인트 감지)')
// }
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: var(--app-vh, 100vh);
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
.loader-fade-leave-active {
  transition: opacity 0.4s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}
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
