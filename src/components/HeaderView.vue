<template>
    <!-- 헤더 -->
    <div class="header-wrap">
        <img src="/images/brand.png" v-if="!header.title">
        <div class="title-indicator" v-else>
            <img @click="clickBackBtn" src="/images/prev_page.png">
            <p>{{ header.title }}</p>
        </div>

        <div class="indicator-wrap" v-if="header.show">
            <div id="user" class="key-icon-wrap">
                <div class="icon">
                    <img src="/images/user_icon.png">
                </div>
                <div class="value">
                    <p>홍길동</p>
                </div>
            </div>

            <div id="point" class="key-icon-wrap">
                <div class="icon">
                    <img src="/images/point_icon.png">
                </div>
                <div class="value">
                    <p>200</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHeaderStore, TITLE_MAP } from '@/stores/header'

const header = useHeaderStore()
const route = useRoute()
const router = useRouter()

const clickBackBtn = () => {
    const tokens = route.path.split('/').filter(Boolean);
    if (tokens.length === 1) {
        router.push('/mainView');
    } else {
        router.back();
    }
}


function getFirstPathToken() {
    const tokens = route.path.split('/').filter(Boolean)
    return tokens[0] ?? ''
}

watch(
    () => route.path,
    () => {
        const token = getFirstPathToken()
        if (!(token in TITLE_MAP)) {
            // 1. 매핑 안됨 → 숨김
            header.setShow(false)
            header.setTitle(null)
        } else if (TITLE_MAP[token] === '') {
            // 2. 빈 문자열 → 보이긴 하되 브랜드이미지 (title = null)
            header.setShow(true)
            header.setTitle(null)
        } else {
            // 3. 타이틀 있음 → 보이고 타이틀 표시
            header.setShow(true)
            header.setTitle(TITLE_MAP[token])
        }
    },
    { immediate: true }
)

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