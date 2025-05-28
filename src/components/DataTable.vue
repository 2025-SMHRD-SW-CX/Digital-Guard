<template>
  <div class="data-table">
    <h2>{{ title }}</h2>
    <div class="grid-wrapper">
      <!-- 헤더 -->
      <div class="grid-row header" :style="{ gridTemplateColumns }">
        <div
          v-for="col in columns"
          :key="col"
          class="cell header-cell"
        >
          {{ headerLabels[col] ?? col }}
        </div>
      </div>
      <!-- 데이터 행 -->
      <div
        v-for="row in rows"
        :key="row[idKey]"
        class="grid-row"
        :style="{ gridTemplateColumns }"
      >
        <div
          v-for="col in columns"
          :key="col"
          class="cell"
        >
          <!-- 링크 컬럼 -->
          <template v-if="col === linkKey">
            <a :href="row[col]" target="_blank">보기</a>
          </template>
          <!-- 상태 컬럼 -->
          <template v-else-if="col === statusKey">
            <span :class="['status', row[col]]">{{ row[col] }}</span>
          </template>
          <!-- 그 외 일반 텍스트 -->
          <template v-else>
            {{ row[col] }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  rows: { type: Array, required: true },
  linkKey: { type: String, default: 'link' },
  statusKey: { type: String, default: 'status' },
  idKey: { type: String, default: 'id' },
  headerLabels: { type: Object, default: () => ({}) }
})

// 칼럼 목록은 첫 번째 객체의 키들
const columns = computed(() => (props.rows.length ? Object.keys(props.rows[0]) : []))

// √n 알고리즘으로 grid 칼럼 수 계산
const totalCols = computed(() => columns.value.length)
const rowCount = computed(() => Math.floor(Math.sqrt(totalCols.value)) || 1)
const colCount = computed(() => Math.ceil(totalCols.value / rowCount.value))
const gridTemplateColumns = computed(() => `repeat(${colCount.value}, 1fr)`)
</script>

<style scoped lang="scss">
.grid-wrapper { display: block; }
.grid-row { display: grid; align-items: center; }
.cell {
  padding: 0.5em 1em;
  border: 1px solid #dbeafe;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header-cell {
  background: #e9f1ff;
  font-weight: 600;
}
.status {
  display: inline-block;
  padding: 0.2em 0.6em;
  border-radius: 1em;
  font-size: 0.8em;
  white-space: nowrap;
}
.status.공개 { background: #d9f6e7; color: #18785c; }
.status.비공개 { background: #ffe2e2; color: #a95050; }
</style>
