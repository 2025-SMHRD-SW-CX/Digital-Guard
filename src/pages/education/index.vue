<template>
  <div class="quiz-container">
    <!-- ✅ 헤더 + 영상 카드 -->
    <CardView :style="{ marginBottom: '1.5rem' }">
      <header class="header">
        <div class="logo">Digital Guard</div>
      </header>

      <div class="video-section">
        <div class="video-wrapper">
          <div id="youtubePlayer" @dblclick.prevent></div>
          <div class="click-blocker" @dblclick.prevent></div>
        </div>

        
        <!-- ✅ 시간 정보 표시 -->
        <div class="video-times">
          ⏱ {{ currentDisplayTime }} / {{ durationDisplayTime }}
        </div>
        <div class="video-controls">
          <button class="control-btn" @click="seek(-10)" :disabled="!canSeek(-10)">⏪ 10초</button>
          <button class="play-toggle-button" @click="togglePlay" :disabled="!playerReady">
            {{ isPlaying ? '⏸ 일시정지' : '▶ 재생' }}
          </button>
          <button class="control-btn" @click="seek(10)" :disabled="!canSeek(10)">10초 ⏩</button>
        </div>

      </div>
    </CardView>

    <!-- ✅ 퀴즈 카드 -->
    <CardView>
      <div class="quiz-section-wrapper">
        <div class="quiz-info-overlay" v-if="!videoWatched || quizCompleted">
          <template v-if="quizCompleted">
            <p>🎉 이미 참여하셨습니다!</p>
            <p>✅ 포인트가 지급된 상태입니다.</p>
          </template>
          <template v-else>
            <p>🎥 영상 시청 후 퀴즈를 풀어주세요!</p>
            <p>💰 퀴즈를 풀면 <strong>100포인트</strong>가 지급됩니다!</p>
          </template>
        </div>

        <div class="quiz-section" :class="{ blurred: !videoWatched || quizCompleted }">
          <div class="quiz-title">문제</div>
          <p class="quiz-question">
            딥페이크 기술을 이용한 성적 허위 영상물과 관련한 처벌 대상이 아닌 항목은?
          </p>
          <ol class="quiz-options">
            <li v-for="(option, index) in options" :key="index">
              <label>
                <input
                  type="radio"
                  :value="index + 1"
                  v-model="selectedAnswer"
                  :disabled="quizCompleted"
                />
                {{ option }}
              </label>
            </li>
          </ol>
          <button class="submit-button" @click="checkAnswer" :disabled="quizCompleted">정답 확인</button>
        </div>
      </div>
    </CardView>

    <!-- 결과 모달 -->
    <ModalView v-model="showModal" :type="modalType" :useButton="quizCompleted ? false : true" @confirm="handleModalConfirm">
      <template #default>
        <div v-if="quizCompleted">
          <canvas id="confetti-canvas" class="confetti-canvas"></canvas>
          <p>정답입니다! 100포인트가 적립되었습니다!</p>
          <br />
          <div class="explanation">
            <p>🛑 해설: 딥페이크 기술을 이용한 허위 영상물과 관련해 <strong>제작, 배포, 소지, 구입, 저장, 시청</strong>은 모두 형사처벌 대상입니다.<br />
            하지만 <strong>‘신고’는 우리가 해야 할 일</strong> 입니다.</p>
          </div>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ModalView from '@/components/ModalView.vue'
import CardView from '@/components/CardView.vue'
import { db } from '@/services/supabase'
import { useUserStore } from '@/stores/user'
import confetti from 'canvas-confetti'

const router = useRouter()
const user = useUserStore()

const videoWatched = ref(false)
const quizCompleted = ref(false)
const selectedAnswer = ref(null)
const showModal = ref(false)
const modalMessage = ref('')
const modalType = ref('alert')
const isPlaying = ref(false)
const playerReady = ref(false)

const currentTime = ref(0)
const duration = ref(0)
const maxPlayedSeconds = ref(0);

const currentDisplayTime = computed(() => formatTime(currentTime.value))
const durationDisplayTime = computed(() => formatTime(duration.value))

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const correctAnswer = 4
const quizId = 1
const options = ['소지', '시청', '제작', '신고']

