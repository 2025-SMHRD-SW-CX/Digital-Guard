<template>
  <div class="wrapper">
    <!-- 슬라이드 + 페이드 전환: pageNum이 변경될 때마다 enter/leave 애니메이션 실행 -->
    <transition name="slide" mode="out-in" @before-enter="lock" @before-leave="lock" @after-enter="unlock"
      @after-leave="unlock">
      <div v-if="current" :key="pageNum" class="desc-wrapper">
        <!-- 타이틀과 부제 -->
        <h1>{{ current.title }}</h1>
        <p class="subtitle">{{ current.subtitle }}</p>

        <!-- 워크플로우 이미지: pageNum에 따라 동적 경로 적용 -->
        <img :src="`/images/workflow${pageNum}.png`" :alt="`워크플로우 ${pageNum} 이미지`" />
      </div>
    </transition>

    <!-- 다음 버튼: 마지막 페이지 전엔 표시, 애니메이션 중엔 비활성화 -->
    <div v-if="pageNum < pageData.length" class="btn-wrapper">
      <div class="next-btn" @click="goNextPage" :class="{ disabled: isAnimating }">
        <img src="/images/workflow_next_btn.png" alt="다음 버튼" />
      </div>
    </div>

    <!-- 페이지 4 이상일 때 가입/로그인 버튼 페이드인 -->
    <transition name="fadein" mode="out-in">
      <div v-if="pageNum >= pageData.length" :key="pageNum" class="credential-buttons">
        <router-link id="register-btn" class="btn w-100 btn-primary" :to="{ path: '/about' }">가입하기</router-link>

        <button id="login-btn" class="btn w-100 btn-secondary">
          로그인하기
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 현재 페이지 번호 (1부터 시작)
const pageNum = ref(1)

// 각 페이지별 타이틀/부제 데이터
const pageData = [
  { title: '하루 1분이면 충분!', subtitle: '짧게 참여하고, 바로 리워드 받자' },
  { title: '설문·제보·퀴즈 참여하고 포인트 빵!', subtitle: '간단할수록 더 빨리 모아요!' },
  { title: '모은 포인트로 기프티콘 교환 가능!', subtitle: '경품 이벤트도 수시로 열려요!' },
  { title: '익명 참여 OK! 개인정보 걱정 NO', subtitle: '지금 바로 시작해볼까?' },
]

// computed: 현재 페이지 객체
const current = computed(() => pageData[pageNum.value - 1])

// 슬라이드 전환 중 여부를 제어하는 플래그
const isAnimating = ref(false)

// 전환 시작/종료 시 플래그 설정
function lock() { isAnimating.value = true }
function unlock() { isAnimating.value = false }

// 다음 페이지로 이동 (애니메이션 중이거나 마지막일 경우 무시)
function goNextPage() {
  if (isAnimating.value || pageNum.value >= pageData.length) return
  pageNum.value++
}
</script>

<style lang="scss" scoped>
/* wrapper: 전체 화면을 고정 크기로 설정 */
.wrapper {
  position: fixed;
  width: 100vw;
  height: 100vh;
}

/* -------------------------------------------------- */
/* 슬라이드 애니메이션 정의                         */
/* -------------------------------------------------- */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0
}

/* -------------------------------------------------- */
/* 텍스트/이미지 영역 스타일                         */
/* -------------------------------------------------- */
.desc-wrapper {
  position: absolute;
  top: 15%;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  word-break: keep-all;
}

.desc-wrapper>img {
  max-height: 15rem;
  max-width: 100%;
  width: auto;
  height: auto;
}

/* -------------------------------------------------- */
/* 버튼 영역 스타일                                  */
/* -------------------------------------------------- */
.btn-wrapper {
  position: absolute;
  bottom: 20%;
  right: 5%;
  display: flex;
}

.next-btn {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.next-btn.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.next-btn>img {
  width: 1rem;
}

/* -------------------------------------------------- */
/* 가입/로그인 버튼 페이드인 정의                    */
/* -------------------------------------------------- */
.fadein-enter-active,
.fadein-leave-active {
  transition: opacity 0.4s ease 1s;
}

.fadein-enter-from,
.fadein-leave-to {
  opacity: 0
}

.fadein-enter-to,
.fadein-leave-from {
  opacity: 1
}

/* 버튼 그룹 스타일링                               */
.credential-buttons {
  position: absolute;
  bottom: 15%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 2rem;
  align-items: center;
}

/* .btn-primary, .btn-secondary 등은 글로벌 CSS 또는 별도 선언 */
</style>
