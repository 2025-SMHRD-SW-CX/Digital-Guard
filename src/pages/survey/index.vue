<template>
    <CardView padding="1rem" v-for="item in survey.data" :key="item.id">
        <div class="survey-wrap" @click="() => clickSurvey(item.id - 1)">

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
                <!-- <div class="icon-value-wrap" v-if="selectedId">
                    <img :src="`/images/star_${item.feelLevel[0]}.png`">
                    <p>{{ item.feelLevel[1] }}</p>
                </div> -->
            </div>
        </div>

    </CardView>

    <div v-if="selectedId !== null">
        <ModalView v-model="showModal" :title="survey.data[selectedId].title" confirmText="시작!" :backdrop="true">
            <div class="modal-content">

                <div :key="selectedId">
                    <p>{{ survey.data[selectedId].desc }}</p>
                </div>
                <div class="indicator-inline">
                    <div class="indicator-wrap">
                        <div class="icon-value-wrap">
                            <img src="/images/coin_icon.png">
                            <p>+{{ survey.data[selectedId].reward }}</p>
                        </div>
                        <!-- 소요시간 -->
                        <div class="icon-value-wrap">
                            <img src="/images/sandclock_icon.png">
                            <p>{{ survey.data[selectedId].time }}</p>
                        </div>
                        <!-- 난이도 -->
                        <div class="icon-value-wrap">
                            <img :src="`/images/star_${survey.data[selectedId].feelLevel[0]}.png`">
                            <p>{{ survey.data[selectedId].feelLevel[1] }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </ModalView>
    </div>

</template>

<script setup>

import { ref } from 'vue';
import CardView from '@/components/CardView.vue';
import ModalView from '@/components/ModalView.vue';
import { useSurveyStore } from "@/stores/survey";

const survey = useSurveyStore();
const selectedId = ref(null);
const showModal = ref(false);

const clickSurvey = (id) => {
    selectedId.value = id;
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
                margin: 0;
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