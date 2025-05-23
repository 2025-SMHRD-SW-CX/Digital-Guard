<template>
  <div class="main-container">
    <!-- 오늘의 미션 카드 -->
    <div class="card">
      <p class="card-title">오늘의 미션</p>
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"/>
          <path class="circle"
                stroke-dasharray="86, 100"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"/>
        </svg>
        <div class="progress-text">
          6<tspan class="small">/7</tspan>
        </div>
      </div>
      <p class="card-subtext">7일차 미완료</p>
      <p class="reward-info">7일 완주 시 <span class="highlight">1000P + 100P</span><span class="small">(10%)</span><br>보상받기까지 단 하루!</p>
    </div>

    <!-- 퀴즈 카드 -->
    <div class="card">
      <p class="card-title">인기 아이템</p>
      <p class="quiz-question">Q. 불법웹툰 사이트 방문만으로도 처벌 대상이 된다.</p>
      <div class="quiz-buttons">
        <button class="btn-ox blue">O</button>
        <button class="btn-ox red">X</button>
      </div>
    </div>

    <!-- 포인트샵 카드 -->
    <div class="card">
      <p class="card-title">인기 아이템</p>
      <div class="shop-items">
        <div class="item">
          <img src="/images/coffee.png" alt="컴포즈 아메리카노">
        </div>
        <div class="item">
          <img src="/images/cu.png" alt="CU 쿠폰">
        </div>
        <div class="item">
          <img src="/images/more.png" alt="더보기">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Composition API 기반, 별도 기능은 이 화면에 없음
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #f5f5f5;
  padding: 2vh 5vw;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  align-items: center;
}

.card {
  background-color: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
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

.progress-text .small {
  font-size: 1.2rem;
}

.card-subtext {
  margin-top: 1rem;
  font-weight: bold;
}

.reward-info {
  font-size: 1rem;
  margin-top: 0.5rem;
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
}

.quiz-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.btn-ox {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  border: none;
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
}

.item img {
  width: 4rem;
  height: auto;
}
</style>
