<template>
  <div class="wrapper">
    <!-- 슬라이드 애니메이션 컨테이너 -->
    <transition :name="transitionName" mode="out-in" @before-enter="lock" @before-leave="lock" @after-enter="unlock"
      @after-leave="unlock">
      <div v-if="current" :key="pageNum" class="slide-content">
        <h1 class="title">{{ current.title }}</h1>
        <p class="subtitle">{{ current.subtitle }}</p>
        <img class="img" :src="`/images/workflow${pageNum}.png`" :alt="`워크플로우 ${pageNum} 이미지`" />
      </div>
    </transition>

    <!-- 네비게이션 컨트롤 -->
    <div class="nav-wrapper">
      <button class="nav-btn" :disabled="isAnimating || pageNum === 1" @click="goPrevPage">
        <img src="/images/prev_page.png" alt="이전" />
      </button>

      <!-- 페이지 인디케이터 -->
      <div class="indicator">
        <div v-for="(_, idx) in pageData" :key="idx" class="dot-wrapper" @click="goPageTo(idx)">
          <span class="dot" :class="{ active: pageNum === idx + 1 }"></span>
        </div>
      </div>

      <button class="nav-btn" :disabled="isAnimating || pageNum === pageData.length" @click="goNextPage">
        <img src="/images/next_page.png" alt="다음" />
      </button>
    </div>

    <!-- 하단 액션 영역 -->
    <div class="action-wrapper">
      <transition name="fade" mode="out-in">
        <div class="action-content" :key="actionKey">
          <!-- 진행 중(1~3)일 때 건너뛰기 버튼 -->
          <button id="skip-btn" v-if="pageNum < pageData.length" class="btn " @click="skipTutorial">
            건너뛰기
          </button>

          <!-- 마지막 페이지(4)일 때 가입/로그인 버튼 -->
          <div v-else class="credential-group">

            <router-link id="register-btn" to="/signupView">
              가입하기
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 현재 페이지 번호 상태
const pageNum = ref(1);

// 튜토리얼 페이지 데이터 배열
const pageData = [
  { title: '하루 1분이면 충분!', subtitle: '짧게 참여하고, 바로 리워드 받자' },
  { title: '설문·제보·퀴즈 참여하고 포인트 빵!', subtitle: '간단할수록 더 빨리 모아요!' },
  { title: '모은 포인트로 기프티콘 교환 가능!', subtitle: '경품 이벤트도 수시로 열려요!' },
  { title: '익명 참여 OK! 개인정보 걱정 NO', subtitle: '지금 바로 시작해볼까?' },
];

// 현재 페이지 데이터를 가져오는 계산 속성
const current = computed(() => pageData[pageNum.value - 1]);

// 애니메이션 잠금 상태
const isAnimating = ref(false);
// 전환 애니메이션 이름 (forward/back)
const transitionName = ref('slide-forward');

// 하단 액션 전환을 위한 key (skip vs cred)
const actionKey = computed(() => (pageNum.value < pageData.length ? 'skip' : 'cred'));

// 전환 시작 시 잠금
function lock() {
  isAnimating.value = true;
}
// 전환 끝나면 잠금 해제
function unlock() {
  isAnimating.value = false;
}

// 다음 페이지로 이동
function goNextPage() {
  if (isAnimating.value || pageNum.value >= pageData.length) return;
  transitionName.value = 'slide-forward';
  pageNum.value++;
}

// 이전 페이지로 이동
function goPrevPage() {
  if (isAnimating.value || pageNum.value <= 1) return;
  transitionName.value = 'slide-back';
  pageNum.value--;
}

// 인디케이터(dot) 클릭 시 해당 페이지로 이동
function goPageTo(idx) {
  const target = idx + 1;
  if (isAnimating.value || target === pageNum.value) return;
  transitionName.value = target > pageNum.value ? 'slide-forward' : 'slide-back';
  pageNum.value = target;
}

// 건너뛰기 버튼: 마지막 페이지로 이동
function skipTutorial() {
  if (isAnimating.value) return;
  transitionName.value = 'slide-forward';
  pageNum.value = pageData.length;
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/animation.scss' as *;

/* --------------------------------------------------
   레이아웃
   -------------------------------------------------- */
.wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  word-wrap: break-word;
  word-break: keep-all;
  text-wrap: balance;
  z-index: 10;
  background-color: white;
}

/* --------------------------------------------------
   슬라이드 컨텐츠
   -------------------------------------------------- */
.slide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  .title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: var(--color-lightgrey);
  }

  .img {
    max-width: 80%;
    max-height: 200px;
  }
}



/* --------------------------------------------------
   슬라이드 애니메이션
   -------------------------------------------------- */
@include slide-transition(forward, 100%);
@include slide-transition(back, -100%);

/* --------------------------------------------------
   내비게이션
   -------------------------------------------------- */
.nav-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;

  .nav-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;

    img {
      width: 1.5rem;
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }

  .indicator {
    display: flex;
    gap: 0.5rem;
  }

  .dot-wrapper {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .dot {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      background: $color-lightgrey;

      &.active {
        background: $color-blue-60;
      }
    }
  }

}



/* --------------------------------------------------
   하단 액션
   -------------------------------------------------- */

.action-wrapper {
  width: 100%;
  height: 5rem;
  margin-bottom: 1.5rem;
  padding: 1rem 0;

  .action-content {
    display: flex;
    justify-content: center;
    gap: 1rem;
    width: 60%;
    margin: 0 auto;

    .credential-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
  }
}

#register-btn {
  @extend .btn, .btn-primary;
}

#skip-btn {
  @extend .btn, .btn-secondary, .w-100;
  background-color: transparent;
}


/* --------------------------------------------------
   페이드 전환 (하단)
   -------------------------------------------------- */
@include fade-transition(fade, 0.5s, ease-in-out);
</style>
