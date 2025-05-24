<template>
  <div class="main-container">
    <!-- 오늘의 챌린지 현황 -->
    <CardView>
      <h2 class="section-title">챌린지 현황</h2>
      <div class="section-divider"></div>
      <div class="info-row">
        <span>연속 완료 일수</span>
        <span class="value">{{ streak }}일</span>
      </div>
      <div class="info-row">
        <span>현재까지 누적된 포인트</span>
        <span class="value">{{ totalPoints }}P</span>
      </div>
      <div class="info-row">
        <span>연속 참여 챌린지 완료까지</span>
        <span class="value">{{ remainingDays }}일 남음</span>
      </div>
    </CardView>

    <!-- 연속 참여 챌린지 참여 내용 -->
    <CardView>
      <h2 class="section-title">완료 챌린지 기록</h2>
      <div class="section-divider"></div>
      <div
        class="record-item"
        v-for="(item, index) in logs"
        :key="index"
      >
        <p class="day-label">연속 참여 챌린지 {{ index + 1 }}일차</p>
        <div class="record-sub">
          <span class="date">{{ item.date }}</span>
          <span class="point">
            <img src="/images/coin_icon.png" class="coin-icon" alt="포인트 아이콘" />
            +{{ item.point }}
          </span>
        </div>
        <p class="question">
          <span class="q-label">Q.</span> {{ item.question }}
        </p>
      </div>
    </CardView>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CardView from '@/components/CardView.vue'

const streak = ref(6)
const totalPoints = ref(60)
const remainingDays = ref(2)

const logs = ref([
  { date: '2025.05.21. 09:00', point: 10, question: '최근 1개월 내 SNS에서 혐오 또는 폭력적인 게시물을 본 적 있습니까?' },
  { date: '2025.05.22. 19:42', point: 10, question: '온라인에서 성착취 관련 콘텐츠를 접한 적이 있습니까?' },
  { date: '2025.05.23. 12:01', point: 10, question: '게임을 하다가 유해 채팅이나 욕설을 경험한 적 있습니까?' },
  { date: '2025.05.24. 13:50', point: 10, question: '온라인에서 사이버불링(괴롭힘)을 당하거나 목격한 적 있습니까?' },
  { date: '2025.05.25. 22:13', point: 10, question: '온라인에서 유해한 콘텐츠를 만났을 때 차단 또는 신고하는 것이 좋다.' },
  { date: '2025.05.26. 20:03', point: 10, question: '불법웹툰 사이트를 친구에게 공유하면 처벌 대상이 된다.' }
])
</script>

<style lang="scss" scoped>
.main-container {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  min-height: 100vh;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.section-divider {
  width: 100%;
  height: 2.2px;
  background-color: #ddd;
  margin: 0.8rem 0 1.2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  margin-bottom: 0.8rem;
}

.value {
  font-weight: bold;
  font-size: 1.1rem;
}

.record-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
}

.day-label {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.record-sub {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.point {
  font-weight: bold;
  color: #3ba2ff;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.coin-icon {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
}

.question {
  font-size: 0.9rem;
  color: #333;
  word-break: keep-all;
  white-space: normal;
  text-align: left;
  display: flex;
  gap: 0.4rem;
  align-items: flex-start;
}

.q-label {
  font-weight: bold;
  flex-shrink: 0;
}
</style>
