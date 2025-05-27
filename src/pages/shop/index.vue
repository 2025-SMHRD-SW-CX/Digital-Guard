<template>
    <div class="shop-main">
        <!-- 헤더 -->
        <div class="top-bar">

            <div class="search-container">
                <input v-model="searchQuery" class="search-bar" placeholder="검색어를 입력하세요" />
                <img class="search-icon" :src="`${BASE_URL}/images/shop/icons/search_icon.png`">
            </div>

            <div class="top-bar-icons">
                <img :src="`${BASE_URL}/images/shop/icons/bags_icon.png`" @click.stop="goToCart">
                <img :src="`${BASE_URL}/images/shop/icons/heart_icon_filled.png`" @click.stop="goToWishlist">
            </div>
        </div>

        <div class="sort-section">
            <span @click="toggleSortMenu">▼ {{ sortLabel }}</span>
            <transition name="fade-slide">
                <ul v-if="showSortMenu" class="sort-menu">
                    <li @click.stop="setSort('default')">추천순</li>
                    <li @click.stop="setSort('low')">가격 낮은순</li>
                    <li @click.stop="setSort('high')">가격 높은순</li>
                </ul>
            </transition>
        </div>

        <!-- 상품 목록 -->
        <div class="product-wrap">
            <section class="product-list">
                <CardView v-for="item in filteredItems" :key="item.id" class="product-card" @click="goToDetail(item)">
                    <img :src="item.image" class="product-image" />
                    <div class="brand">{{ item.brand }}</div>
                    <div class="name">{{ item.name }}</div>
                    <div class="price-row">
                        <div class="price-info">
                            <span class="price">{{ item.price.toLocaleString() }}P</span>
                            <span class="original-price" v-if="item.originalPrice">
                                {{ item.originalPrice.toLocaleString() }}
                            </span>
                            <span class="discount" v-if="item.originalPrice">
                                -{{ calculateDiscount(item.originalPrice, item.price) }}%
                            </span>
                        </div>
                        <div class="icons">
                            <img :src="`${BASE_URL}/images/shop/icons/heart_icon${item.liked ? '_filled' : ''}.png`"
                                @click.stop="toggleLike(item)">
                            <img id="cart" :src="`${BASE_URL}/images/shop/icons/cart_icon.png`" @click.stop="addToCart(item)">
                        </div>
                    </div>
                </CardView>

            </section>
        </div>

    </div>
</template>

<<<<<<< Updated upstream
<script setup>
import { BASE_URL } from "@/js/baseUrl"
=======
<script setup>import { BASE_URL } from "@/js/baseUrl";

>>>>>>> Stashed changes
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ITEMS, useShopStore } from '@/stores/shop';
import { useAlertStore } from '@/stores/alert';
import { useUserStore } from '@/stores/user';
import { db } from '@/services/supabase';
import { v4 as uuidv4 } from 'uuid';
import CardView from '@/components/CardView.vue';

const shopStore = useShopStore();
const alertStore = useAlertStore();
const userStore = useUserStore();
const router = useRouter();

const searchQuery = ref('');
const showSortMenu = ref(false);
const sortType = ref('default');

function calculateDiscount(original, current) {
    return Math.round(((original - current) / original) * 100);
}

function setSort(type) {
    sortType.value = type;
    showSortMenu.value = false;
}

function handleClickOutside(e) {
    const sortMenu = document.querySelector('.sort-section');
    if (sortMenu && !sortMenu.contains(e.target)) {
        showSortMenu.value = false;
    }
}

function goToDetail(item) {
    if (item.route) {
        router.push(`/shop/view/${item.route}`);
    } else {
        alertStore.danger(`[${item.name}] 상품은 상세페이지가 준비되어 있지 않습니다!`, 3000);
    }
}

function toggleSortMenu() {
    showSortMenu.value = !showSortMenu.value;
}

function goToCart() {
    router.push('/shop/ShopCart');
}

function goToWishlist() {
    router.push('/shop/WishList');
}

const filteredItems = computed(() => {
    let result = ITEMS.map(item => {
        item.liked = shopStore.wish.some(w => w.id === item.id);
        return item;
    });
    if (sortType.value === 'low') result.sort((a, b) => a.price - b.price);
    else if (sortType.value === 'high') result.sort((a, b) => b.price - a.price);
    return result.filter(item =>
        item.brand.includes(searchQuery.value) || item.name.includes(searchQuery.value)
    );
});

async function toggleLike(item) {
    if (!userStore.id) return;

    item.liked = !item.liked;

    if (item.liked) {
        const { error } = await db.from('wishlist').insert({
            user_id: userStore.id,
            item_id: item.id
        });
        if (!error) {
            shopStore.wish.push(item);
            alertStore.success(`[${item.name}] 상품이 찜 되었습니다!`, 3000);
        } else {
            item.liked = false;
            console.error('찜 추가 실패', error);
            alertStore.danger('찜 추가 실패!', 3000);
        }
    } else {
        const { error } = await db.from('wishlist').delete().match({
            user_id: userStore.id,
            item_id: item.id
        });
        if (!error) {
            shopStore.wish = shopStore.wish.filter(i => i.id !== item.id);
            alertStore.warning(`[${item.name}] 상품이 찜 해제 되었습니다!`, 3000);
        } else {
            item.liked = true;
            console.error('찜 삭제 실패', error);
            alertStore.danger('찜 삭제 실패!', 3000);
        }
    }
}

