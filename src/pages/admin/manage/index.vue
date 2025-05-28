<template>
  <div class="admin-page">
    <h2>서비스 관리<span><small class="its-dummy">시연을 위한 더미데이터임을 알립니다</small></span></h2>
    <div style="margin-bottom:1rem">
      <select v-model="tableType" style="padding: 0.5em 1.2em; border-radius: 0.4em;">
        <option value="videos">교육영상</option>
        <option value="quizzes">퀴즈</option>
        <option value="survey">설문</option>
        <option value="user">사용자</option>
        <option value="point-transaction">포인트 지급</option>
      </select>
      <button v-if="tableType === 'videos'" class="add-btn" @click="openAddModal">+ 새 교육영상 추가</button>
    </div>

    <!-- Grid Wrapper -->
    <div class="grid-wrapper">
      <!-- Header Row -->
      <div class="grid-row header" :style="{ gridTemplateColumns }">
        <div v-for="col in columns" :key="col" class="cell header-cell">
          {{ col === 'actions' ? '작업' : headerLabels[col] || col }}
        </div>
      </div>

      <!-- Data Rows -->
      <div class="grid-row" v-for="row in displayList" :key="row[idKey]" :style="{ gridTemplateColumns }">
        <div v-for="col in columns" :key="col" class="cell">
          <!-- 링크 -->
          <template v-if="col === linkKey && tableType === 'videos'">
            <a :href="row[linkKey]" target="_blank">영상보기</a>
          </template>
          <template v-else-if="col === statusKey">
            <span :class="['status', row[statusKey]]">
              {{ row[statusKey] }}
            </span>
          </template>
          <template v-else-if="col === 'actions'">
            <div class="action-cell">
              <select v-model="pending[row[idKey]]" class="action-select">
                <option value="">작업 선택</option>
                <option value="edit" v-if="tableType === 'videos'">수정</option>
                <option value="delete">삭제</option>
                <option value="duplicate" v-if="tableType === 'videos'">복제</option>
                <option value="toggle" v-if="tableType === 'videos'">상태변경</option>
              </select>
              <button v-if="pending[row[idKey]]" class="queue-btn" @click="addToQueue(row[idKey], pending[row[idKey]])">
                + 큐 담기
              </button>
            </div>
          </template>
          <template v-else>
            {{ row[col] }}
          </template>
        </div>
      </div>
    </div>

    <!-- 큐(영상에만) -->
    <div class="queue-section" v-if="queue.length && tableType === 'videos'">
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

    <!-- 추가/수정 모달 (영상만) -->
    <div class="modal-bg" v-if="showModal && tableType === 'videos'">
      <div class="modal">
        <h4>교육영상 {{ editTarget ? '수정' : '추가' }}</h4>
        <input v-model="modalData.title" placeholder="제목" />
        <input v-model="modalData.category" placeholder="카테고리" />
        <input v-model="modalData.link" placeholder="링크(URL)" />
        <button @click="saveVideo">
          {{ editTarget ? '수정' : '추가' }}
        </button>
        <button class="close-btn" @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { videoData } from '@/data/videoData'
import { quizData } from '@/data/quizData'
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();

// 선택 테이블
const tableType = ref('videos')

watch(tableType, (newVal, oldVal) => {
  console.log(newVal)
  if (!['videos', 'quizzes'].includes(newVal)) {
    alertStore.notImplemented();
  }
})

// 테이블별 데이터
const tableMap = {
  videos: {
    data: reactive([...videoData]),
    idKey: 'id',
    linkKey: 'link',
    statusKey: 'status',
    headerLabels: {
      id: '번호', title: '제목', category: '카테고리', link: '링크', createdAt: '등록일', status: '상태'
    }
  },
  quizzes: {
    data: reactive([...quizData]),
    idKey: 'id',
    linkKey: null, // 없음
    statusKey: 'status',
    headerLabels: {
      id: '번호', question: '문제', optionsText: '보기', answer: '정답', createdAt: '등록일', status: '상태'
    }
  }
}

