<!-- 컴포넌트의 예시입니다 -->

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>이 컴포넌트는 전역 CSS 변수와 유틸 클래스를 활용합니다.</p>

    <!-- 전역 유틸 클래스 .sr-only (스크린리더 전용 텍스트) -->
    <span class="sr-only">숨겨진 설명 텍스트</span>

    <!-- CSS 변수로 스타일링한 버튼 -->
    <button class="btn">클릭하세요</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const msg = ref('Hello, Vue 3 + Vite!')
</script>

<style scoped>
.hello {
  /* vars.css 에서 정의한 토큰 사용 */
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-base);
  padding: var(--space-lg);
  border-radius: var(--radius-md);

  /* 유틸 클래스도 조합 가능 */
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: center;
  text-align: center;
}

.hello h1 {
  color: var(--color-primary);
  margin-bottom: var(--space-sm);
}

.btn {
  /* CSS 변수로 버튼 스타일링 */
  background-color: var(--color-secondary);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.8;
}
</style>