async function addToCart(item) {
    if (!userStore.id) return;

    const exists = shopStore.cart.find(i => i.id === item.id);
    if (exists) {
        alertStore.danger(`[${item.name}] 상품은 이미 장바구니에 담겨 있습니다!`, 3000);
        return;
    }

    const { error } = await db.from('cart').insert({
    id: uuidv4(),
    user_id: userStore.id,
    item_id: item.id
  });
  if (!error) {
    shopStore.cart.push(item);
    alertStore.success(`[${item.name}] 상품이 장바구니에 담겼습니다!`, 3000);
  } else {
    console.error('장바구니 추가 실패', error);
    alertStore.danger('장바구니 추가 실패!', 3000);
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);

  await userStore.syncLoginCookieState();

  if (!userStore.id) return;

  const { data: wishList, error: wishError } = await db
    .from('wishlist')
    .select('item_id')
    .eq('user_id', userStore.id);

  const { data: cartList, error: cartError } = await db
    .from('cart')
    .select('item_id')
    .eq('user_id', userStore.id);

  if (!wishError && wishList) {
    const wishIds = wishList.map(w => Number(w.item_id));
    shopStore.wish = ITEMS.filter(item => wishIds.includes(item.id));
  }

  if (!cartError && cartList) {
    const cartIds = cartList.map(c => Number(c.item_id));
    shopStore.cart = ITEMS.filter(item => cartIds.includes(item.id));
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const sortLabel = computed(() => {
  switch (sortType.value) {
    case 'low': return '가격 낮은순';
    case 'high': return '가격 높은순';
    default: return '추천순';
  }
});
</script>








<style lang="scss" scoped>
.shop-main {
    width: 100%;
    margin: 0 auto;
}

.top-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;

    .top-bar-icons {
        width: 9rem;
        justify-content: end;
        display: flex;
        gap: 0.75rem;

        img {
            object-fit: scale-down;
            width: 2.5rem;
        }
    }
}

.search-bar {
    flex-grow: 1;
    height: 100%;
    width: 100%;
    padding: 0 0.5rem 0 2.75rem;
    border: none;
    font-size: 1rem;
    height: 100%;
    outline: none;
}

.search-bar:focus {
    border-color: $color-primary;
}


.icon,
.menu {
    font-size: 18px;
    cursor: pointer;
}

.tab-bar ul {
    display: flex;
    justify-content: space-around;
    margin: 0;
    padding: 8px 0;
    list-style: none;
    font-size: 14px;
    border-bottom: 2px solid #ccc;
}

.tab-bar li {
    cursor: pointer;
    padding: 4px 8px;
}

.tab-bar .active {
    border-bottom: 2px solid black;
    font-weight: bold;
}

.sort-section {
    display: flex;
    justify-content: space-between;
    align-items: center;

    position: relative;
    text-align: right;
    padding: 8px 12px;
    color: #444;
    user-select: none;
    cursor: pointer;

    span {
        font-size: 0.95rem;
        line-height: 3rem;
        width: 8rem;
        text-align: left;
    }

}

.product-list {
    padding: 0 0 1rem 0;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.product-card {
    background-color: white;
    padding: 1.3rem !important;
    border-radius: 0.5rem;
    text-align: start;
}

.product-image {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 6px;
}

.brand {
    font-size: 15px;
    color: #444;
}

.name {
    font-size: 16px;
    font-weight: bold;
    margin: 2px 0;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* gap: 8px; */
    margin-top: 4px;
}

.price {
    font-weight: bold;
    font-size: 20px;
}

.discount {
    font-size: 0.8rem;
    background: #ffe4e1;
    color: red;
    border-radius: 0.25rem;
    padding: 0.1rem 0.2rem;
    font-weight: bold;
}

.heart,
.cart {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.price-info {
    display: flex;
    align-items: baseline;
    gap: 6px;
}

.original-price {
    font-size: 14px;
    text-decoration: line-through;
    color: #999;
}

.icons {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    img {
        width: 2rem;
        object-fit: scale-down;
        box-sizing: content-box;
        padding: 0.25rem;
    }

    #cart {
        height: 1.6rem;
        padding: 0.5rem 0.25rem;
    }
}

.sort-menu {
    position: absolute;
    top: 100%;
    /* 버튼 아래로 */
    left: 0;
    /* 오른쪽에 붙이기 */
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px 0;
    font-size: 0.9rem;
    list-style: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    min-width: 120px;
}

.search-container {
    // border: 1px solid red;
    background-color: white;

    width: 100%;
    position: relative;
    display: flex;
    height: 2.7rem;

    // background: white;
    border: 0.125rem solid $color-lightgrey;
    // border-radius: 0.75rem;
    // padding: 0 0.5rem;

    // img {
    //     opacity: 0.7;
    // }

    border-radius: 0.5rem;
    overflow: hidden;

    .search-icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        object-fit: scale-down;
        width: 1.5em;
        opacity: 0.5;
    }
}




.sort-menu li {
    padding: 8px 12px;
    text-align: start;
    cursor: pointer;
}

.sort-menu li:hover {
    background-color: #f5f5f5;
}

// .sort-section {
//     position: relative;
//     text-align: right;
//     padding: 8px 12px;
//     // font-size: 1rem;
//     color: #444;
//     user-select: none;
//     cursor: pointer;
// }

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>