// 현재 선택된 테이블 데이터와 키/헤더 매핑
const currentTable = computed(() => tableMap[tableType.value])
const displayList = computed(() => currentTable.value.data)
const idKey = computed(() => currentTable.value.idKey)
const linkKey = computed(() => currentTable.value.linkKey)
const statusKey = computed(() => currentTable.value.statusKey)
const headerLabels = computed(() => currentTable.value.headerLabels)

// 동적 컬럼 + 작업
const dataFields = computed(() =>
  displayList.value.length ? Object.keys(displayList.value[0]) : []
)
const columns = computed(() => [...dataFields.value, 'actions'])

// 그리드 동적
const totalCols = computed(() => columns.value.length)
const rowCount = computed(() => Math.floor(Math.sqrt(totalCols.value)) || 1)
const colCount = computed(() => Math.ceil(totalCols.value / rowCount.value))
const gridTemplateColumns = computed(
  () => `repeat(${colCount.value}, 1fr)`
)

// 큐 등 부가 기능은 video에서만 동작하도록 해도 됨
const pending = reactive({})
const queue = ref([])

// 모달 (추가/수정)
const showModal = ref(false)
const editTarget = ref(null)
const modalData = reactive({ title: '', category: '', link: '' })

function addToQueue(rowId, type) {
  const row = displayList.value.find(v => v[idKey.value] === rowId)
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
      prevStatus: row[statusKey.value]
    })
  }
  else {
    queue.value.push({ rowId, type })
  }
  pending[rowId] = ''
}

function removeFromQueue(i) {
  queue.value.splice(i, 1)
}
function applyQueue() {
  queue.value.forEach(a => {
    const row = displayList.value.find(v => v[idKey.value] === a.rowId)
    if (!row) return
    if (a.type === 'delete') {
      const idx = displayList.value.findIndex(v => v[idKey.value] === a.rowId)
      if (idx !== -1) displayList.value.splice(idx, 1)
    }
    else if (a.type === 'edit') {
      row.title = a.newTitle
    }
    else if (a.type === 'duplicate') {
      const nid = Math.max(...displayList.value.map(v => v[idKey.value])) + 1
      displayList.value.push({
        ...row,
        [idKey.value]: nid,
        title: row.title + ' (복제)',
        createdAt: new Date().toISOString().slice(0, 10)
      })
    }
    else if (a.type === 'toggle') {
      row[statusKey.value] = row[statusKey.value] === '공개' ? '비공개' : '공개'
    }
  })
  queue.value = []
}

// 모달
function openAddModal() {
  editTarget.value = null
  modalData.title = ''
  modalData.category = ''
  modalData.link = ''
  showModal.value = true
}
function saveVideo() {
  if (tableType.value !== 'videos') {
    showModal.value = false
    return
  }
  if (editTarget.value != null) {
    const row = displayList.value.find(v => v[idKey.value] === editTarget.value)
    if (row) {
      row.title = modalData.title
      row.category = modalData.category
      row[linkKey.value] = modalData.link
    }
  } else {
    const nid = Math.max(...displayList.value.map(v => v[idKey.value])) + 1
    displayList.value.push({
      id: nid,
      title: modalData.title,
      category: modalData.category,
      [linkKey.value]: modalData.link,
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
  padding: 1.2rem 1.5rem;
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
  // padding: 0.6em 1.4em;
  padding: 0.25rem 0.8rem;
  border-radius: 0.6em;
  font-weight: 500;
  margin-bottom: 1rem;
  margin-left: 1rem;
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
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  padding: 1.8em 1.6em;
  border-radius: 0.8em;
  min-width: 320px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
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
  &.header {}

  &:not(.header) {}
}

.its-dummy {
  font-size: 0.7rem;
  font-weight: 400;
  color: rgb(165, 165, 165);
  margin-left: 1rem;
}

h2 {
  border-bottom: 1px solid $color-secondary;
  padding-bottom: 0.75rem;
}
</style>
