<template>
    <CardView padding="1rem" v-for="item in surveyStore.data" :key="item.id">
        <div class="survey-wrap" :class="{ disabled: !canParticipate(item) }"
            @click="() => canParticipate(item) && clickSurvey(item.id)">
            <!-- 설문 참여 제한(완료)시 체크아이콘+오버레이 표시 -->
            <div v-if="!canParticipate(item)" class="overlay">
                <div class="complete-badge">
                    <svg width="20" height="20" viewBox="0 0 32 32">
                        <circle cx="8" cy="8" r="15" fill="#fff" opacity="0" />
                        <path d="M10 17.5l4.2 3.6 7.2-8.2" fill="none" stroke="#3D7BFF" stroke-width="3"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>{{ getRemainText(item) }}</span>
                </div>
            </div>

            <div class="survey-info" :class="{ blur: !canParticipate(item) }">
                <p class="title">{{ item.title }}</p>
                <div class="indicator-wrap">
                    <div class="icon-value-wrap">
                        <img :src="`${BASE_URL}/images/coin_icon.png`">
                        <p>+{{ item.reward }}P</p>
                    </div>
                    <div class="icon-value-wrap">
                        <img :src="`${BASE_URL}/images/survey/sandclock_icon.png`">
                        <p>{{ item.time }}</p>
                    </div>
                </div>
            </div>
        </div>
    </CardView>
    <div v-if="targetData">

        <ModalView v-model="showModal" :title="targetData.title" confirmText="시작!" :backdrop="true"
            @confirm="goToSurvey">

            <div class="modal-content">

                <div :key="targetData.id">
                    <p>{{ targetData.desc }}</p>
                </div>
                <div class="indicator-inline">
                    <div class="indicator-wrap">
                        <div class="icon-value-wrap">
                            <img :src="`${BASE_URL}/images/coin_icon.png`">
                            <p>+{{ targetData.reward }}</p>
                        </div>
                        <!-- 소요시간 -->
                        <div class="icon-value-wrap">
                            <img :src="`${BASE_URL}/images/survey/sandclock_icon.png`">
                            <p>{{ targetData.time }}</p>
                        </div>
                        <!-- 난이도 -->
                        <div class="icon-value-wrap">
                            <img :src="`${BASE_URL}/images/survey/star_${targetData.feelLevel[0]}.png`">
                            <p>{{ targetData.feelLevel[1] }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </ModalView>
    </div>


</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";

import { ref } from 'vue';
import CardView from '@/components/CardView.vue';
import ModalView from '@/components/ModalView.vue';
import { useSurveyStore } from "@/stores/survey";
import { useRouter } from 'vue-router';
import { SURVEYS, DATA } from '@/stores/survey';
import { useAlertStore } from '@/stores/alert'

const router = useRouter();
const alert = useAlertStore();

const surveyStore = useSurveyStore();
const showModal = ref(false);

const targetData = ref(null);

const clickSurvey = (id) => {
    targetData.value = DATA.find(i => i.id == id);
    showModal.value = true;
}

const goToSurvey = () => {
    const id = targetData.value.id;

    const foundSurvey = SURVEYS.find(i => i.surveyId == id);

    if (foundSurvey) {
        router.push(`/survey/do/${id}`);
    } else {
        alert.warning('해당 설문은 구현되지 않았습니다!', 3000);
    }

}

// 설문 참여 가능 여부 함수
function canParticipate(item) {
    if (!item.lastComplete || !item.intervalDays) return true;
    const last = new Date(item.lastComplete);
    const now = new Date();
    const next = new Date(last);
    next.setDate(last.getDate() + item.intervalDays);
    return now >= next;
}

// 오버레이에 띄울 남은 시간 텍스트
function getRemainText(item) {
    if (!item.lastComplete || !item.intervalDays) return '';
    const last = new Date(item.lastComplete);
    const now = new Date();
    const next = new Date(last);
    next.setDate(last.getDate() + item.intervalDays);
    if (now >= next) return '';
    const remain = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return `참여 완료, ${remain}일 뒤 다시 참여해주세요!`;
}
</script>

<style lang="scss" scoped>
.survey-wrap {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: filter 0.25s, opacity 0.22s;

    &.disabled {
        pointer-events: none;
        cursor: not-allowed;
    }

    .overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        border-radius: 1rem;
        pointer-events: all;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 0.8rem 0.7rem 0 0.7rem;
    }

    .complete-badge {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 2.9rem;
        left: -0.5rem;
        z-index: 11;
        background: $color-thin-sky;
        border-radius: 0.25rem;
        padding: 0.1rem 0.9rem 0.1rem 0.5rem;

        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);
        font-weight: 600;
        font-size: 1rem;
        color: #2251B6;
        user-select: none;

        svg {
            margin-right: 0.1rem;
            flex-shrink: 0;
        }

        span {
            font-size: 0.7rem;
            font-weight: 600;
            color: #2251B6;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 12px #fff7;
        }
    }

    .survey-info {
        filter: none;
        transition: filter 0.18s;
        width: 100%;
        display: flex;

        &.blur {
            filter: blur(1px) opacity(0.5);
        }

        .title {
            position: relative;
            z-index: 12; // title이 오버레이/뱃지 위로 올라오지 않도록(아래 깔림)
            text-align: start;
            width: 100%;
            flex-grow: 1;
            color: #222;
            font-weight: 600;
        }

        .indicator-wrap {
            width: 8rem;
            z-index: 12;
        }
    }




}

.icon-value-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    img {
        width: 1.4rem;
        object-fit: scale-down;
    }

    p {
        font-weight: 500;
        font-size: 0.9rem;
    }
}

.modal-content {

    .indicator-inline {
        margin-top: 1.5rem;
    }

    .indicator-wrap {
        display: flex;
        gap: 0.75rem;
    }
}
</style>