let player
let progressInterval = null

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    videoWatched.value = true
    isPlaying.value = false
    stopTrackProgress()
  } else if (event.data === YT.PlayerState.PLAYING) {
    isPlaying.value = true
    event.target.unMute()
    startTrackProgress()
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying.value = false
    stopTrackProgress()
  }
}

function startTrackProgress() {
  stopTrackProgress()
  progressInterval = setInterval(() => {
    if (player?.getCurrentTime) {
      currentTime.value = player.getCurrentTime()
      const d = player.getDuration()
      if (!isNaN(d)) duration.value = d
      // ⬇️ 여기서 최대 위치 추적
      if (currentTime.value > maxPlayedSeconds.value)
        maxPlayedSeconds.value = currentTime.value
    }
  }, 200)
}

function stopTrackProgress() {
  if (progressInterval) clearInterval(progressInterval)
  progressInterval = null
}

function togglePlay() {
  if (!player) return
  const state = player.getPlayerState()
  state === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo()
}

function seek(sec) {
  if (!player) return
  let target = player.getCurrentTime() + sec
  target = sec > 0 ? Math.min(target, maxPlayedSeconds.value) : Math.max(0, target)
  player.seekTo(target, true)
}

function canSeek(sec) {
  if (!playerReady.value || !player) return false
  const now = player.getCurrentTime()
  if (sec < 0) return now > 0
  if (sec > 0) return now + sec <= maxPlayedSeconds.value
  return false
}

function createPlayer() {
  player = new YT.Player('youtubePlayer', {
    height: '260',
    width: '100%',
    videoId: 'STJm09McLNw',
    playerVars: { autoplay: 0, mute: 0, controls: 0, rel: 0, disablekb: 1, modestbranding: 1, playsinline: 1 },
    events: {
      onReady: () => { playerReady.value = true },
      onStateChange: onPlayerStateChange
    }
  })
}

async function checkAnswer() {
  if (selectedAnswer.value === correctAnswer) {
    quizCompleted.value = true
    try {
      await db.from('edu_quiz_participation').insert({ user_id: user.id, quiz_id: quizId, is_correct: true, reward_given: true })
      await db.from('user').update({ total_point: user.total_point + 100 }).eq('id', user.id)
      await db.from('point_history').insert({ user_id: user.id, point: 100, reason: '영상 퀴즈 정답 포인트 지급' })
      user.total_point += 100
    } catch (e) {
      modalMessage.value = '포인트 지급 중 오류가 발생했습니다.'
    }
    nextTick(() => {
      const canvas = document.getElementById('confetti-canvas')
      if (canvas) confetti.create(canvas, { resize: true })({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
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
    window.onYouTubeIframeAPIReady = createPlayer
  } else if (window.YT?.Player) {
    createPlayer()
  } else {
    const waitYT = setInterval(() => {
      if (window.YT?.Player) {
        createPlayer()
        clearInterval(waitYT)
      }
    }, 500)
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

.video-section {
  /* background: #f3bcbc; */
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

.video-controls {
  /* position: absolute;  ←❌ 제거! */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.3rem;
  margin: 0.7rem 0 0.4rem 0;
  /* 영상 아래에 여백 */
  /* 필요하다면 */
  /* background: #fff; */
  /* border-radius: 12px; */
}
.video-times {
  margin-top: 0.3rem;
  font-size: 0.85rem;
  color: #333;
  text-align: left;
  line-height: 1.4;
}
.play-toggle-button,
.control-btn {
  padding: 10px 20px;
  font-size: 16px;
  background: #2a3faa;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.18s;
}

.control-btn:disabled,
.play-toggle-button:disabled {
  background: #aaa;
  color: #eee;
  cursor: not-allowed;
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
  display: flex;
  flex-direction: column;
  align-items: start;
}

.quiz-section.blurred {
  filter: blur(6px);
  pointer-events: none;
}

.quiz-title {
  width: 100%;
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
  font-size: 1.2rem;
}

.quiz-options li {
  margin: 6px 0;
  font-size: 1.2rem;
  list-style: none;
}

.submit-button {
  width: 100%;
  margin-top: 1rem;
  padding: 10px 16px;
  background-color: #2a3faa;
  color: white;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
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