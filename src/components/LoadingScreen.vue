<template>
  <!-- 전체 화면을 덮는 로딩 스크린 래퍼 -->
  <div class="loading-screen animate">
    <!-- 대각선으로 회전하며 열리는 커튼 컨테이너 -->
    <div class="curtain-wrapper">
      <div ref="curtain" class="curtain curtain--animate">
        <!-- 왼쪽/오른쪽 커튼 패널 -->
        <div class="curtain-shape left"></div>
        <div class="curtain-shape right"></div>
      </div>
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

const curtain = ref(null)

function updateAngle() {
  if (!curtain.value) return
  const w = window.innerWidth
  const h = window.innerHeight
  const raw = Math.atan2(h, w) * (180 / Math.PI)
  const diag = raw - 90
  curtain.value.style.setProperty('--diag-angle', `${diag}deg`)
}

onMounted(() => {
  updateAngle()
  window.addEventListener('resize', updateAngle)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateAngle)
})
</script>

<style lang="scss" scoped>
/* Variables */
$anim-rotate-duration: 0.6s;
$anim-slide-duration: 1.8s;
$anim-fade-duration: 1s;
$anim-fade-delay: 0.5s;
$anim-wrapper-fade-delay: 2.5s;
$anim-wrapper-fade-duration: 0.4s;
$anim-logo-duration: 2s;
$slide-distance: 300vh;

.loading-screen {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: var(--color-background);
  z-index: 9999;

  &.animate {
    animation: fadeOut $anim-wrapper-fade-duration ease-out $anim-wrapper-fade-delay forwards;
  }

  .curtain-wrapper {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .curtain {
    position: absolute;
    top: 50%; left: 50%;
    width: 200vw; height: 200vh;
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(0deg);
    display: flex;
    z-index: 9998;

    &.curtain--animate {
      animation:
        rotateToDiagonal $anim-rotate-duration ease-in forwards,
        fadeOut          $anim-fade-duration ease-out $anim-fade-delay forwards;

      .curtain-shape.left {
        animation: slideUp   $anim-slide-duration ease-out ($anim-rotate-duration - 0.1s) forwards;
      }
      .curtain-shape.right {
        animation: slideDown $anim-slide-duration ease-out ($anim-rotate-duration - 0.1s) forwards;
      }
    }

    .curtain-shape {
      flex: 1; height: 100%;
    }
    .left  { background-color: #7778B3; }
    .right { background-color: #283A97; }
  }

  #logo-brand-wrap {
    width: 100%; height: 100%;
    animation: logoBrandUp $anim-logo-duration ease-out forwards;

    #logo,
    #brand {
      position: absolute;
      left: 50%; transform: translateX(-50%);
    }
    #logo {
      width: 5rem;
      top: 35%;
    }
    #brand {
      width: 10rem;
      bottom: 8%;
    }
  }
}

@keyframes rotateToDiagonal {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(var(--diag-angle)); }
}
@keyframes slideUp {
  from { transform: translateY(0); }
  to   { transform: translateY(-#{$slide-distance}); }
}
@keyframes slideDown {
  from { transform: translateY(0); }
  to   { transform: translateY(#{$slide-distance}); }
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


<!-- <style lang="scss" scoped>
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
</style> -->