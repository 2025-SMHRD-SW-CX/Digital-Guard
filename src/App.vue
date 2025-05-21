<template>
  <div class="app-wrapper">
    <!-- 1) 로더 페이드 애니메이션 -->
    <transition name="loader-fade" mode="out-in">
      <LoadingScreen v-if="isLoading" key="loader" />
    </transition>

    <!-- 2) 메인 페이지 애니메이션 + 스크롤 영역 -->
    <transition name="page-fade-float" mode="out-in">
      <div
        v-if="!isLoading"
        :key="route.fullPath"
        class="page-container"
      >
        <!-- 애니메이션 래퍼 -->
        <div class="page-clipper">
          <!-- 실제 스크롤되는 영역 -->
          <router-view />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
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
</script>

<style lang="scss" scoped>
/* -------------------------------------------------------------------------- */
/* 애니메이션용 래퍼 + 내부 스크롤 영역                                         */
/* -------------------------------------------------------------------------- */
.page-container {
  position: absolute;
  inset: 0;
  overflow: auto;      /* 래퍼는 클리핑만 담당 */
}
.page-clipper {
  height: 100vh;
  overflow: auto;        /* 실제 스크롤은 여기서 */
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
