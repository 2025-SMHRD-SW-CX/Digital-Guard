<template>
  <div class="mypage">
    <!-- 프로필 -->
    <section class="profile">
      <div class="avatar">
        <img :src="`${BASE_URL}/images/mypage/knight-and-horse.png`" alt="아바타 이미지" />
      </div>
      <p class="badge">
        {{ userStore.continuousDays }}일 동안 열심히 활동해주신
        <span class="title-name" @click="openTitleModal">
          {{ currentTitle }}
          <img :src="`${BASE_URL}/images/mypage/pen-icon-white.png`" alt="수정 아이콘" class="edit-icon"
            @click.stop="openTitleModal" />
        </span>
      </p>

      <p class="username">
        <span>{{ userStore.nickname || userStore.name }}</span><span class="honorific"> 님</span>
      </p>
      <div class="points">
        <img :src="`${BASE_URL}/images/mypage/coins.png`" alt="포인트 아이콘" class="coin-icon" />
        <span>나의 포인트</span>
        <strong>{{ (+userStore.total_point).toLocaleString() }}P</strong>
      </div>
    </section>

    <!-- 아이콘 메뉴 -->
    <nav class="menu-icons">
      <div v-for="(item, index) in menuButtons" :key="index" class="icon-btn"
        :class="{ active: activeButtonIndex === index }" @click="handleIconButtonClick(index)"
        @mouseover="hoveredButtonIndex = index" @mouseleave="hoveredButtonIndex = null">
        <img :src="activeButtonIndex === index || hoveredButtonIndex === index
          ? `${BASE_URL}/images/mypage/${item.name}-active.png`
          : `${BASE_URL}/images/mypage/${item.name}.png`
          " :alt="item.label + ' 아이콘'" class="icon-image" />
        <span>{{ item.label }}</span>
        <div v-if="index < menuButtons.length - 1" class="divider"></div>
      </div>
    </nav>

    <!-- 메뉴 리스트 -->
    <ul class="menu-list">
      <li v-for="(item, index) in menuItems" :key="index" class="menu-item" @mouseover="hoveredIndex = index"
        @mouseleave="hoveredIndex = null" @click="handleMenuClick(index)" :class="{ hovered: hoveredIndex === index }">
        {{ item }}
        <img class="arrow-icon" :src="hoveredIndex === index
          ? `${BASE_URL}/images/mypage/angle-right-active.png`
          : `${BASE_URL}/images/mypage/angle-right.png`
          " alt="화살표 아이콘" />
      </li>
    </ul>

    <!-- 칭호 모달 -->
    <div v-if="isTitleModalOpen" class="modal-overlay" @click.self="closeTitleModal">
      <div class="modal-content">
        <h2>칭호 선택</h2>
        <ul class="title-list">
          <li v-for="(title, idx) in titles" :key="title.name" :class="{
            disabled: userStore.continuousDays < title.requiredDays,
            selected: selectedTitleIndex === idx
          }" @click="selectTitle(idx)">
            <strong>{{ title.name }}</strong>
          </li>
        </ul>
        <div v-if="selectedTitleIndex !== null" class="confirm-box">
          <p>
            <strong>“{{ titles[selectedTitleIndex].name }}”</strong> 칭호<br />
            {{ titles[selectedTitleIndex].description }}
          </p>
          <button @click="applyTitle">적용</button>
          <button @click="closeTitleModal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
import { ref } from 'vue'
import { useUserStore } from '@/stores/user';
import { useAlertStore } from '@/stores/alert';
import { useRouter } from 'vue-router';
import { runCheat } from '@/services/cheatService';
import { useSurveyStore } from "@/stores/survey";

const userStore = useUserStore();
const alertStore = useAlertStore();
const surveyStore = useSurveyStore();
const router = useRouter();

const activeButtonIndex = ref(null);
const hoveredButtonIndex = ref(null);
const hoveredIndex = ref(null);

const currentTitle = ref("새내기"); // 초기 칭호

const menuButtons = [
  { label: "내 정보", name: "person" },
  { label: "나의 활동", name: "trophy" },
  { label: "사용내역", name: "calculator" },
  { label: "문의하기", name: "headphone" },
];

function handleIconButtonClick(index) {
  activeButtonIndex.value = index;

  const selected = menuButtons[index];

  switch (selected.label) {
    case "내 정보":
      router.push('/mypage/myinformation');
      break;
    // case "나의 활동":
    // alertStore.notImplemented();
    // router.push("/myactivity");
    // break;
    // case "사용내역":
    // alertStore.notImplemented();
    // router.push("/myusage");
    // break;
    // case "문의하기":
    // alertStore.notImplemented();
    // router.push("/contact");
    // break;
    default:
      alertStore.notImplemented();
  }
}

