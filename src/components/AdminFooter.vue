<template>
    <div class="footer-wrap">
        <p class="app-name"><b>디지털 가드</b>&nbsp&nbsp-&nbsp&nbspProd by Team.코드하모니, 김주현, 나상록, 오인경, 윤지우</p>
        <p class="camp-name">2025.03.14 고객경험데이터를 활용한 데이터 비즈니스 분석가과정</p>
    </div>
</template>


<script setup>

</script>

<style lang="scss" scoped>
.footer-wrap {
    width: 100%;
    height: 6rem;
    background-color: $color-dark-gray;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .app-info {
        display: flex;
        gap: 0.5rem;
    }

    .app-name {
        font-weight: 400;
    }

    .camp-name {
        font-weight: 400;
        font-size: 0.9rem;
    }


    .team-name {
        font-size: 0.9rem;
        font-weight: 300;
    }
}
</style>