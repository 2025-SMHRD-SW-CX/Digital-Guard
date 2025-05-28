<template>
  <div class="admin-page">
    <h2>교육영상 관리</h2>
    <button class="add-btn" @click="openAddModal">+ 새 교육영상 추가</button>

    <!-- Grid Wrapper -->
    <div class="grid-wrapper">
      <!-- Header Row -->
      <div
        class="grid-row header"
        :style="{ gridTemplateColumns }"
      >
        <div
          v-for="col in columns"
          :key="col"
          class="cell header-cell"
        >
          {{ col === 'actions' ? '작업' : headerLabels[col] || col }}
        </div>
      </div>

      <!-- Data Rows -->
      <div
        class="grid-row"
        v-for="row in videoList"
        :key="row[idKey]"
        :style="{ gridTemplateColumns }"
      >
        <div v-for="col in columns" :key="col" class="cell">
          <!-- 링크 컬럼 링크로 -->
          <template v-if="col === linkKey">
            <a :href="row[linkKey]" target="_blank">영상보기</a>
          </template>
          <!-- 상태 컬럼 badge -->
          <template v-else-if="col === statusKey">
            <span :class="['status', row[statusKey]]">
              {{ row[statusKey] }}
            </span>
          </template>
          <!-- 작업 컬럼: select + 큐 담기 -->
          <template v-else-if="col === 'actions'">
            <div class="action-cell">
              <select
                v-model="pending[row[idKey]]"
                class="action-select"
              >
                <option value="">작업 선택</option>
                <option value="edit">수정</option>
                <option value="delete">삭제</option>
                <option value="duplicate">복제</option>
                <option value="toggle">상태변경</option>
              </select>
              <button
                v-if="pending[row[idKey]]"
                class="queue-btn"
                @click="addToQueue(row[idKey], pending[row[idKey]])"
              >
                + 큐 담기
              </button>
            </div>
          </template>
          <!-- 일반 컬럼 -->
          <template v-else>
            {{ row[col] }}
          </template>
        </div>
      </div>
    </div>

    <!-- 작업 큐 -->
    <div class="queue-section" v-if="queue.length">
      <h3>작업 큐 ({{ queue.length }})</h3>
      <ul>
        <li v-for="(action, i) in queue" :key="i">
          <span class="type">
            {{
              action.type === 'edit' ? '수정'
                : action.type === 'delete' ? '삭제'
                  : action.type === 'duplicate' ? '복제'
                    : action.type === 'toggle' ? '상태변경'
                      : action.type
            }}
          </span>
          <strong>#{{ action.rowId }}</strong>
          <template v-if="action.type === 'edit'">
            &nbsp;제목: "{{ action.prevTitle }}" → "{{ action.newTitle }}"
          </template>
          <template v-else-if="action.type === 'toggle'">
            &nbsp;상태: "{{ action.prevStatus }}" → "{{ action.prevStatus === '공개' ? '비공개' : '공개' }}"
          </template>
          <template v-else-if="action.type === 'duplicate'">
            &nbsp;현재 행 복제
          </template>
          <template v-else-if="action.type === 'delete'">
            &nbsp;현재 행 삭제
          </template>
          <button @click="removeFromQueue(i)">제거</button>
        </li>
      </ul>
      <button class="apply-btn" @click="applyQueue">일괄 적용</button>
    </div>

    <!-- 추가/수정 모달 -->
    <div class="modal-bg" v-if="showModal">
      <div class="modal">
        <h4>교육영상 {{ editTarget ? '수정' : '추가' }}</h4>
        <input v-model="modalData.title" placeholder="제목" />
        <input v-model="modalData.category" placeholder="카테고리" />
        <input v-model="modalData[linkKey]" placeholder="링크(URL)" />
        <button @click="saveVideo">
          {{ editTarget ? '수정' : '추가' }}
        </button>
        <button class="close-btn" @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// — 더미 데이터 —  
