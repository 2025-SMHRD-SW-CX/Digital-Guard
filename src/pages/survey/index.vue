<template>
    <CardView padding="1rem" v-for="item in survey.data" :key="item.id">
        <div class="survey-wrap" @click="clickSurvey">

            <p class="title">{{ item.title }}</p>

            <div class="indicator-wrap">
                <!-- 리워드 획득량 -->
                <div class="icon-value-wrap">
                    <img src="/images/coin_icon.png">
                    <p>+{{ item.reward }}</p>
                </div>
                <!-- 소요시간 -->
                <div class="icon-value-wrap">
                    <img src="/images/sandclock_icon.png">
                    <p>{{ item.time }}</p>
                </div>
                <!-- 난이도 -->
                <div class="icon-value-wrap" v-if="selectedId">
                    <img :src="`/images/star_${item.feelLevel[0]}.png`">
                    <p>{{ item.feelLevel[1] }}</p>
                </div>
            </div>
        </div>

    </CardView>

    <ModalView v-model="showModal"
        title="설문조사를 시작할까요?"
        confirmText="시작!"
        :backdrop="true"
    >
        <div>

        </div>
    </ModalView>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import CardView from '@/components/CardView.vue';
import ModalView from '@/components/ModalView.vue';
import { useSurveyStore } from "@/stores/survey";

const survey = useSurveyStore();
const selectedId = ref(null);
const showModal = ref(false);

// onMounted(() => {
//     setTimeout(() => {
//         showModal.value = true;
//     }, 3000);
// })

const clickSurvey = () => {
    showModal.value = true;
}


</script>

<style lang="scss" scoped>
p {
    margin: 0;
}

.survey-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .title {
        text-align: start;
        width: 100%;
        flex-grow: 1;
    }

    .indicator-wrap {

        width: 8rem;

        .icon-value-wrap {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            img {
                width: 1.4rem;
                object-fit: scale-down;
            }

            p {
                margin: 0;
                font-weight: 500;
                font-size: 0.9rem;
            }
        }
    }
}
</style>