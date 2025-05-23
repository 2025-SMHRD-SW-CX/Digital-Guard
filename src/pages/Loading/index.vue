<template>
  <div class="loading-container">
    <img
      :src="currentGif"
      alt="Loading animation"
      class="loading-image"
    />

    <div class="loading-text">Loading</div>

    <div class="dots">
      <span
        v-for="n in 5"
        :key="n"
        class="dot"
        :class="{ visible: n <= visibleDots }"
      >
        •
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const gifList = [
  '/animation_gif/cute-knight.gif',
  '/animation_gif/lying-knight.gif',
]

const visibleDots = ref(0)
const currentGif = ref('')

let intervalId = null

onMounted(() => {
  let lastGifIndex = Number(localStorage.getItem('lastGifIndex'))
  if (isNaN(lastGifIndex)) lastGifIndex = -1

  const nextGifIndex = (lastGifIndex + 1) % gifList.length
  currentGif.value = gifList[nextGifIndex]
  localStorage.setItem('lastGifIndex', nextGifIndex)

  intervalId = setInterval(() => {
    visibleDots.value = visibleDots.value < 5 ? visibleDots.value + 1 : 1
  }, 500)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&display=swap');

.loading-container {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 중앙 */
  align-items: center;     /* 수평 중앙 */
  font-family: 'Agbalumo', cursive;
}

.loading-image {
  width: 200px;
  height: auto;
  margin-bottom: 10px;
}

.loading-text {
  font-size: 45px;
  margin-bottom: 2px;
  color: #fff; 
  line-height: 0;
}

.dots {
  font-size: 32px;
  letter-spacing: 5px;
  color: #ccc;
  margin-top: 1.5rem;
}

.dot {
  opacity: 0.2;
  transition: opacity 0.3s ease;
  user-select: none;
}

.dot.visible {
  opacity: 1;
}
</style>