const videoList = reactive([
  { id: 1, title: 'AI와 미래사회', category: '기초', link: 'https://youtu.be/vid1', createdAt: '2024-05-10', status: '공개' },
  { id: 2, title: '디지털 성범죄 예방', category: '안전', link: 'https://youtu.be/vid2', createdAt: '2024-04-21', status: '비공개' },
  { id: 3, title: '사이버폭력 STOP', category: '예방', link: 'https://youtu.be/vid3', createdAt: '2024-05-13', status: '공개' },
  { id: 4, title: 'SNS 올바른 사용법', category: '기초', link: 'https://youtu.be/vid4', createdAt: '2024-05-18', status: '공개' },
  { id: 5, title: '개인정보 보호', category: '보안', link: 'https://youtu.be/vid5', createdAt: '2024-04-30', status: '비공개' },
  { id: 6, title: '딥페이크 구별법', category: '심화', link: 'https://youtu.be/vid6', createdAt: '2024-05-02', status: '공개' },
  { id: 7, title: '청소년 보호법', category: '법률', link: 'https://youtu.be/vid7', createdAt: '2024-05-11', status: '공개' },
  { id: 8, title: '불법촬영 대응법', category: '안전', link: 'https://youtu.be/vid8', createdAt: '2024-04-25', status: '비공개' },
  { id: 9, title: '디지털 리터러시', category: '기초', link: 'https://youtu.be/vid9', createdAt: '2024-05-09', status: '공개' },
  { id: 10, title: '피싱·사기 예방법', category: '보안', link: 'https://youtu.be/vid10', createdAt: '2024-04-12', status: '공개' }
])

// 키 설정
const idKey = 'id'
const linkKey = 'link'
const statusKey = 'status'

// 헤더 레이블 매핑(필요시 추가)
const headerLabels = {
  id: '번호',
  title: '제목',
  category: '카테고리',
  link: '링크',
  createdAt: '등록일',
  status: '상태'
}

// 동적 컬럼 목록 + 항상 마지막에 작업 컬럼
const dataFields = computed(() =>
  videoList.length ? Object.keys(videoList[0]) : []
)
const columns = computed(() => [...dataFields.value, 'actions'])

// 균형 있게 칼럼 수 계산 (√n × √n 알고리즘)
const totalCols = computed(() => columns.value.length)
const rowCount = computed(() => Math.floor(Math.sqrt(totalCols.value)) || 1)
const colCount = computed(() => Math.ceil(totalCols.value / rowCount.value))

// CSS grid-template-columns 값
const gridTemplateColumns = computed(
  () => `repeat(${colCount.value}, 1fr)`
)

// 작업 큐 상태
const pending = reactive({})
const queue = ref([])

// 모달 상태
const showModal = ref(false)
const editTarget = ref(null)
const modalData = reactive({ title: '', category: '', [linkKey]: '' })

// 큐 추가
function addToQueue(rowId, type) {
  const row = videoList.find(v => v[idKey] === rowId)
  if (!row) return
  if (type === 'edit') {
    const newTitle = prompt('새 제목을 입력하세요:', row.title)
    if (!newTitle) return
    queue.value.push({
      rowId,
      type,
      prevTitle: row.title,
      newTitle
    })
  }
  else if (type === 'toggle') {
    queue.value.push({
      rowId,
      type,
      prevStatus: row[statusKey]
    })
  }
  else {
    queue.value.push({ rowId, type })
  }
  pending[rowId] = ''
}

// 큐 제거
function removeFromQueue(i) {
  queue.value.splice(i, 1)
}

// 일괄 적용
function applyQueue() {
  queue.value.forEach(a => {
    const row = videoList.find(v => v[idKey] === a.rowId)
    if (!row) return
    if (a.type === 'delete') {
      const idx = videoList.findIndex(v => v[idKey] === a.rowId)
      if (idx !== -1) videoList.splice(idx, 1)
    }
    else if (a.type === 'edit') {
      row.title = a.newTitle
    }
    else if (a.type === 'duplicate') {
      const nid = Math.max(...videoList.map(v => v[idKey])) + 1
      videoList.push({
        ...row,
        [idKey]: nid,
        title: row.title + ' (복제)',
        createdAt: new Date().toISOString().slice(0, 10)
      })
    }
    else if (a.type === 'toggle') {
      row[statusKey] = row[statusKey] === '공개' ? '비공개' : '공개'
    }
  })
  queue.value = []
}

