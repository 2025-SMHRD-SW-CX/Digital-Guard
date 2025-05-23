<template>
    <div class="shop-main">
        <!-- 헤더 -->
        <header class="top-bar">
            <span class="logo">Digital Guard</span>
            <input v-model="searchQuery" class="search-bar" placeholder="검색어를 입력하세요..." />
            <span class="icon">🛒</span>
            <span class="menu">☰</span>
        </header>

        <!-- 카테고리 탭 -->
        <nav class="tab-bar">
            <ul>
                <li v-for="tab in tabs" :key="tab" :class="{ active: tab === '랭킹' }">{{ tab }}</li>
            </ul>
        </nav>

        
        <!-- 정렬 버튼 및 드롭다운 -->
        <div class="sort-section" @click="toggleSortMenu">
            <span>{{ sortLabel }} ▼</span>

            <transition name="fade-slide">
                <ul v-if="showSortMenu" class="sort-menu">
                    <li @click.stop="setSort('default')">추천순</li>
                    <li @click.stop="setSort('low')">가격 낮은순</li>
                    <li @click.stop="setSort('high')">가격 높은순</li>
                </ul>
            </transition>
        </div>


        <!-- 상품 목록 -->
        <section class="product-list">
            <div v-for="item in filteredItems" :key="item.id" class="product-card">
                <img :src="item.image" class="product-image" />
                <div class="brand">{{ item.brand }}</div>
                <div class="name">{{ item.name }}</div>
                <div class="price-row">
                    <div class="price-info">
                        <span class="price">{{ item.price }}p</span>
                        <span class="discount" v-if="item.discount">-{{ item.discount }}%</span>
                    </div>
                    <div class="icons">
                        <button class="heart" @click="toggleLike(item)">
                            {{ item.liked ? '❤️' : '🤍' }}
                        </button>
                        <button class="cart" @click="addToCart(item)">🛒</button>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const searchQuery = ref('')
const showSortMenu = ref(false)
const sortType = ref('default')


function setSort(type) {
    sortType.value = type
    showSortMenu.value = false
}
function handleClickOutside(e) {
    const sortMenu = document.querySelector('.sort-section')
    if (sortMenu && !sortMenu.contains(e.target)) {
        showSortMenu.value = false
    }
}
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
const sortLabel = computed(() => {
    switch (sortType.value) {
        case 'low': return '가격 낮은순'
        case 'high': return '가격 높은순'
        default: return '추천순'
    }
})

function toggleSortMenu() {
    showSortMenu.value = !showSortMenu.value
}

const items = ref([
    {
        id: 1,
        image: '/images/올리브영.png',
        brand: '올리브영',
        name: '기프티콘 2만원권',
        price: 18000,
        discount: 10,
        liked: true,
        
    },
    {
        id: 2,
        image: '/images/메가커피.webp',
        brand: '메가커피',
        name: '기프티콘 5천원권',
        price: 4500,
        discount: 10,
        liked: false
    },
    {
        id: 3,
        image: '/images/컴포즈 커피.webp',
        brand: '컴포즈커피',
        name: '기프티콘 5천원권',
        price: 4500,
        discount: 10,
        liked: false
    },
    {
        id: 4,
        image: '/images/맘스터치.webp',
        brand: '맘스터치',
        name: '싸이버거 세트',
        price: 7300,
        discount: 10,
        liked: false
    },
    {
        id: 5,
        image: '/images/배달의 민족.webp',
        brand: '배달의민족',
        name: '기프티콘 2만원권',
        price: 18000,
        discount: 10,
        liked: false
    },
    {
        id: 6,
        image: '/images/베라.png',
        brand: '베스킨라빈스',
        name: '파인트아이스크림',
        price: 8800,
        discount: 10,
        liked: false
    },
    {
        id: 7,
        image: '/images/설빙.webp',
        brand: '설빙',
        name: '인절미설빙',
        price: 8800,
        discount: 10,
        liked: false
    },
    {
        id: 8,
        image: '/images/신박한패션템.webp',
        brand: '신박한패션템',
        name: '미니카세트키링',
        price: 7100,
        discount: 10,
        liked: false
    },
    {
        id: 9,
        image: '/images/스벅아2카스테라.webp',
        brand: '스타벅스',
        name: '아메리카노2잔+생크림카스텔라',
        price: 12500,
        discount: 10,
        liked: false
    },
    {
        id: 10,
        image: '/images/메가리카노.webp',
        brand: '메가커피',
        name: '아이스아메리카노',
        price: 1800,
        discount: 10,
        liked: false
    }
    

])

const filteredItems = computed(() => {
    let result = items.value.filter(item =>
        item.brand.includes(searchQuery.value) || item.name.includes(searchQuery.value)
    )

    if (sortType.value === 'low') {
        result = result.sort((a, b) => a.price - b.price)
    } else if (sortType.value === 'high') {
        result = result.sort((a, b) => b.price - a.price)
    }

    return result
})

function toggleLike(item) {
    item.liked = !item.liked
}

function addToCart(item) {
    alert(`${item.name} 장바구니에 담겼습니다!`)
}
</script>

<style scoped>
.shop-main {
    width: 100%;
    max-width: 403px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
}

.top-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
}

.search-bar {
    flex: 1;
    height: 28px;
    background: #eee;
    border-radius: 8px;
    border: none;
    padding: 0 10px;
    font-size: 14px;
}

.icon,
.menu {
    font-size: 18px;
    cursor: pointer;
}

.logo {
    font-family: 'Georgia', serif;
    color: #1e3a8a;
    font-size: 16px;
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
    text-align: right;
    padding: 8px 12px;
    font-size: 13px;
    color: #444;
}

.product-list {
    padding: 0 12px 40px;
}

.product-card {
    margin-bottom: 24px;
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
    font-size: 12px;
    background: #ffe4e1;
    color: red;
    border-radius: 4px;
    padding: 2px 4px;
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
    align-items: center;
    gap: 6px;
}

.icons {
    display: flex;
    align-items: center;
    gap: 8px;
}

.sort-menu {
    position: absolute;
    top: 100%;
    /* 버튼 아래로 */
    right: 0;
    /* 오른쪽에 붙이기 */
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px 0;
    font-size: 13px;
    list-style: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    min-width: 120px;
}


.sort-menu li {
    padding: 8px 12px;
    cursor: pointer;
}

.sort-menu li:hover {
    background-color: #f5f5f5;
}

.sort-section {
    position: relative;
    text-align: right;
    padding: 8px 12px;
    font-size: 13px;
    color: #444;
    user-select: none;
    cursor: pointer;
}

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