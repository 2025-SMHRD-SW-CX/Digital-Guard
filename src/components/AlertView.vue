
<template>
    <div class="alert-container">
        <transition-group name="slide-down" tag="div">
            <div
                v-for="alert in alertStore.alerts"
                :key="alert.id"
                :class="['alert', alert.type]"
            >
                <span class="message" v-html="alert.message"></span>
                <button class="close" @click="alertStore.remove(alert.id)">×</button>
                <div
                    v-if="typeof alert.duration === 'number' && alert.duration > 0"
                    class="progress-bar"
                >
                    <div
                        class="progress-fill"
                        :style="{ animationDuration: alert.duration + 'ms' }"
                    />
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();
</script>

<style lang="scss" scoped>
.alert-container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    z-index: $z-alert;
}

.alert {
    pointer-events: auto;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    margin-top: 0.5rem;
    padding: 0.75rem 1rem;
    min-width: 90vw;
    max-width: 90vw;
    position: relative;
    overflow: hidden;

    &.info    { border-left: 4px solid #5bc0de; }
    &.success { border-left: 4px solid #5cb85c; }
    &.warning { border-left: 4px solid #f0ad4e; }
    &.danger  { border-left: 4px solid #d9534f; }
    &.confirm { border-left: 4px solid #0275d8; }

    .message {
        flex-grow: 1;
    }
    .close {
        background: transparent;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        line-height: 1;
        margin-left: 0.5rem;
    }
}

/* 프로그레스바 */
.progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(0, 0, 0, 0.1);
}
.progress-fill {
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    animation-name: shrink;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
}
@keyframes shrink {
    from { width: 100%; }
    to   { width:   0%; }
}

/* Slide-down transition */
.slide-down-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}
.slide-down-enter-to {
    transform: translateY(0);
    opacity: 1;
}
.slide-down-enter-active {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.slide-down-leave-active {
    transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-down-leave-to {
    transform: scale(0.8);
    opacity: 0;
}
</style>