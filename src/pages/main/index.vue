<template>
  <div class="main-container">
    <!-- ───────────── 오늘의 미션 카드 ───────────── -->
    <CardView class="mission-card" @click="myClickHandler">
      <p class="card-title">오늘의 챌린지는 완료하셨나요?</p>
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path :stroke-dasharray="`${progressPercent}, 100`" class="circle"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div class="progress-text">
          {{ missionProgress }}<small class="fraction">/7</small>
        </div>
      </div>
      <p class="card-subtext">
        {{ currentDay }}일차 {{ missionProgress < 7 ? '미완료' : '완료' }} </p>
          <p class="reward-info">
            7일 연속 참여 시 <span class="highlight">30P</span> 추가 지급!<br>
            총 <span class="highlight">100P</span> 적립까지 {{ remainingDays }}일 남았어요!<br>
            조금만 더 화이팅✨
          </p>
    </CardView>

    <!-- ───────────── 오늘의 챌린지(퀴즈) 카드 ───────────── -->
    <CardView class="quiz-card">
      <div v-if="correctlyAnswered" class="overlay-message">
        오늘의 챌린지를 완료하였습니다.
        <span class="highlight">포인트 지급 완료!</span>
      </div>
      <p class="card-title">오늘의 챌린지</p>
      <p class="quiz-question">
        Q. 불법웹툰 사이트를 친구에게 공유하면 처벌 대상이 된다?
      </p>
      <div class="quiz-buttons">
        <button class="btn-ox blue" :disabled="correctlyAnswered" @click="checkAnswer(true)">O</button>
        <button class="btn-ox red" :disabled="correctlyAnswered" @click="checkAnswer(false)">X</button>
      </div>
    </CardView>

    <!-- ───────────── 찜한 아이템 카드 ───────────── -->
    <CardView class="wishlist-card-container">
      <div>
        <!-- 헤더 (찜 아이콘 + 타이틀) -->
        <div class="wishlist-header">
          <img src="/images/shop/icons/heart_icon_filled.png" class="icon-img" />
          <p class="title">찜한 아이템</p>
          <img src="/images/shop/icons/heart_icon_filled.png" class="icon-img" />
        </div>
        <!-- 스크롤 영역 -->
        <div class="wishlist-scroll">
          <div v-if="shopStore.wish.length === 0" class="empty-text">
            <p>찜한 아이템이 없습니다.</p>
            <p>포인트샵에서 원하는 아이템을 찾아보세요!</p>
          </div>
          <div v-for="item in shopStore.wish" :key="item.id" class="wishlist-card">
            <img :src="item.image" :alt="item.name" />
            <div class="wishlist-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-price">{{ item.price.toLocaleString() }}P</p>
              <template v-if="userStore.totalReward >= item.price">
                <span class="badge badge-available">구매 가능</span>
              </template>
              <template v-else>
                <div class="badge badge-short">
                  <p class="short-price">{{ (item.price - userStore.totalReward).toLocaleString() }}P</p>
                  <p class="its-short">부족해요!</p>
                </div>
              </template>
            </div>

          </div>


        </div>

        <div v-if="!shopStore.wish.length">
          <button class="to-btn shop" @click="goToShop">
            포인트샵으로 이동
          </button>
        </div>
        <div v-else-if="hasInsufficientItems">
          <p class="need-more">포인트가 더 필요하세요?</p>
          <button class="to-btn survey" @click="goToSurvey">
            설문조사로 이동
          </button>
        </div>

      </div>
    </CardView>

    <!-- ───────────── 정답 모달 ───────────── -->
    <ModalView v-model="showCorrectModal" title="정답입니다! 🎉" type="confirm" confirmText="포인트샵으로 이동" cancelText="닫기"
      @confirm="goToShop">
      <template #default>
        <p class="reason">{{ reasonText }}</p>
        <div class="point-gain">
          <img src="/images/coin_icon.png" alt="코인 아이콘" />
          <span>+{{ CORRECT_REWARD }}</span>
        </div>
      </template>
    </ModalView>

    <!-- ───────────── 오답 모달 ───────────── -->
    <ModalView v-model="showWrongModal" title="오답입니다 😥" type="alert" confirmText="확인">
      <template #default>
        <p class="reason">{{ reasonText }}</p>
        <p style="font-weight: bold; font-size: 1rem; color: #ff5f5f;">다시 한 번 도전해보세요!</p>
      </template>
    </ModalView>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import confetti from 'canvas-confetti';
import CardView from '@/components/CardView.vue';
import ModalView from '@/components/ModalView.vue';
import { useShopStore } from '@/stores/shop';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const shopStore = useShopStore();
const userStore = useUserStore();

const missionProgress = ref(5); // 예: 현재까지 완료한 날짜 수
const totalDays = 7;
const currentDay = computed(() => missionProgress.value + 1); // 오늘 도전 중인 날짜
const progressPercent = computed(() => ((missionProgress.value / totalDays) * 100).toFixed(1));
const remainingDays = computed(() => totalDays - missionProgress.value);

const CORRECT_REWARD = 10;

const correctlyAnswered = ref(false);
const reasonText = ref('');
const showCorrectModal = ref(false);
const showWrongModal = ref(false);

const hasInsufficientItems = computed(() =>
  shopStore.wish.some(item => item.price > userStore.totalReward)
);

function myClickHandler() {
  router.push('/challenge');
}

function goToSurvey() {
  router.push('/survey');
}

function goToShop() {
  showCorrectModal.value = false;
  router.push('/shop');
}

