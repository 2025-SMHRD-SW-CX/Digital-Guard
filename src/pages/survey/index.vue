<template>
    <CardView padding="1rem" v-for="item in survey.data" :key="item.id">
        <div class="survey-wrap" @click="() => clickSurvey(item.id)">

            <p class="title">{{ item.title }}</p>

            <div class="indicator-wrap">
                <!-- 리워드 획득량 -->
                <div class="icon-value-wrap">
                    <img src="/images/coin_icon.png">
                    <p>+{{ item.reward }}</p>
                </div>
                <!-- 소요시간 -->
                <div class="icon-value-wrap">
                    <img src="/images/survey/sandclock_icon.png">
                    <p>{{ item.time }}</p>
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
                            <img src="/images/coin_icon.png">
                            <p>+{{ targetData.reward }}</p>
                        </div>
                        <!-- 소요시간 -->
                        <div class="icon-value-wrap">
                            <img src="/images/survey/sandclock_icon.png">
                            <p>{{ targetData.time }}</p>
                        </div>
                        <!-- 난이도 -->
                        <div class="icon-value-wrap">
                            <img :src="`/images/survey/star_${targetData.feelLevel[0]}.png`">
                            <p>{{ targetData.feelLevel[1] }}</p>
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
import { useRouter } from 'vue-router';
import { SURVEYS, DATA } from '@/stores/survey';
import { useAlertStore } from '@/stores/alert'

const router = useRouter();
const alert = useAlertStore();

const survey = useSurveyStore();
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

</script>

<style lang="scss" scoped>
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