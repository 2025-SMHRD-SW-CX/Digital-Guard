<template>

    <div class="wrapper">
        <div class="header-wrap">
            <img class="brand" :src="`${BASE_URL}/images/brand.png`">
            <div class="admin-indicator">
                <div class="icon-value">
                    <img class="icon" :src="`${BASE_URL}/images/header/user_icon.png`">
                    <p class="value">김철수 님</p>
                </div>
                <button class="logout-btn">로그아웃</button>
            </div>
        </div>
        <!-- <div class="content">
            <div class="side-bar">

            </div>
            <div class="main">
              <router-view />
            </div>
        </div> -->
        <div class="footer-wrap">
                <p class="app-name"><b>디지털 가드</b>&nbsp&nbsp-&nbsp&nbspProd by Team.코드하모니, 김주현, 나상록, 오인경, 윤지우</p>
                <p class="camp-name">2025.03.14 고객경험데이터를 활용한 데이터 비즈니스 분석가과정</p>
        </div>

    </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { BASE_URL } from "@/js/baseUrl";

</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

// .header-wrap {
//     width: 100%;
//     padding: 1rem;
//     border-bottom: 1px solid $color-secondary;
//     background-color: white;
//     display: flex;
//     justify-content: space-between;

//     .brand {
//         object-fit: scale-down;
//         width: 10rem;
//     }

//     .admin-indicator {
//         display: flex;
//         gap: 0.5rem;

//         .icon-value {
//             display: flex;
//             gap: 0.5rem;
//             padding: 0.5rem;

//             .icon {
//                 object-fit: scale-down;
//                 width: 1.5rem;
//             }

//         }

//         .logout-btn {
//             @extend .btn, .btn-primary, .btn-small
//         }
//     }
// }

.content {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    background-color: greenyellow;
    display: flex;

    .side-bar {
        width: 10rem;
        background-color: blue;
    }

    .main {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        background-color: purple;
    }
}

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