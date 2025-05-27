<template>
  <div class="admin-layout">
    <!-- 공통 Admin Header, Nav 등 배치 가능 -->
    <header>Admin Header or Nav</header>
    <main>
      <router-view /> <!-- admin 하위 페이지가 여기에 렌더링됨 -->
    </main>
  </div>
</template>

<script setup>import { BASE_URL } from "@/js/baseUrl";
// 필요하면 pinia, composable 등 import
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  // ... 기타 스타일
}
main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