function checkAnswer(userAnswer) {
  const isCorrect = userAnswer === true;
  reasonText.value = isCorrect
    ? '불법웹툰을 공유하는 행위는 저작권법 위반으로 처벌 대상이 됩니다.'
    : '불법웹툰 공유는 명백한 저작권 침해로 법적 책임이 따릅니다.';

  if (isCorrect) {
    correctlyAnswered.value = true;
    userStore.addPoint(CORRECT_REWARD);
    confetti({ spread: 10, origin: { y: 0.6 } });
    showCorrectModal.value = true;
  } else {
    showWrongModal.value = true;
  }
}
</script>

<style scoped lang="scss">
// ───────────────────────────────────────
//  [1] 메인 컨테이너
// ───────────────────────────────────────

.main-container {
  padding: 0 0rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
}

// ───────────────────────────────────────
//  [2] 공통 카드 스타일(CardView 내장)
// ───────────────────────────────────────

// (CardView의 스타일은 컴포넌트 내부에 있으면 별도 관리. 필요하면 추출)
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  white-space: nowrap;
}

.card-subtext {
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
}

// ───────────────────────────────────────
//  [3] 오늘의 미션(진행도 원형차트)
// ───────────────────────────────────────

.progress-circle {
  position: relative;
  width: 10rem;
  height: 10rem;
  margin: 0 auto;

  .circular-chart {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .circle-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke: $color-highlight;
    stroke-width: 3.8;
    stroke-linecap: round;
    transition: stroke-dasharray 0.3s;
    animation: progress 1s ease-out forwards;
  }

  @keyframes progress {
    from {
      stroke-dasharray: 0, 100;
    }

    to {
      stroke-dasharray: 71.4, 100;
    }
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.8rem;
    font-weight: bold;

    .fraction {
      font-size: 1rem;
    }
  }
}

// ───────────────────────────────────────
//  [4] 리워드 안내문
// ───────────────────────────────────────

.reward-info {
  font-size: 1rem;
  margin-top: 0.5rem;
  text-align: center;
}

.highlight {
  color: $color-highlight;
  font-weight: bold;
}

// ───────────────────────────────────────
//  [5] 퀴즈 카드/버튼
// ───────────────────────────────────────

.challenge-card {
  position: relative;
}

.quiz-card {
  position: relative;
}

.overlay-message {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  padding: 1.5rem;
  border-radius: 1rem;
}

.quiz-question {
  font-size: 1rem;
  margin: 1rem 0;
  word-break: keep-word;
  line-height: 1.6;
  text-align: center;
}

.quiz-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

// ───────────────────────────────────────
//  [6] OX 버튼
// ───────────────────────────────────────

.btn-ox {
  min-width: 4.5rem;
  height: 3.5rem;
  padding: 0 1.2rem;
  border-radius: 1.8rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.85;
    transform: scale(1.05);
  }

  &.blue {
    background-color: #3ba2ff;
  }

  &.red {
    background-color: #ff5f5f;
  }
}

// ───────────────────────────────────────
//  [7] 찜한 아이템(찜리스트)
// ───────────────────────────────────────

.wishlist-card-container {
  width: 100%;

  .to-btn {
    transition: 0.2s;

    &:hover {
      opacity: 0.8;
    }

    @extend .btn, .btn-small, .btn-highlight, .w-100;
    margin: 0 auto;
    margin-top: 0.5rem;

    &.shop {
      @extend .btn-highlight;
    }

    &.survey {
      @extend .btn-primary;
    }
  }

  .need-more {
    text-align: center;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    color: $color-dark-gray;
  }
}

// 헤더(찜 아이콘 + 제목)
.wishlist-header {
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  .icon-img {
    width: 1.5rem;
    object-fit: scale-down;
  }

  .title {
    font-size: 1.2rem;
    font-weight: bold;
  }
}

// 스크롤 카드영역
.wishlist-scroll {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0.5rem;
  flex-direction: row;
  width: 100%;

  .empty-text {
    width: 100%;

    p {
      text-align: center;
      font-size: 0.9rem;
      color: #aaa;
    }


  }
}

// 카드 아이템
.wishlist-card {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 8rem;
  border: 1px solid #e6e5e5;
  border-radius: 0.25rem;
  padding: 0.5rem;
  background: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }

  img {
    width: 5rem;
    height: 5rem;
    object-fit: cover;
    border-radius: 0.5rem;
    margin-bottom: 0.3rem;
  }

  .wishlist-info {
    width: 100%;
    font-size: 0.8rem;
    text-align: center;

    .item-name {
      padding: 0 0.25rem;
      font-weight: 500;
      margin-bottom: 0.2rem;
      font-size: 0.75rem;

      line-height: 1.3;
      width: 100%;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-price {
      padding: 0 0.5rem;
      color: #222;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.2rem;
    }
  }
}

// ───────────────────────────────────────
//  [8] 배지(구매가능/부족)
// ───────────────────────────────────────

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 500;
  margin-top: 0.2rem;
  line-height: 1.3;
  width: 100%;
  height: 2.5rem;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    text-align: center;
  }

  &.badge-available {
    color: $color-highlight;
    font-weight: 600;
    font-size: 0.85rem;
  }

  &.badge-short {
    color: #999;

    .short-price {
      color: #f14438;
      font-size: 0.8rem;
    }

    .its-short {
      font-size: 0.6rem;
    }
  }
}

// ───────────────────────────────────────
//  [9] 기타(포인트/정답 모달)
// ───────────────────────────────────────

.point-gain {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.3rem;
  gap: 0.4rem;

  img {
    width: 1.2rem;
    height: 1.2rem;
    object-fit: contain;
  }

  span {
    font-weight: bold;
    font-size: 1rem;
    color: $color-highlight;
  }
}

.reason {
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  text-align: center;
  word-break: keep-all;
  text-wrap: balance;
}
</style>