// 모달 열기/닫기/저장
function openAddModal() {
  editTarget.value = null
  modalData.title = ''
  modalData.category = ''
  modalData[linkKey] = ''
  showModal.value = true
}
function saveVideo() {
  if (editTarget.value != null) {
    const row = videoList.find(v => v[idKey] === editTarget.value)
    if (row) {
      row.title = modalData.title
      row.category = modalData.category
      row[linkKey] = modalData[linkKey]
    }
  } else {
    const nid = Math.max(...videoList.map(v => v[idKey])) + 1
    videoList.push({
      id: nid,
      title: modalData.title,
      category: modalData.category,
      [linkKey]: modalData[linkKey],
      createdAt: new Date().toISOString().slice(0, 10),
      status: '공개'
    })
  }
  showModal.value = false
}
function closeModal() {
  showModal.value = false
}
</script>

<style scoped lang="scss">
.admin-page {
  max-width: 960px;
  margin: auto;
  padding: 2rem 1rem;
  background: #f9fafc;
  border-radius: 12px;
}

h2 {
  margin-bottom: 1rem;
}

.add-btn {
  background: #3877e8;
  color: #fff;
  border: none;
  padding: 0.6em 1.4em;
  border-radius: 0.6em;
  font-weight: 500;
  margin-bottom: 1rem;
  cursor: pointer;
  &:hover {
    background: #2a3faa;
  }
}

.grid-wrapper {
  display: block;
}

.grid-row {
  display: grid;
  align-items: center;
}

.cell {
  padding: 0.6em 1em;
  border: 1px solid #dbeafe;
  font-size: 1rem;
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
  padding: 0.2em 0.8em;
  border-radius: 1em;
  font-size: 0.85em;
  font-weight: 600;
  white-space: nowrap;
}

.status.공개 {
  background: #d9f6e7;
  color: #18785c;
}

.status.비공개 {
  background: #ffe2e2;
  color: #a95050;
}

.action-cell {
  display: flex;
  gap: 0.4em;
  align-items: center;
}

.action-select {
  padding: 0.3em 0.8em;
  border: 1.5px solid #3182ce;
  border-radius: 0.6em;
  background: #f4f7fa;
  cursor: pointer;
  outline: none;
  appearance: none;
}

.queue-btn {
  padding: 0.3em 0.9em;
  border: none;
  background: #3182ce;
  color: #fff;
  border-radius: 0.6em;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #274687;
  }
}

.queue-section {
  margin-top: 1.8rem;
  background: #f0f7ff;
  padding: 1rem;
  border-radius: 0.6em;
  ul {
    padding-left: 1.2em;
  }
  li {
    margin: 0.4em 0;
    font-size: 1rem;
    .type {
      font-weight: 600;
      color: #246;
      margin-right: 0.5em;
    }
    button {
      margin-left: 0.6em;
      background: #ddd;
      border: none;
      padding: 0.2em 0.8em;
      border-radius: 0.4em;
      cursor: pointer;
      &:hover {
        background: #ffb3b3;
      }
    }
  }
  .apply-btn {
    background: #3877e8;
    color: #fff;
    border: none;
    padding: 0.6em 1.4em;
    border-radius: 0.6em;
    font-weight: 500;
    cursor: pointer;
    &:hover {
      background: #2a3faa;
    }
  }
}

.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  padding: 1.8em 1.6em;
  border-radius: 0.8em;
  min-width: 320px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  input {
    border: 1.5px solid #bbb;
    border-radius: 0.6em;
    padding: 0.6em 1em;
    font-size: 1rem;
  }
  .close-btn {
    background: #eee;
    color: #333;
    border: none;
    padding: 0.6em 1.2em;
    border-radius: 0.5em;
    cursor: pointer;
    align-self: flex-end;
    font-weight: 600;
    &:hover {
      background: #ffb3b3;
    }
  }
}

/* 동적으로 계산된 gridTemplateColumns 적용 */
.grid-row {
  &.header { }
  &:not(.header) { }
}
</style>
