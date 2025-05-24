<template>

    <div class="wrapper">
        <div class="content-area">

        </div>
        <div class="bottom-bar">
            <div class="container">
                <div class="heart-wrapper">

                </div>
                <button id="buy-btn">구매하기</button>
            </div>
        </div>
    </div>

</template>

<script setup>
import { useRoute } from 'vue-router'
import { ITEMS } from '@/stores/shop'

const route = useRoute()
// id는 숫자로 들어올 수도, 문자로 들어올 수도 있음
const itemId = Number(route.params.id)
const item = ITEMS.find(i => i.id === itemId)

</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .content-area {
        border: 1px solid blue;
        flex-grow: 1;
        overflow: auto;
    }

    .bottom-bar {
        height: 5.5rem;
        position: relative;

        .container {
            border: 1px solid #bbb;
            position: absolute;
            left: -1rem;
            bottom: -1rem;
            width: 100vw;
            height: 100%;
            padding: 1rem;
            display: flex;
            gap: 0.25rem;

            .heart-wrapper {
                border: 1px solid red;
                width: 5rem;
            }

            #buy-btn {
                flex-grow: 1;
                background-color: $color-primary;
                color: white;
                height: 100%;
                width: 75%;
                border-radius: 0.25rem;
                font-weight: bold;
                font-size: 1.1rem;
            }
        }
    }
}
</style>