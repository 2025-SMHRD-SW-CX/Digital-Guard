<template>
  <div class="main-container">
    <!-- 오늘의 미션 카드 -->
    <CardView @click="myClickHandler">
      <p class="card-title">오늘의 챌린지는 완료하셨나요?</p>
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path
            :stroke-dasharray="`${progressPercent}, 100`"
            class="circle"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div class="progress-text">{{ missionProgress }}<small class="fraction">/7</small></div>
      </div>
      <p class="card-subtext">{{ currentDay }}일차 {{ missionProgress < 7 ? '미완료' : '완료' }}</p>
      <p class="reward-info">
        7일 연속 참여 시 <span class="highlight">30P</span><span class="reward-info">추가 지급!</span><br>
        총<span class="highlight"> 100P</span> 적립까지 {{ remainingDays }}일 남았어요!<br>조금만 더 화이팅✨
      </p>
    </CardView>

    <!-- 퀴즈 카드 -->
    <CardView class="challenge-card">
      <div v-if="correctlyAnswered" class="overlay-message">
        오늘의 챌린지를 완료하였습니다. <span class="highlight">포인트 지급 완료!</span>
      </div>
      <p class="card-title">오늘의 챌린지</p>
      <p class="quiz-question">Q. 불법웹툰 사이트를 친구에게 공유하면 처벌 대상이 된다?</p>
      <div class="quiz-buttons">
        <button class="btn-ox blue" :disabled="correctlyAnswered" @click="checkAnswer(true)">O</button>
        <button class="btn-ox red" :disabled="correctlyAnswered" @click="checkAnswer(false)">X</button>
      </div>
    </CardView>

    <!-- 찜한 아이템 카드 -->
    <CardView class="wishlist-card-container">
      <div class="wishlist-header">
        <p class="wishlist-title">❤️ 찜한 아이템</p>
        <div v-if="hasInsufficientItems" class="go-survey-label" @click="goToSurvey">
          <span class="go-survey-text">포인트 채우러 가기</span>
          <!-- svg파일이 사라져서 이미지로 대체해놓음 - 주현 -->
          <!-- <img src="/svg/angle-right.svg" alt="포인트 채우기" class="go-survey-icon" /> -->
           <img src="/images/next_page.png" alt="포인트 채우기" class="go-survey-icon" />
        </div>
      </div>
      <div class="wishlist-scroll">
        <div v-if="shopStore.wish.length === 0" class="empty-text">
          찜한 아이템이 없습니다.<br>포인트샵에서 원하는 아이템을 찾아보세요!
        </div>
        <div v-for="item in shopStore.wish" :key="item.id" class="wishlist-card">
          <img :src="item.image" :alt="item.name" />
          <div class="wishlist-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price">{{ item.price.toLocaleString() }}P</p>
            <template v-if="point >= item.price">
              <span class="badge badge-available">구매 가능</span>
            </template>
            <template v-else>
              <span class="badge badge-short">부족 {{ (item.price - point).toLocaleString() }}P</span>
            </template>
          </div>
        </div>
      </div>
    </CardView>

    <!-- 정답 모달 -->
    <ModalView
      v-model="showCorrectModal"
      title="정답입니다! 🎉"
      type="confirm"
      confirmText="포인트샵으로 이동"
      cancelText="닫기"
      @confirm="goToShop"
    >
      <template #default>
        <p class="reason">{{ reasonText }}</p>
        <div class="point-gain">
          <img src="/images/coin_icon.png" alt="코인 아이콘" />
          <span>+{{ CORRECT_REWARD }}</span>
        </div>
      </template>
    </ModalView>

    <!-- 오답 모달 -->
    <ModalView
      v-model="showWrongModal"
      title="오답입니다 😥"
      type="alert"
      confirmText="확인"
    >
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

const router = useRouter();
const shopStore = useShopStore();

const missionProgress = ref(5); // 예: 현재까지 완료한 날짜 수
const totalDays = 7;
const currentDay = computed(() => missionProgress.value + 1); // 오늘 도전 중인 날짜
const progressPercent = computed(() => ((missionProgress.value / totalDays) * 100).toFixed(1));
const remainingDays = computed(() => totalDays - missionProgress.value);

