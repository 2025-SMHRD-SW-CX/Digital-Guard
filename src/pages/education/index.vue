<template>
  <div class="quiz-container">
    <!-- 상단 헤더 -->
    <header class="header">
      <div class="logo">Digital Guard</div>
      <div class="icons">
        <button class="play-toggle-button-header" @click="togglePlay">
          {{ isPlaying ? '⏸ 일시정지' : '▶ 재생' }}
        </button>
      </div>
    </header>

    <!-- 유튜브 영상 영역 -->
    <div class="video-section">
      <div class="video-wrapper">
        <div id="youtubePlayer" @dblclick.prevent></div>
        <div class="click-blocker" @dblclick.prevent></div>
      </div>
    </div>

    <!-- 퀴즈 영역 -->
    <div class="quiz-section-wrapper">
      <div class="quiz-info-overlay" v-if="!videoWatched">
        <p>🎥 영상 시청 후 퀴즈를 풀어주세요!</p>
        <p>💰 퀴즈를 풀면 <strong>100포인트</strong>가 지급됩니다!</p>
      </div>

      <div class="quiz-section" :class="{ blurred: !videoWatched || quizCompleted }">
        <div class="quiz-title">문제</div>
        <p class="quiz-question">
          영상 속 주인공이 교육청에서 검정고시를 접수하던 중 직원분들께 소개받은 곳은?
        </p>
        <ol class="quiz-options">
          <li v-for="(option, index) in options" :key="index">
            <label>
              <input type="radio" :value="index + 1" v-model="selectedAnswer" :disabled="quizCompleted" />
              {{ option }}
            </label>
          </li>
        </ol>
        <button class="submit-button" @click="checkAnswer" :disabled="quizCompleted">정답 확인</button>
      </div>
    </div>

    <ModalView v-model="showModal" :type="modalType" :useButton="quizCompleted ? false : true" @confirm="handleModalConfirm">
  <template #default>
    <div v-if="quizCompleted">
      <canvas id="confetti-canvas" class="confetti-canvas"></canvas>
      <p>정답입니다! 100포인트가 적립되었습니다.</p>
      <div class="modal-actions">
        <button class="next-button" disabled>다음 교육영상 보기 (준비중)</button>
        <button class="home-button" @click="goHome">홈으로</button>
      </div>
    </div>
    <div v-else>
      <p>{{ modalMessage }}</p>
    </div>
  </template>
</ModalView>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, nextTick } from 'vue'
import ModalView from '@/components/ModalView.vue'
import confetti from 'canvas-confetti'

const videoWatched = ref(false)
const quizCompleted = ref(false)
const selectedAnswer = ref(null)
const showModal = ref(false)
const modalMessage = ref('')
const modalType = ref('alert')
const isPlaying = ref(false)
const router = useRouter()

const correctAnswer = 3
const options = [
  '직업훈련 교육학원',
  '동사무소',
  '학교밖청소년 지원센터',
  '청소년 문화의 집'
]

let player

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    videoWatched.value = true
    isPlaying.value = false
  } else if (event.data === YT.PlayerState.PLAYING) {
    isPlaying.value = true
    event.target.unMute()
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying.value = false
  }
}

function togglePlay() {
  if (!player) return
  const state = player.getPlayerState()
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo()
  } else {
    player.playVideo()
  }
}

function createPlayer() {
  player = new YT.Player('youtubePlayer', {
    height: '260',
    width: '100%',
    videoId: 'Ab8Yi4IQhJM',
    playerVars: {
      autoplay: 0,
      mute: 0,
      controls: 0,
      rel: 0,
      disablekb: 1,
      modestbranding: 1,
      playsinline: 1
    },
    events: {
      onReady: () => {},
      onStateChange: onPlayerStateChange
    }
  })
}

function checkAnswer() {
  if (selectedAnswer.value === correctAnswer) {
    quizCompleted.value = true
    nextTick(() => {
      const canvas = document.getElementById('confetti-canvas')
      if (canvas) {
        confetti.create(canvas, { resize: true })({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    })
  } else {
    modalMessage.value = '조금만 더 고민해보세요!'
  }
  showModal.value = true
}

function handleModalConfirm() {
  showModal.value = false
}

function goHome() {
  router.push('/main')
}

onMounted(() => {
  if (!window.YT) {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
  } else {
    createPlayer()
  }

  window.onYouTubeIframeAPIReady = () => {
    createPlayer()
  }
})
</script>

<style scoped>
.quiz-container {
  font-family: Arial, sans-serif;
  max-width: 480px;
  margin: auto;
  background: #f5f5f5;
  padding-bottom: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  font-weight: bold;
  background: white;
}
.logo {
  font-size: 1.2rem;
  color: #2a3faa;
}
.play-toggle-button-header {
  padding: 8px 12px;
  background: #2a3faa;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.video-section {
  background: #f3bcbc;
  text-align: center;
  padding: 0 0 1rem 0;
}
.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: black;
}
#youtubePlayer {
  width: 100%;
  height: 100%;
}
.click-blocker {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background: transparent;
  pointer-events: auto;
}
.quiz-section-wrapper {
  position: relative;
}
.quiz-info-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 10;
  font-size: 16px;
  font-weight: bold;
  color: #222;
  border-radius: 12px;
  padding: 1rem;
}
.quiz-section {
  position: relative;
  background: white;
  border-radius: 12px;
  margin: 1rem;
  padding: 1rem;
  transition: filter 0.3s ease;
}
.quiz-section.blurred {
  filter: blur(6px);
  pointer-events: none;
}
.quiz-title {
  font-weight: bold;
  background: #2a3faa;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  font-size: 14px;
  margin-bottom: 8px;
}
.quiz-question {
  margin-bottom: 1rem;
  font-size: 15px;
}
.quiz-options li {
  margin: 6px 0;
  font-size: 15px;
  list-style: none;
}
.submit-button {
  margin-top: 1rem;
  padding: 10px 16px;
  background-color: #2a3faa;
  color: white;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 1rem;
}
.modal-actions button {
  padding: 10px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.next-button {
  background-color: #ccc;
  color: #333;
  cursor: not-allowed;
}
.home-button {
  background-color: #2a3faa;
  color: white;
}
.confetti-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}
</style>
