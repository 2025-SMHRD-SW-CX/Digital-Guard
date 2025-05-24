<template>
    <div class="mypage">
        <!-- 프로필 -->
        <section class="profile">
            <div class="avatar">
                <img src="/images/mypage/knight-and-horse.png" alt="아바타 이미지" />
            </div>
            <p class="badge">5일 동안 열심히 활동해주신 성실맨</p>
            <p class="username">
                {{ username }}<span class="honorific"> 님</span>
            </p>
            <div class="points">
                <img src="/images/mypage/coins.png" alt="포인트 아이콘" class="coin-icon" />
                <span>나의 포인트</span>
                <strong>3,450P</strong>
            </div>
        </section>

        <!-- 아이콘 메뉴 -->
        <nav class="menu-icons">
            <div v-for="(item, index) in menuButtons" :key="index" class="icon-btn"
                :class="{ active: activeButtonIndex === index }" @click="activeButtonIndex = index"
                @mouseover="hoveredButtonIndex = index" @mouseleave="hoveredButtonIndex = null">
                <img :src="activeButtonIndex === index || hoveredButtonIndex === index
                        ? `/images/mypage/${item.name}-active.png`
                        : `/images/mypage/${item.name}.png`
                    " :alt="item.label + ' 아이콘'" class="icon-image" />
                <span>{{ item.label }}</span>
                <div v-if="index < menuButtons.length - 1" class="divider"></div>
            </div>
        </nav>

        <!-- 메뉴 리스트 -->
        <ul class="menu-list">
            <li v-for="(item, index) in menuItems" :key="index" class="menu-item" @mouseover="hoveredIndex = index"
                @mouseleave="hoveredIndex = null" :class="{ hovered: hoveredIndex === index }">
                {{ item }}
                <img class="arrow-icon" :src="hoveredIndex === index
                    ? '/images/mypage/angle-right-active.png'
                    : '/images/mypage/angle-right.png'" alt="화살표 아이콘" />
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'MyPage',
    data() {
        return {
            username: '홍길동',
            activeButtonIndex: 0,
            hoveredButtonIndex: null,
            menuButtons: [
                { label: '내 정보', name: 'person' },
                { label: '나의 활동', name: 'trophy' },
                { label: '사용내역', name: 'calculator' },
                { label: '문의하기', name: 'headphone' },
            ],
            menuItems: [
                '나의 찜 내역',
                '나의 주문 조회',
                '나의 반품 / 교환 내역',
                '공지사항',
                '자주 묻는 질문',
            ],
            hoveredIndex: null,
        };
    },
};
</script>

<style lang="scss" scoped>
:root {
    background: $color-primary;
}

.mypage {
    font-family: 'Noto Sans KR', sans-serif;
    background: #f9f9f9;
    padding-bottom: 40px;
    position: relative;
}

/* 프로필 */
.profile {
    background: $color-primary;
    color: white;
    text-align: center;
    padding: 24px 16px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
}

.avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto 12px;
    background-color: #96d4ef;
    border-radius: 50%;
    border: 4px solid white;
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.badge {
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    /* 얇은 흰색 반투명 선 */
}

.username {
    font-size: 1.5em;
    margin-top: 0;
    font-weight: bold;
}

.honorific {
    font-size: 0.8em;
    font-weight: normal;
}

.points {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    background: white;
    color: #333;
    padding: 4px 10px;
    margin: 12px auto 0;
    width: fit-content;
    border-radius: 12px;
    font-size: 14px;
}

.coin-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
}

/* 아이콘 메뉴 */
.menu-icons {
    display: flex;
    justify-content: space-between;
    background: #d8deff;
    /* 네모칸 배경색 */
    border-radius: 20px;
    padding: 12px 0;
    margin: 12px 16px;
    width: 100%;
    overflow: hidden;
}

.icon-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 13px;
    color: #2e2e2e;
    cursor: pointer;
    padding: 8px 0;
    position: relative;
    transition: color 0.3s;
}

.icon-btn .icon-image {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    transition: filter 0.3s;
}

/* 클릭(active) 또는 호버 시 텍스트 색상 강조 */
.icon-btn.active,
.icon-btn:hover {
    color: $color-primary;
}

/* 아이콘 사이 구분선 */
.divider {
    position: absolute;
    right: 0;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background-color: #ccc;
}

/* 메뉴 리스트 */
.menu-list {
    list-style: none;
    padding: 0;
    margin: 16px;
}

.menu-item {
    background: white;
    padding: 14px 16px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: color 0.3s;
    color: #2e2e2e;
}

.menu-item.hovered {
    color: $color-primary;
}

.arrow-icon {
    width: 16px;
    height: 16px;
}
</style>
