<template>
  <!-- 전체 화면을 덮는 로딩 스크린 래퍼 -->
  <div class="loading-screen animate">
    <!-- 대각선으로 회전하며 열리는 커튼 컨테이너 -->
    <div ref="curtain" class="curtain curtain--animate">
      <!-- 왼쪽/오른쪽 커튼 패널 -->
      <div id="curtain-left" class="curtain-shape"></div>
      <div id="curtain-right" class="curtain-shape"></div>
    </div>

    <!-- 로고 및 브랜드 이미지: 슬라이드 인 애니메이션 적용 -->
    <div id="logo-brand-wrap">
      <img id="logo" src="/images/logo.png" alt="로고 이미지" />
      <img id="brand" src="/images/brand.png" alt="브랜드 이미지" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 커튼 엘리먼트에 접근하기 위한 레퍼런스
const curtain = ref(null)

/**
 * 뷰포트 크기에 따라 커튼의 회전 각도를 계산하여
 * CSS 변수 --diag-angle 로 설정
 */
function updateAngle() {
  if (!curtain.value) return

  const w = window.innerWidth
  const h = window.innerHeight
  // Math.atan2(y, x) 를 이용해 라디안 계산 후 도 단위로 변환
  const raw = Math.atan2(h, w) * (180 / Math.PI)
  // 세로 기준(90도)에서 빼서 커튼 회전 각도 산출
  const diag = raw - 90

  curtain.value.style.setProperty('--diag-angle', `${diag}deg`)
}

// 컴포넌트 라이프사이클에 따라 이벤트 등록/해제
onMounted(() => {
  updateAngle()
  window.addEventListener('resize', updateAngle)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateAngle)
})
</script>

<style scoped>
/* -------------------------------------------------------------------------- */
/* Layout & Positioning                                                      */
/* -------------------------------------------------------------------------- */
.loading-screen {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: var(--color-background);
  z-index: 9999;
}
.curtain {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200vw;
  height: 200vh;
  transform-origin: center;
  transform: translate(-50%, -50%) rotate(0deg);
  display: flex;
  z-index: 9998;
}
#logo-brand-wrap {
  width: 100%;
  height: 100%;
  animation: logoBrandUp 2s ease-out forwards;
}
#logo {
  --width: 5rem;
  width: var(--width);
  position: absolute;
  top: 35%;
  left: calc((100% - var(--width)) / 2);
}
#brand {
  --width: 10rem;
  width: var(--width);
  position: absolute;
  bottom: 8%;
  left: calc((100% - var(--width)) / 2);
}

/* -------------------------------------------------------------------------- */
/* Curtain & Wrapper Animations                                               */
/* -------------------------------------------------------------------------- */
.loading-screen.animate {
  /* wrapper 전체 페이드아웃: 2.5초 지연 후 0.4초 duration */
  animation: fadeOut 0.4s ease-out 2.5s forwards;
}
.curtain--animate {
  /* 1) 대각선 회전 → 2) 지연 후 페이드아웃 */
  animation:
    rotateToDiagonal 0.6s ease-in forwards,
    fadeOut 1s ease-out 0.6s forwards;
}
.curtain--animate .curtain-shape:nth-child(1) {
  /* 상단으로 슬라이드 */
  animation: slideUp 1.8s ease-out 0.5s forwards;
}
.curtain--animate .curtain-shape:nth-child(2) {
  /* 하단으로 슬라이드 */
  animation: slideDown 1.8s ease-out 0.5s forwards;
}
.curtain-shape {
  flex: 1;
  height: 100%;
}
#curtain-left {
  background-color: #7778B3;
}
#curtain-right {
  background-color: #283A97;
}

/* -------------------------------------------------------------------------- */
/* Keyframes                                                                  */
/* -------------------------------------------------------------------------- */
@keyframes rotateToDiagonal {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(var(--diag-angle)); }
}
@keyframes slideUp {
  from { transform: translateY(0); }
  to   { transform: translateY(-300vh); }
}
@keyframes slideDown {
  from { transform: translateY(0); }
  to   { transform: translateY(300vh); }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes logoBrandUp {
  from { opacity: 0; transform: translateY(2rem); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>