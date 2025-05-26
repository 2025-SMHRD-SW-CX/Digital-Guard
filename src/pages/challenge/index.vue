<template>
  <div class="main-container">
    <!-- ───────────── 챌린지 현황 ───────────── -->
    <CardView>
      <h2 class="section-title">챌린지 현황</h2>
      <div class="section-divider"></div>

      <div class="info-row">
        <span>총 참여 일수</span>
        <span class="value">{{ user.progressDays }}일</span>
      </div>

      <div class="info-row">
        <span>연속 참여 일수</span>
        <span class="value">{{ user.continuousDays }}일</span>
      </div>

      <div class="info-row">
        <span>챌린지 완료까지</span>
        <span class="value">{{ remainingDays }}일 남음</span>
      </div>
    </CardView>

    <!-- ───────────── 완료 챌린지 기록 ───────────── -->
    <CardView>
      <h2 class="section-title">완료 챌린지 기록</h2>
      <div class="section-divider"></div>

      <div
        class="record-item"
        v-for="(item, index) in visibleLogs"
        :key="index"
        @click="openModal(item)"
        style="cursor: pointer"
      >
        <p class="day-label">연속 참여 챌린지 {{ index + 1 }}일차</p>
        <div class="record-sub">
          <span class="date">{{ item.date }}</span>
          <span class="point">
            <img src="/images/coin_icon.png" class="coin-icon" alt="포인트 아이콘" />
            +{{ item.point }}P
          </span>
        </div>
        <p class="question">
          <span class="q-label">Q.</span> {{ item.question }}
        </p>
      </div>
    </CardView>

    <!-- ───────────── 상세보기 모달 ───────────── -->
    <ModalView v-model="isModalOpen" title="챌린지 상세 보기">
      <template #default>
        <div v-if="selectedLog">
          <p><strong>📅 참여 날짜:</strong> {{ selectedLog.date }}</p>
          <p><strong>💰 획득 포인트:</strong> +{{ selectedLog.point }}P</p>
          <p><strong>❓ 질문:</strong></p>
          <p class="modal-question">Q. {{ selectedLog.question }}</p>
          <p><strong>📝 해설:</strong></p>
          <p class="modal-description">{{ selectedLog.description }}</p>
        </div>
      </template>
    </ModalView>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import CardView from '@/components/CardView.vue'
import ModalView from '@/components/ModalView.vue'

const user = useUserStore()

// 질문과 해설 데이터
const allQuestions = [
  {
    question: '최근 1개월 내 SNS에서 혐오 또는 폭력적인 게시물을 본 적 있습니까?',
    description:
      'SNS에서의 혐오 표현이나 폭력적인 게시물은 청소년에게 부정적인 감정을 유발하고, 모방 위험성까지 높일 수 있습니다. 이런 콘텐츠를 자주 접하면 정서적 불안정, 자존감 저하, 공격성 증가로 이어질 수 있으니, 즉시 피하거나 신뢰할 수 있는 어른이나 선생님에게 상담받는 것이 좋습니다.'
  },
  {
    question: '온라인에서 성착취 관련 콘텐츠를 접한 적 있습니까?',
    description:
      '성착취 콘텐츠는 엄연한 불법이며, 제작·소지·유포 모두 형사처벌 대상입니다. 이런 콘텐츠를 접했다면 절대 저장하거나 공유하지 말고, 가능한 한 빠르게 신고해야 합니다. 신고는 여러분뿐 아니라 또 다른 피해자를 보호하는 중요한 행동입니다.'
  },
  {
    question: '게임을 하다가 유해 채팅이나 욕설을 경험한 적 있습니까?',
    description:
      '게임 내 유해 채팅, 욕설, 성희롱 등은 온라인 상의 폭력으로 간주될 수 있습니다. 이러한 상황에서는 즉시 신고하거나 채팅 차단, 사용자 차단 기능을 활용해야 하며, 반복적으로 경험된다면 보호자나 선생님, 상담기관에 도움을 요청하세요.'
  },
  {
    question: '온라인에서 사이버불링(괴롭힘)을 당하거나 목격한 적 있습니까?',
    description:
      '사이버불링은 단순한 장난이 아닌, 정신 건강에 심각한 영향을 주는 폭력입니다. 피해자는 불안, 우울, 대인기피 등을 겪을 수 있으며, 장기적으로 학업이나 생활에도 큰 지장을 초래할 수 있습니다. 목격자라면 방관하지 말고, 피해자를 도와주는 태도가 필요합니다.'
  },
  {
    question: '온라인에서 유해한 콘텐츠를 만났을 때 차단 또는 신고하는 것이 좋다.',
    description:
      '유해 콘텐츠는 청소년의 정서 발달에 악영향을 주며, 범죄에 노출되는 계기가 되기도 합니다. 단순히 넘기지 말고, 해당 플랫폼의 신고 기능이나 보호기관을 통해 적극적으로 차단·신고하는 태도를 갖는 것이 디지털 시민으로서의 올바른 자세입니다.'
  },
  {
    question: '불법웹툰 사이트를 친구에게 공유하면 처벌 대상이 된다.',
    description:
      '불법웹툰은 정식 유통 경로가 아닌 무단 복제된 콘텐츠로, 이를 공유하거나 시청하는 행위 자체도 저작권법 위반입니다. 특히 공유 행위는 "배포"로 간주되어 더 무거운 처벌을 받을 수 있으며, 형사책임과 손해배상까지 이어질 수 있습니다.'
  },
  {
    question: '불법 정보 게시물에 대한 신고 경험이 있습니까?',
    description:
      '불법 게시물은 음란물, 마약, 사기, 혐오, 자해 조장 등 다양한 유형이 있으며, 이를 방치하면 더 많은 피해자가 생깁니다. 신고는 단순한 클릭이 아닌, 안전한 인터넷 환경을 만드는 중요한 실천입니다. 올바른 디지털 시민으로서 관심을 갖고 행동하는 것이 필요합니다.'
  }
]


// 참여 로그 생성: 참여일을 기준으로 보상 계산 (마지막 참여일이 오늘이라면 마지막 항목을 오늘 기준으로 계산)
const logs = computed(() => {
  return Array.from({ length: user.progressDays }).map((_, i) => {
    const item = allQuestions[i] || {}
    const baseReward = 10;

    // ✅ 참여 전 기준 보너스 계산
    const bonus = i === 0 ? 0 : Math.round(baseReward * (i / user.totalNeedDays));
    const total = baseReward + bonus;

    return {
      date: `2025.05.${21 + i}. ${['09:00', '19:42', '12:01', '13:50', '22:13', '20:03', '17:00'][i] || '09:00'}`,
      point: total,
      question: item.question || 'Q. 추가 질문이 필요합니다.',
      description: item.description || '추가 설명이 없습니다.'
    }
  })
})



const visibleLogs = logs
const selectedLog = ref(null)
const isModalOpen = ref(false)

const openModal = (log) => {
  selectedLog.value = log
  isModalOpen.value = true
}

const remainingDays = computed(() => {
  return Math.max(user.totalNeedDays - user.progressDays, 0)
})
</script>

<style scoped lang="scss">
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

.modal-question {
  margin: 0.5rem 0;
  line-height: 1.6;
  font-size: 1rem;
  word-break: keep-all;
}

.modal-description {
  margin-top: 0.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
  color: #555;
  word-break: keep-all;
}
</style>