const CORRECT_REWARD = 10;
const point = ref(200);

const correctlyAnswered = ref(false);
const reasonText = ref('');
const showCorrectModal = ref(false);
const showWrongModal = ref(false);

const hasInsufficientItems = computed(() =>
  shopStore.wish.some(item => item.price > point.value)
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
    point.value += CORRECT_REWARD;
    confetti({ spread: 10, origin: { y: 0.6 } });
    showCorrectModal.value = true;
  } else {
    showWrongModal.value = true;
  }
}
</script>

<style scoped lang="scss">
.wishlist-card {
  transition: transform 0.2s ease;
}
.wishlist-card:hover {
  transform: scale(1.03);
}
.wishlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
}

.go-survey-icon {
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.go-survey-icon:hover {
  transform: scale(1.1);
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-top: 0.2rem;
  line-height: 1.3;
}

.badge-available {
  background-color: #e0f3ff;
  color: #3ba2ff;
}

.badge-short {
  background-color: #eee;
  color: #999;
}

.swal2-icon.no-default-icon {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.main-container {
  padding: 0rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.challenge-card {
  position: relative;
}

.overlay-message {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  padding: 1.5rem;
  border-radius: 1rem;
}

.overlay-message .highlight {
  color: #3ba2ff;
  font-weight: bold;
  margin-left: 0.3rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  white-space: nowrap;
}

.progress-circle {
  position: relative;
  width: 10rem;
  height: 10rem;
  margin: 0 auto;
}

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
  stroke: #3ba2ff;
  stroke-width: 3.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0, 100;
  }
  100% {
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
}

.fraction {
  font-size: 1rem;
}

.card-subtext {
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
}

.reward-info {
  font-size: 1rem;
  margin-top: 0.5rem;
  text-align: center;
}

.reward-info .highlight {
  color: #3ba2ff;
  font-weight: bold;
}

.quiz-question {
  font-size: 1rem;
  margin: 1rem 0;
  word-break: keep-word;
  white-space: normal;
  line-height: 1.6;
  text-align: center;
}

.quiz-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

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
}

.btn-ox:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ox:hover {
  opacity: 0.85;
  transform: scale(1.05);
}

.btn-ox.blue {
  background-color: #3ba2ff;
}

.btn-ox.red {
  background-color: #ff5f5f;
}

.wishlist-scroll {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0.5rem 0;
  scroll-snap-type: x mandatory;
}

.wishlist-card {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 7.5rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
  padding: 0.5rem;
  background: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wishlist-card img {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 0.3rem;
}

.wishlist-info {
  font-size: 0.8rem;
  text-align: center;
}

.item-name {
  font-weight: bold;
  margin-bottom: 0.2rem;
  font-size: 0.85rem;
  white-space: normal !important;
  word-break: break-word;
  text-align: center;
  line-height: 1.3;
  display: block;
  width: 100%;
}

.item-price {
  color: #222;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.empty-text {
  font-size: 0.9rem;
  color: #aaa;
  padding: 1rem;
}

.wishlist-header {
  position: relative;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.wishlist-header {
  padding: 1.2rem 1rem 0rem;
  margin-bottom: 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.wishlist-title {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.3rem;
}

.go-survey-label {
  align-self: flex-end;
  margin-top: 0rem;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}


.go-survey-text {
  font-size: 0.75rem;
  color: #888;
  font-weight: 500;
}


.go-survey-icon {
  width: 1.3rem;
  height: 1.3rem;
  filter: grayscale(100%) brightness(1.5);
  transition: transform 0.2s ease;
}

.go-survey-label:hover .go-survey-icon {
  transform: translateX(2px);
}

.point-info {
  font-weight: bold;
  font-size: 1rem;
  margin-top: 0.5rem;

  .highlight {
    color: #3ba2ff;
  }
}

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
    color: #3ba2ff;
  }
}

.reason {
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  text-align: center;
  word-break: keep-all;
}

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
    color: #3ba2ff;
  }
}
</style>