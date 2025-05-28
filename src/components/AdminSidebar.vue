<template>
  <div class="side-bar" :class="{ collapsed: isCollapsed }" @mouseenter="expandSidebar" @mouseleave="collapseSidebar">
    <!-- 접힌 상태에서만 나타나는 세로 MENU -->
    <div class="collapsed-menu" v-if="isCollapsed">
      <span v-for="char in menuLabelArr" :key="char" class="menu-char">
        {{ char }}
      </span>
    </div>
    <div class="top-wrapper">
      <div class="menu-item" v-for="item in menuList" :key="item.label" @click="goMenu(item.route)">
        <span class="menu-text">{{ item.label }}</span>
        <div class="underline"></div>
      </div>
    </div>
    <div class="bottom-wrapper">
      <div></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const menuList = [
  { label: '대시보드', route: '/admin/main' },
  { label: '그래프', route: '/admin/graph' },
  { label: '서비스 관리', route: '/admin/manage' }
]

const isCollapsed = ref(true)
const menuLabel = 'MENU'
const menuLabelArr = menuLabel.split('')

function expandSidebar() { isCollapsed.value = false }
function collapseSidebar() { isCollapsed.value = true }

function goMenu(route) {
  router.push(route)
}

</script>

<style lang="scss" scoped>
.side-bar {
  width: 10rem;
  min-width: 10rem;
  background-color: $color-primary;
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;

  &.collapsed {
    width: 2.8rem;
    min-width: 2.8rem;

    .top-wrapper {
      .menu-item {
        .menu-text {
          opacity: 0;
          transform: translateX(30%);
          pointer-events: none;
          transition:
            opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
    }

    .collapsed-menu {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      transition:
        opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  // 펼쳐졌을 때 MENU는 사라진다
  &:not(.collapsed) {
    .collapsed-menu {
      opacity: 0;
      transform: translateY(20%);
      pointer-events: none;
      transition:
        opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .top-wrapper {
      .menu-item {
        .menu-text {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
          transition:
            opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
    }
  }
}

/* MENU 세로 레이아웃 */
.collapsed-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; // sidebar 전체 높이 맞춤
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 5;
  letter-spacing: 0.1em;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
  user-select: none;

  .menu-char {
    display: block;
    margin: 0.08em 0;
    opacity: 0.82;
    transition: color 0.2s, opacity 0.22s;
  }
}

.top-wrapper {
  color: white;
  font-weight: 500;
  margin-top: 1rem;
  padding: 0 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  z-index: 10; // MENU보다 위로 올 필요 없음

  .menu-item {
    cursor: pointer;
    padding: 0.25rem 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;

    .menu-text {
      z-index: 1;
      display: inline-block;
      white-space: nowrap;
      transition:
        opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }

    .underline {
      height: 2px;
      background: white;
      width: 0;
      transition: width 0.33s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 0.15rem;
      border-radius: 2px;
    }

    &:hover .underline {
      width: 100%;
    }
  }
}
</style>