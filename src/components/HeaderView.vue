<template>
    <!-- 헤더 -->
    <div class="header-wrap">
        <img src="/images/brand.png" v-if="!header.title">
        <div class="title-indicator" v-else>
            <img @click="clickBackBtn" src="/images/prev_page.png">
            <p>{{ header.title }}</p>
        </div>

        <!-- TODO 나중에 로그인로직 구현하고나면 아래 주석 해제 -->
        <!-- <div class="indicator-wrap" v-if="header.show && user.isLogined()"> -->
        <div class="indicator-wrap" v-if="header.show">
            <div id="user" class="key-icon-wrap">
                <div class="icon">
                    <img src="/images/user_icon.png">
                </div>
                <div class="value">
                    <p>{{ user.nickname }}</p>
                </div>
            </div>

            <div id="point" class="key-icon-wrap">
                <div class="icon">
                    <img src="/images/point_icon.png">
                </div>
                <div class="value">
                    <p>{{ user.totalReward }}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHeaderStore, TITLE_MAP } from '@/stores/header'
import { useUserStore } from '@/stores/user'
import { usePathToken } from '@/composables/usePathToken'

const router = useRouter()
const header = useHeaderStore()
const user = useUserStore();
const { firstToken } = usePathToken()

const clickBackBtn = () => {
    const depth = router.currentRoute.value.path.split('/').filter(Boolean).length
    depth === 1 ? router.push('/main') : router.back()
}

watch(firstToken, (token) => {
    if (!(token in TITLE_MAP)) {
        header.setShow(false)
        header.setTitle(null)
    } else {
        header.setShow(true)
        header.setTitle(TITLE_MAP[token] || null)
    }
}, { immediate: true })
</script>



<style lang="scss" scoped>
.header-wrap {
    border-bottom: 1px solid $color-lightgrey;
    padding: 1rem 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    img {
        width: 10rem;
        object-fit: scale-down;
    }

    .title-indicator {
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 2.5rem;
            height: 3rem;
            object-fit: scale-down;
        }

        p {
            margin: 0;
            font-size: 1.5rem;
            position: relative;
            bottom: 0.1rem;
            font-weight: 350;
        }
    }
}

.indicator-wrap {
    // width: 5rem;
    height: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    // #user {
    //     // border: 1px solid blue;
    // }

    #point {
        gap: 7%;
    }

    .key-icon-wrap {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        gap: 5%;

        .icon {
            width: 2em;
            opacity: 0.9;
        }

        .value {
            flex-grow: 1;
            height: 100%;
            width: 100%;
            min-width: 4rem;

            p {
                font-size: 1.1em;
                margin: 0;
                font-weight: bold;
                position: relative;
                top: 2%;
                color: $color-text;
                text-align: end;
            }
        }

    }
}
</style>