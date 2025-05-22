<template>
    <!-- 푸터 -->
   <div class="footer-wrap">
        <img src="/images/footer_edu.png" class="footer-btn">
        <img src="/images/footer_survey.png" class="footer-btn">

        <div class="footer-logo-wrap">
            <img src="/images/logo.png" class="footer-logo">
        </div>

        <img src="/images/footer_shop.png" class="footer-btn">
        <img src="/images/footer_mypage.png" class="footer-btn">
   </div>
</template>

<style lang="scss" scoped>

.footer-wrap {
    border: 1px solid blue;
    background-color: rgb(202, 233, 239);
    display: flex;
    justify-content: space-between;
    // padding: 위 오른쪽 아래 왼쪽;
    // padding: 상하 좌우;
    padding: 15px 10px;
    z-index: 0;
}

.footer-logo-wrap {
    // width: 50px;
    border: 1px solid purple;
    height: 60px;
    position: relative;

}

.footer-logo {
    height: 100%;
    width: 100%;
}

.footer-btn {
    // width: 40px;
    height: 35px;
}

</style>