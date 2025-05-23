<template>
  <div class="main-container">
    <!-- 오늘의 미션 카드 -->
    <CardView>
      <p class="card-title">오늘의 챌린지는 완료하셨나요?</p>
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"/>
          <path class="circle"
                stroke-dasharray="71.4, 100"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"/>
        </svg>
        <div class="progress-text">
          5<small class="fraction">/7</small>
        </div>
      </div>
      <p class="card-subtext">6일차 미완료</p>
      <p class="reward-info">7일 완주 시 <span class="highlight">1000P + 100P</span><span class="small">(10%)</span><br>보상받기까지 2일 남았어요!<br>조금만 더 화이팅✨</p>
    </CardView>

    <!-- 퀴즈 카드 -->
    <CardView class="card">
      <p class="card-title">마라톤 챌린지</p>
      <p class="quiz-question">Q. 불법웹툰 사이트 방문만으로도 처벌 대상이 된다.</p>
      <div class="quiz-buttons">
        <button class="btn-ox blue">O</button>
        <button class="btn-ox red">X</button>
      </div>
    </CardView>

    <!-- 포인트샵 카드 -->
    <CardView class="card">
      <p class="card-title">인기 아이템</p>
      <div class="shop-items">
        <div v-for="(item, i) in shopItems" :key="i" class="item">
          <div v-if="i < 2" class="rank-badge" :class="{ first: i === 0, second: i === 1 }">{{ i + 1 }}위</div>
          <img :src="item.img" :alt="item.alt" />
          <div class="item-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price" v-if="item.price">{{ item.price }}P</p>
          </div>
        </div>
      </div>
    </CardView>
  </div>
</template>

<script setup>
import CardView from '@/components/CardView.vue'

const shopItems = [
  { img: '/images/coffee.png', name: '컴포즈 아메리카노', price: 1600, alt: '컴포즈 아메리카노 상품 이미지' },
  { img: '/images/cu.png', name: 'CU 3,000P 쿠폰', price: 2700, alt: 'CU 3,000포인트 쿠폰 이미지' },
  { img: '/images/more.png', name: '더 보기', alt: '포인트샵 더보기 버튼 이미지' }
]
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #f5f5f5;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  align-items: center;
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

.reward-info .small {
  font-size: 0.8rem;
  color: #999;
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