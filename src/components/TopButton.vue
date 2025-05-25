<template>
    <div v-if="props.scrollTarget">
        <transition name="fade-top-btn">
            <button v-show="visible" class="top-btn" @click="scrollToTop" aria-label="맨 위로 이동">
                ▲ TOP
            </button>
        </transition>
    </div>

</template>


<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
    scrollTarget: { type: Object }
})

const visible = ref(false)
let targetEl = null

function onScroll() {
    if (targetEl) {
        visible.value = targetEl.scrollTop > 1000
    }
}

function scrollToTop() {
    if (targetEl) {
        targetEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

// ref가 동적으로 변할 수 있으니 watch로 바인딩
watch(
    () => props.scrollTarget,
    (el) => {
        if (targetEl) {
            targetEl.removeEventListener('scroll', onScroll)
        }
        targetEl = el
        if (targetEl) {
            targetEl.addEventListener('scroll', onScroll)
            // mount 시 스크롤 위치 체크
            onScroll()
        }
    },
    { immediate: true }
)

onUnmounted(() => {
    if (targetEl) targetEl.removeEventListener('scroll', onScroll)
})
</script>


<style lang="scss" scoped>
.top-btn {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 4.5rem;
    z-index: $z-top-btn;
    padding: 0.75rem 1rem;
    background: #747474;
    color: #fff;
    border: none;
    border-radius: 10rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    font-size: 0.7rem;
    line-height: 0;
    font-weight: bold;
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 0.2s, transform 0.2s;
    height: 2rem;
}

/* 페이드 트랜지션 */
.fade-top-btn-enter-active,
.fade-top-btn-leave-active {
    transition: opacity 0.5s;
}

.fade-top-btn-enter-from,
.fade-top-btn-leave-to {
    opacity: 0;
}

.fade-top-btn-enter-to,
.fade-top-btn-leave-from {
    opacity: 0.4;
}
</style>
