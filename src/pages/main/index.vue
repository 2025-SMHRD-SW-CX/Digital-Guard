<template>
  <div class="main-container">
    <!-- 오늘의 미션 카드 -->
    <CardView @click="myClickHandler">
      <p class="card-title">오늘의 챌린지는 완료하셨나요?</p>
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="circle" stroke-dasharray="71.4, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div class="progress-text">5<small class="fraction">/7</small></div>
      </div>
      <p class="card-subtext">6일차 미완료</p>
      <p class="reward-info">
        7일 완주 시 <span class="highlight">30P</span><span class="reward-info">추가 지급!</span><br>
        총<span class="highlight"> 100p</span> 적립까지 2일 남았어요!<br>조금만 더 화이팅✨
      </p>
    </CardView>

    <!-- 퀴즈 카드 -->
    <CardView class="challenge-card">
      <!-- 오버레이 메시지 -->
      <div v-if="correctlyAnswered" class="overlay-message">
        오늘의 챌린지를 완료하였습니다. <span class="highlight">포인트 지급 완료!</span>
      </div>

      <p class="card-title">마라톤 챌린지</p>
      <p class="quiz-question">Q. 불법웹툰 사이트를 친구에게 공유하면 처벌 대상이 된다?</p>
      <div class="quiz-buttons">
        <button class="btn-ox blue" :disabled="correctlyAnswered" @click="checkAnswer(true)">O</button>
        <button class="btn-ox red" :disabled="correctlyAnswered" @click="checkAnswer(false)">X</button>
      </div>
    </CardView>

    <!-- 포인트샵 카드 -->
    <CardView>
      <p class="card-title">인기 아이템</p>
      <div class="shop-items">
        <div v-for="(item, i) in shopItems" :key="i">
          <div v-if="item.name === '더 보기'" class="item" @click="goToShop" style="cursor: pointer">
            <img :src="item.img" :alt="item.alt" />
            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
            </div>
          </div>
          <div v-else class="item">
            <div v-if="i < 2" class="rank-badge" :class="{ first: i === 0, second: i === 1 }">{{ i + 1 }}위</div>
            <img :src="item.img" :alt="item.alt" />
            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-price" v-if="item.price">{{ item.price }}P</p>
            </div>
          </div>
        </div>
      </div>
    </CardView>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import CardView from '@/components/CardView.vue';

const router = useRouter();

const correctlyAnswered = ref(false);
const point = ref(200);

function myClickHandler() {
  router.push('/marathon')
}

function goToShop() {
  router.push('/shop');
}

function checkAnswer(userAnswer) {
  const isCorrect = userAnswer === true;
  const reasonText = isCorrect
    ? '✅ 불법웹툰을 공유하는 행위는 저작권법 위반으로 처벌 대상이 됩니다.'
    : '❌ 불법웹툰 공유는 명백한 저작권 침해로 법적 책임이 따릅니다.';

  const earned = isCorrect ? 10 : 0;

  if (isCorrect) {
    correctlyAnswered.value = true;
    point.value += earned;
    confetti({ spread: 10, origin: { y: 0.6 } });
  }

  Swal.fire({
    icon: isCorrect ? 'success' : 'error',
    title: isCorrect ? '정답입니다! 🎉' : '오답입니다 😢',
    html: `
      <p style="font-size: 1rem; margin-bottom: 1rem;">${reasonText}</p>
      <p style="font-weight: bold; font-size: 1rem;">현재 누적 포인트: <span style="color: #3ba2ff">${point.value}P</span></p>
    `,
    showCancelButton: true,
    confirmButtonText: '포인트샵으로 이동',
    cancelButtonText: '닫기',
    confirmButtonColor: '#3ba2ff',
    cancelButtonColor: '#aaa',
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/shop');
    }
  });
}

const shopItems = [
  { img: '/images/coffee.png', name: '컴포즈 아메리카노', price: 1600, alt: '컴포즈 아메리카노 상품 이미지' },
  { img: '/images/cu.png', name: 'CU 3,000P 쿠폰', price: 2700, alt: 'CU 3,000포인트 쿠폰 이미지' },
  { img: '/images/more.png', name: '더 보기', alt: '포인트샵 더보기 버튼 이미지' }
];
</script>

<style lang="scss" scoped>
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
  font-size: 2.5rem;
  font-weight: bold;
}

.fraction {
  font-size: 1.2rem;
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
  word-break: keep-all;
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

.shop-items {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  gap: 1rem;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

.rank-badge {
  position: absolute;
  top: -0.5rem;
  left: -0.3rem;
  background-color: #3ba2ff;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-weight: bold;
  z-index: 1;
}

.item img {
  width: 5rem;
  height: 5rem;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.item-name {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
  text-align: center;
  white-space: normal;
  max-width: 6.5rem;
  word-break: keep-all;
}

.item-price {
  font-size: 0.75rem;
  color: #555;
  text-align: center;
  white-space: nowrap;
}
</style>
