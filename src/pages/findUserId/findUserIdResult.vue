<template>
  <div class="result-page">
    <!-- 결과 문장을 한 줄로 보여주는 부분 -->
    <p class="full-sentence">
      등록된 아이디는 <span class="user-id">{{ userId }}</span>입니다.
    </p>
  </div>
</template>

<script setup>
// vue-router에서 현재 페이지의 쿼리스트링(query parameter)을 가져옵니다.
import { useRoute } from 'vue-router'

// 현재 라우트 정보를 가져옵니다.
const route = useRoute()

// 쿼리스트링에서 전달된 id 값을 userId에 저장합니다.
const userId = route.query.id
</script>

<style scoped>
/* 결과 페이지 전체 스타일 */
.result-page {
  width: 100%;
  /* 화면 너비에 따라 늘어남 */
  /* max-width: 500px; */
  margin: 40px auto;
  padding: 30px 20px;
  border-radius: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
  background-color: #e0f0ff;
  color: #2563eb;
  /* padding 포함한 넓이 계산 */
  box-sizing: border-box;
  /* Flexbox로 정렬 */
  display: flex;
  /* 가로 중앙 */
  justify-content: center;
  /* 세로 중앙 */
  align-items: center;
  /* 내부 텍스트 가로 가운데 정렬 */
  text-align: center;


}

/* 한 줄 문장 전체 스타일 */
.full-sentence {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.6;
}

/* 아이디 부분만 강조한 스타일 */
.user-id {
  font-weight: 700;
  /* 굵게 */
  font-size: 1.8rem;
  /* 크게 */
  margin: 0 4px;
  /* 좌우 여백 */
  color: #283A97;
  /* 진한 파란색 */
  letter-spacing: 1px;
  /* 글자 간격 */
  user-select: all;
  /* 복사 쉽게 가능하도록 */
}
</style>