const menuItems = [
  "시연용 치트 활성화",
  "나의 찜 내역",
  "나의 주문 조회",
  "나의 반품 / 교환 내역",
  "공지사항",
  "자주 묻는 질문",
  "로그아웃",
];

// 칭호 데이터
const titles = [
  { name: "새내기", description: "디지털 가드에 첫 걸음을 내딛으셨습니다!", requiredDays: 0 },
  { name: "노력가", description: "3일 동안 열심히 활동해 주셨습니다!", requiredDays: 3 },
  { name: "성실맨", description: "5일 동안 열심히 활동해 주셨습니다!", requiredDays: 5 },
  { name: "정복자", description: "7일 동안 열심히 활동해 주셨습니다!", requiredDays: 7 },
];

const isTitleModalOpen = ref(false);
const selectedTitleIndex = ref(null);

function openTitleModal() {
  isTitleModalOpen.value = true;
  selectedTitleIndex.value = null;
}

function closeTitleModal() {
  isTitleModalOpen.value = false;
  selectedTitleIndex.value = null;
}

function selectTitle(idx) {
  if (userStore.continuousDays < titles[idx].requiredDays) return;
  selectedTitleIndex.value = idx;
}

function applyTitle() {
  if (selectedTitleIndex.value === null) return;

  const chosenTitle = titles[selectedTitleIndex.value];
  currentTitle.value = chosenTitle.name; // 칭호 적용

  alertStore.success(`"${chosenTitle.name}" 칭호가 적용되었습니다!`, 2000);
  closeTitleModal();
}

// 로그아웃 메서드
function logout() {
  userStore.logout();
  alertStore.warning("로그아웃 되었습니다!", 2000);
  router.replace("/login");
}

function handleMenuClick(index) {
  if (menuItems[index] === "로그아웃") {
    logout();
  } else if (menuItems[index] === "나의 찜 내역") {
    router.push("shop/wishlist");
  } else if (menuItems[index] === "나의 주문 조회") {
    router.push("/shop/OrderLog")
  }

  else if (menuItems[index] === "시연용 치트 활성화") {
    runCheat({ userId: userStore.id, point: 5432, reason: '시연용 치트', continuousDays: 5 });
    userStore.setPoint(5432);
    userStore.progressDays = userStore.continuousDays = 5
    userStore.lastParticiPate = null;
    surveyStore.data.forEach((item, idx) => {
      if (idx != 0) item.lastComplete = null;
    })
    alertStore.success('시연용 치트가 실행되었습니다! 포인트와 진행일 수 초기화!', 3000);
  }
  else {
    alertStore.notImplemented();
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

.mypage {
  font-family: "Noto Sans KR", sans-serif;
  background: #f9f9f9;
  padding: 0 4vw 40px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

/* 프로필 */
.profile {
  background: $color-primary;
  color: white;
  text-align: center;
  padding: 24px 4vw 80px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  position: relative;
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
  font-size: 1rem;
  text-align: center;
}

.username {
  font-size: 1.5em;
  margin-top: 0;
  font-weight: bold;
  display: inline-flex;
  align-items: flex-end;
  gap: 4px;
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
  padding: 4px 15px;
  margin: 12px auto 0;
  width: fit-content;
  border-radius: 15px;
  font-size: 14px;
}

.coin-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

/* 아이콘 메뉴 */
.menu-icons {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  background: #d8deff;
  border-radius: 20px;
  padding: 12px 0;
  margin-top: -55px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  width: calc(100% - 15vw);
  z-index: 10;
}

.icon-btn {
  flex: 1 1 0;
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

.icon-btn span {
  font-size: 0.9rem;
}

.icon-btn .icon-image {
  width: 2rem;
  height: 2rem;
  margin-bottom: 4px;
  transition: filter 0.3s;
}

.icon-btn.active,
.icon-btn:hover {
  color: $color-primary;
}

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
  margin: 4.5rem 0 16px;
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

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 90%;
}

.title-list {
  list-style: none;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.title-list li {
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.3s, border-color 0.3s;
}

.title-list li:hover {
  background-color: #eef3ff;
  border-color: $color-primary;
}

.title-list li.disabled {
  cursor: not-allowed;
  color: #aaa;
  background-color: #f5f5f5;
}

.title-list li.selected {
  background-color: $color-primary;
  color: white;
  font-weight: bold;
}

.title-name {
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  .edit-icon {
    width: 16px;
    height: 16px;
    margin-left: 6px;
    cursor: pointer;
  }
}

.confirm-box {
  border-top: 1px solid #ddd;
  padding-top: 15px;
  text-align: center;
}

.confirm-box p {
  margin-bottom: 12px;
}

.confirm-box button {
  background-color: $color-primary;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 25px;
  cursor: pointer;
  margin: 0 10px;
  transition: background-color 0.3s;
}

.confirm-box button:hover {
  background-color: color.scale($color-primary, $lightness: -10%);
}
</style>