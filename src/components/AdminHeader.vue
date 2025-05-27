<template>
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
</template>


<script setup>
import { BASE_URL } from '@/js/baseUrl';
</script>

<style lang="scss" scoped>
.header-wrap {
    width: 100%;
    padding: 1rem;
    border-bottom: 1px solid $color-secondary;
    background-color: white;
    display: flex;
    justify-content: space-between;

    .brand {
        object-fit: scale-down;
        width: 10rem;
    }

    .admin-indicator {
        display: flex;
        gap: 0.5rem;

        .icon-value {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem;

            .icon {
                object-fit: scale-down;
                width: 1.5rem;
            }

        }

        .logout-btn {
            @extend .btn, .btn-primary, .btn-small
        }
    }
}
</style>