<template>
    <transition name="fade-loading">
        <div v-if="loadingStore.visible" class="loading-container">
            <img :src="currentGif" alt="Loading animation" class="loading-image" />
            <div class="loading-text">Loading</div>
            <div class="dots">
                <span v-for="n in 5" :key="n" class="dot" :class="{ visible: n <= visibleDots }">•</span>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import { BASE_URL } from "@/js/baseUrl"

const loadingStore = useLoadingStore()

const gifList = [
    `${ BASE_URL }/animation_gif/cute-knight.gif`,
    `${ BASE_URL } /animation_gif/lying-knight.gif`,
]

const visibleDots = ref(0)
const currentGif = ref('')

let intervalId = null

watch(() => loadingStore.visible, (val) => {
    if (val) {
        // 시작
        let lastGifIndex = Number(localStorage.getItem('lastGifIndex'))
        if (isNaN(lastGifIndex)) lastGifIndex = -1

        const nextGifIndex = (lastGifIndex + 1) % gifList.length
        currentGif.value = gifList[nextGifIndex]
        localStorage.setItem('lastGifIndex', nextGifIndex)

        visibleDots.value = 0
        clearInterval(intervalId)
        intervalId = setInterval(() => {
            visibleDots.value = visibleDots.value < 5 ? visibleDots.value + 1 : 1
        }, 500)
    } else {
        // 정지
        clearInterval(intervalId)
        visibleDots.value = 0
    }
}, { immediate: true })

onBeforeUnmount(() => {
    clearInterval(intervalId)
})
</script>



<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&display=swap');

.loading-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    /* $z-loading 대신 직접 값 할당 or 변수 지정 */
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

.fade-loading-enter-active,
.fade-loading-leave-active {
    transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-loading-enter-from,
.fade-loading-leave-to {
    opacity: 0;
}

.fade-loading-enter-to,
.fade-loading-leave-from {
    opacity: 1;
}

/* ...나머지 스타일 생략 (동일하게 유지) */
</style>


<style lang="scss" scoped></style>