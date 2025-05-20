<template>
  <div class="app-wrapper">
    <!-- 1) 로더 페이드 애니메이션: 로딩 중일 때만 LoadingScreen 컴포넌트 표시 -->
    <transition name="loader-fade" mode="out-in">
      <LoadingScreen v-if="isLoading" key="loader" />
    </transition>

    <!-- 2) 메인 페이지 페이드+플로팅 애니메이션: 로딩 완료 후 라우터 뷰 표시 -->
    <transition name="page-fade-float" mode="out-in">
      <div v-if="!isLoading" :key="route.fullPath" class="page-container">
        <!-- 동적 라우트 컴포넌트 렌더링 -->
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoadingScreen from '@/components/LoadingScreen.vue'

// 로딩 상태 관리
const isLoading = ref(true)

// Vue Router 인스턴스와 현재 경로 정보
const router = useRouter()
const route = useRoute()

// 컴포넌트 마운트 시 라우터 준비 후 일정 시간 뒤 로딩 종료
onMounted(async () => {
  await router.isReady()
  // 3초 뒤 isLoading=false 설정 (로딩 스크린 페이드아웃 트리거)
  setTimeout(() => { isLoading.value = false }, 3000)
})
</script>

<style>
/* -------------------------------------------------- */
/* 1) 로더 페이드 아웃                                  */
/* -------------------------------------------------- */
.loader-fade-leave-active {
  /* 로더 페이드아웃 트랜지션 시간: 0.4초 */
  transition: opacity 0.4s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}

/* -------------------------------------------------- */
/* 2) 페이지 페이드 + 플로팅                           */
/* -------------------------------------------------- */
.page-fade-float-enter-active {
  /* 페이드+플로팅 진입: 0.3초, 0.2초 딜레이 */
  transition:
    opacity 0.3s ease 0.2s,
    transform 0.3s ease 0.2s;
}
.page-fade-float-leave-active {
  /* 퇴장 페이드아웃: 0.2초 */
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
