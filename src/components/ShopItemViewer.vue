<template>

    <div class="wrapper">
        <div class="content-area">
            <CardView :style="{ padding: 0, overflow: 'hidden' }">

                <div class="thumbnail">
                    <img :src="thumbnailPath">
                </div>

                <div class="desc">

                    <div class="title-area">
                        <p id="item-name">{{ name }}</p>
                        <img id="brand-img" :src="brandPath" v-if="brandPath">
                    </div>
                    <div class="price-area">
                        <p id="offer">{{ toPointString(offerPrice) }}</p>
                        <p id="original" v-if="originalPrice"><del>{{ toPointString(originalPrice) }}</del>
                        </p>
                        <p id="discount" v-if="originalPrice">-{{ calculateDiscount(originalPrice,
                            offerPrice) }}%</p>
                    </div>
                    <div class="info-area">
                        <div v-if="isCoupon">
                            <p>📦 모바일 금액권</p>
                            <p>⏳ 유효 기간 90일</p>
                        </div>
                        <div v-else>
                            <p>📦 배송지 정보 필요</p>
                            <p>⏳ 주문창에서 배송정보 입력하세요</p>
                        </div>
                    </div>
                </div>
                <div ref="barAnchor"></div> <!-- ⬅️ 기준점 -->
                <div class="bottom-bar">
                    <div class="container">
                        <div class="heart-wrapper">
                            <div class="like-btn" @click="toggleLike">
                                <img :src="`/images/shop/icons/heart_icon${liked ? '_filled' : ''}.png`">
                                <p>+{{ likedCount }}</p>
                            </div>
                        </div>
                        <button id="buy-btn" @click="purchase">구매하기</button>
                    </div>
                </div>
                
                <slot></slot>

            </CardView>
        </div>

    </div>

</template>

<script setup>
const props = defineProps({
    id: { type: Number, require: true },
    likedCount: { type: Number, default: 0 }
})

import CardView from '@/components/CardView.vue';
import { ref, onMounted } from 'vue';
import { useShopStore, ITEMS } from '@/stores/shop';
import { useRouter } from 'vue-router';

const router = useRouter();
const shopStore = useShopStore();
const item = ITEMS.find(item => item.id === props.id)

const thumbnailPath = ref(item.image);
const name = ref(item.name);
const brandPath = ref(item.brandImage);
const offerPrice = ref(item.price);
const originalPrice = ref(item.originalPrice);
const isCoupon = ref(item.isCoupon);
const liked = ref(item.liked);
const likedCount = ref(props.likedCount);

onMounted(() => {
    liked.value = shopStore.wish.some(i => i.id === props.id)
})

function toPointString(num) {
    return num.toLocaleString('ko-KR') + 'P'
}

const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
}

function toggleLike() {
    const isWished = shopStore.wish.some(i => i.id === props.id)

    if (isWished) {
        shopStore.wish = shopStore.wish.filter(i => i.id !== props.id)
        liked.value = false
        likedCount.value -= 1
        alert('찜이 해제되었습니다!')
    } else {
        shopStore.wish.push({ ...item, liked: liked.value })
        liked.value = true
        likedCount.value += 1
        alert('찜하셨습니다!')
    }
}

function purchase() {
    if (confirm('결제 페이지로 이동합니다. 진행하시겠습니까?')) {

        shopStore.orderItems = [item]
        router.push('/shop/OrderPage')
    }
}

</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .content-area {
        flex-grow: 1;
        overflow: visible;

        .thumbnail {
            width: 100%;
            
            img {
                object-fit: cover;
                width: 100%;
            }
        }

        .desc {
            padding: 1rem;

            .title-area {

                display: flex;
                align-items: center;
                justify-content: space-between;

                #brand-img {
                    height: 1.8rem;
                    max-width: 10rem;
                    object-fit: scale-down;
                }

                #item-name {
                    font-size: 1.2rem;
                    font-weight: 500;
                }
            }

            .price-area {
                display: flex;
                align-items: end;
                gap: 0.5rem;

                #offer {
                    font-size: 1.4rem;
                    font-weight: bold;
                }

                #original {
                    color: $color-dark-gray;
                }

                #discount {
                    font-size: 0.8rem;
                    background: #ffe4e1;
                    color: red;
                    border-radius: 0.25rem;
                    padding: 0.1rem 0.2rem;
                    font-weight: bold;
                }

            }

            .info-area {
                margin-top: 1rem;
                color: $color-dark-gray;
                font-size: 0.8rem;
            }
        }

    }

    .bottom-bar {
        height: 5.5rem;
        position: relative;
        margin: 1rem 0;

        .container {
            border: 1px solid #bbb;
            border-left: none;
            border-right: none;
            background-color: white;
            // width: 100vw;
            height: 5.5rem;
            padding: 1rem;
            display: flex;
            gap: 1rem;

            .heart-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;

                .like-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    padding: 0.25rem 0.5rem;

                    img {
                        object-fit: scale-down;
                        width: 1.5rem;
                    }

                    p {
                        font-size: 0.8rem;
                        position: relative;
                        bottom: 0.25rem;
                    }
                }

            }

            #buy-btn {
                flex-grow: 1;
                background-color: $color-primary;
                color: white;
                height: 100%;
                border-radius: 0.25rem;
                font-weight: bold;
                font-size: 1.1rem;
            }
        }
    }

    .hr {
        width: 100%;
        border-bottom: 1px solid $color-secondary;
        margin: 1rem 0;
    }
}
</style>