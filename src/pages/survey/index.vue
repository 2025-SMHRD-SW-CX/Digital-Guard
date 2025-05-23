<template>

    <div class="survey-wrap">
        <p>{{ survey[0].title }}</p>

        <div class="indicator-wrap">
            <!-- 리워드 획득량 -->
            <div class="icon-value-wrap">
                <img src="/images/coin_icon.png">
                <p>+{{ survey[0].reward }}</p>
            </div>
            <!-- 소요시간 -->
            <div class="icon-value-wrap">
                <img src="/images/sandclock_icon.png">
                <p>{{ survey[0].time }}</p>
            </div>
            <!-- 난이도 -->
            <div class="icon-value-wrap">
                <img :src="`/images/star_${survey[0].feelLevel[0]}.png`">
                <p>{{ survey[0].feelLevel[1] }}</p>
            </div>
        </div>
    </div>

</template>

<script setup>

    import { useSurveyStore } from "@/stores/survey";
    const survey = useSurveyStore();

</script>

<style lang="scss" scoped>
.survey-wrap {
    border: 1px solid $color-lightgrey;
    border-radius: 0.25rem;
    padding: 0.75rem;


    .indicator-wrap {


        .icon-value-wrap {
            display: flex;

            img {
                width: 2rem;
                object-fit: scale-down;
            }
        }
    }
}
</style>