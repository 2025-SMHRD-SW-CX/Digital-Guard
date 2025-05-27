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
          <span class="date">{{ formatDateTime(item.created_at) }}</span>
          <span class="point">
            <img :src="`${BASE_URL}/images/coin_icon.png`" class="coin-icon" alt="포인트 아이콘" />
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
          <p><strong>📅 참여 날짜:</strong> {{ formatDateTime(selectedLog.created_at) }}</p>
          <p><strong>💰 획득 포인트:</strong> +{{ selectedLog.reward_point }}P</p>
          <p><strong>❓ 질문:</strong></p>
          <p class="modal-question">Q. {{ selectedLog.question }}</p>
          <p><strong>📝 해설:</strong></p>
          <p class="modal-description">{{ selectedLog.explanation }}</p>
        </div>
      </template>
    </ModalView>
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { ref, computed, onMounted } from 'vue'
import { db } from '@/services/supabase';
import { useUserStore } from '@/stores/user'
import CardView from '@/components/CardView.vue'
import ModalView from '@/components/ModalView.vue'

const user = useUserStore()

const logs = ref([])
const isModalOpen = ref(false)
const selectedLog = ref(null)

const openModal = (log) => {
  selectedLog.value = log
  isModalOpen.value = true
}

const formatDateTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 완료 로그 가져오기
onMounted(async () => {
  const { data, error } = await db
    .from('quiz_participation')
    .select(`
      *,
      quiz_questions:question_id (
        text,
        explanation
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (!error && data) {
    logs.value = data.map(item => ({
      ...item,
      question: item.quiz_questions?.text || '질문 없음',
      explanation: item.quiz_questions?.explanation || '해설 없음'
    }))
  } else {
    console.error('퀴즈 참여 기록 불러오기 실패:', error)
  }
})

const visibleLogs = computed(() => logs.value)
const remainingDays = computed(() => Math.max(user.totalNeedDays - user.progressDays, 0))
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