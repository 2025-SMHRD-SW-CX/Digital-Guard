<template>
  <div class="marathon-page">
    <!-- 헤더 -->
    <HeaderView />

    <!-- 본문 컨텐츠 -->
    <div class="marathon-container">
      <!-- 상단 프로필 -->
      <div class="profile-box">
        <div class="profile-info">
          <div class="profile-img" />
          <div class="profile-name">홍길동<br /><span class="level">Lv. 25</span></div>
        </div>
        <div class="point-info">
          <p class="label">나의 포인트</p>
          <p class="point">17,000p</p>
        </div>
      </div>

      <!-- 마라톤 진행도 -->
      <div class="challenge-progress">
        <p class="day-status">마라톤챌린지 <strong>6일차</strong></p>
        <p class="accumulated-point">현재 누적 포인트 <strong>600p + 5%</strong></p>
        <div class="day-tracker">
          <div v-for="n in 7" :key="n" class="day-circle" :class="{ active: n <= 6 }">Day {{ n }}</div>
        </div>
        <p class="reward-text">7일 완주 시 <strong>1000p + 10%</strong> 적립!</p>
      </div>

      <!-- 오늘의 챌린지 -->
      <div class="daily-challenge">
        <h2>오늘의 마라톤 챌린지</h2>
        <p class="question">Q. 불법웹툰 사이트 방문만으로도 처벌 대상이 된다.</p>
        <div class="answer-options">
          <div class="circle-btn">⭕</div>
          <div class="circle-btn wrong">❌</div>
        </div>
      </div>

      <!-- 포인트샵 인기 -->
      <div class="shop-section">
        <h3>포인트샵 인기</h3>
        <div class="shop-items">
          <div class="item">
            <img src="/images/coffee.png" alt="컴포즈 아메리카노" />
            <p>컴포즈 아메리카노</p>
            <p class="price">1,350p</p>
          </div>
          <div class="item">
            <img src="/images/cu.png" alt="CU 상품권" />
            <p>CU 모바일 상품권</p>
            <p class="price">2,700p</p>
          </div>
          <div class="item more">
            <img src="/images/more.png" alt="더 보기" />
            <p>더 보기</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 푸터 -->
    <FooterView />
  </div>
</template>

<script>
import HeaderView from '@/components/HeaderView.vue';
import FooterView from '@/components/FooterView.vue';

export default {
  name: 'MarathonChallenge',
  components: {
    HeaderView,
    FooterView,
  },
};
</script>

<style scoped>
.marathon-page {
  position: relative;
  padding-bottom: 120px; /* FooterView 공간 확보 */
  font-family: 'Noto Sans KR', sans-serif;
}

.marathon-container {
  padding: 16px;
}

/* 프로필 박스 */
.profile-box {
  display: flex;
  justify-content: space-between;
  background-color: #d9f3ff;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ddd;
  margin-right: 12px;
}

.profile-name {
  font-weight: bold;
}

.profile-name .level {
  font-size: 14px;
  color: #666;
}

.point-info {
  text-align: right;
}

.point-info .label {
  font-size: 14px;
  color: #555;
}

.point-info .point {
  font-size: 20px;
  font-weight: bold;
}

/* 진행도 */
.challenge-progress {
  background-color: #e3f4ff;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.day-status,
.accumulated-point,
.reward-text {
  margin: 4px 0;
}

.day-tracker {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.day-circle {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #e0e0e0;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
}

.day-circle.active {
  background: #0099ff;
  color: #fff;
}

/* 오늘의 챌린지 */
.daily-challenge {
  background: #f2fcff;
  border: 2px solid #a0e6ff;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.daily-challenge h2 {
  font-weight: bold;
  font-size: 18px;
}

.daily-challenge .question {
  margin: 10px 0;
}

.answer-options {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 12px;
}

.circle-btn {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #d0eeff;
  font-size: 36px;
  text-align: center;
  line-height: 80px;
}

.circle-btn.wrong {
  background-color: #ffdede;
}

/* 포인트샵 */
.shop-section {
  margin-bottom: 20px;
}

.shop-items {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.item {
  text-align: center;
  flex: 1;
}

.item img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.item .price {
  font-weight: bold;
}
</style>
