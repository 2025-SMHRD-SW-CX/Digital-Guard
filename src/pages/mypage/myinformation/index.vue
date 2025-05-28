<template>
  <div v-if="userStore.id" class="container">
    <h2 class="title">내 정보</h2>
    <form @submit.prevent="updateProfile" class="form">
      <!-- 아이디 (변경 불가) -->
      <div>
        <label class="label" for="username">아이디</label>
        <input id="username" type="text" v-model="form.username" disabled class="form-static" />
      </div>

      <!-- 새 비밀번호 -->
      <div>
        <label class="label" for="password">새 비밀번호</label>
        <input id="password" type="password" v-model="form.password" class="form-input" autocomplete="new-password" />
      </div>

      <!-- 비밀번호 확인 -->
      <div>
        <label class="label" for="passwordConfirm">비밀번호 확인</label>
        <input id="passwordConfirm" type="password" v-model="form.passwordConfirm" class="form-input"
          autocomplete="new-password" />
      </div>

      <!-- 이름 (변경 불가) -->
      <div>
        <label class="label" for="name">이름</label>
        <input id="name" type="text" v-model="form.name" disabled class="form-static" />
      </div>

      <!-- 닉네임 (수정 가능) -->
      <div>
        <label class="label" for="nickname">닉네임</label>
        <input id="nickname" type="text" v-model="form.nickname" class="form-input" />
      </div>

      <!-- 생일 (변경 불가) -->
      <div>
        <label class="label" for="birth">생일</label>
        <input id="birth" type="date" v-model="form.birth" disabled class="form-static" />
      </div>

      <!-- 전화번호 (수정 가능) -->
      <div>
        <label class="label" for="phone">전화번호</label>
        <input id="phone" type="text" v-model="form.phone" class="form-input" />
      </div>

      <!-- 이메일 (수정 가능) -->
      <div>
        <label class="label" for="email">이메일</label>
        <input id="email" type="email" v-model="form.email" class="form-input" />
      </div>

      <!-- 소셜 플랫폼 연동 섹션 -->
      <div class="social-switch-section">
        <h3 class="switch-title">소셜 플랫폼 연동</h3>
        <div class="switch-grid">
          <!-- v-for로 플랫폼별 스위치 생성 -->
          <div class="switch-item" v-for="platform in platforms" :key="platform.name">
            <label class="switch-label">{{ platform.name }}</label>
            <label class="switch">
              <!-- 체크박스와 v-model 연동 + 변경 시 함수 호출 -->
              <input type="checkbox" v-model="platform.linked" @change="toggleLink(platform)" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- 수정 버튼 -->
      <button type="submit" class="button-submit">수정하기</button>
    </form>
  </div>

  <div v-else>
    <p>사용자 정보를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
// Vue의 반응형 ref, watch 가져오기
import { ref, watch } from 'vue'

// 라우터 이동용
import { useRouter } from 'vue-router'

// Pinia 스토어 임포트
import { useUserStore } from '@/stores/user'
import { useAlertStore } from '@/stores/alert'

// Supabase 클라이언트 임포트
import { db } from '@/services/supabase'

// userStore, alertStore 인스턴스 생성
const userStore = useUserStore()
const alertStore = useAlertStore()

const router = useRouter()

// 폼 상태 객체 - 반응형으로 관리
const form = ref({
  username: '',
  birth: '',
  name: '',
  nickname: '',
  phone: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

// userStore의 값이 변하면 폼에 반영 (초기값 포함)
watch(
  () => ({
    id: userStore.id,
    birthday: userStore.birthday,
    name: userStore.name,
    nickname: userStore.nickname,
    phone: userStore.phone,
    email: userStore.email
  }),
  (newUser) => {
    form.value.username = newUser.id || ''
    form.value.birth = newUser.birthday || ''
    form.value.name = newUser.name || ''
    form.value.nickname = newUser.nickname || ''
    form.value.phone = newUser.phone || ''
    form.value.email = newUser.email || ''
  },
  { immediate: true }
)

// 소셜 플랫폼 리스트와 연동 상태 (초기값 false, 실제는 서버 연동 필요)
const platforms = ref([
  { name: 'Google', linked: false },
  { name: 'Facebook', linked: false },
  { name: 'Naver', linked: false },
  { name: 'Kakao', linked: false }
])

// 스위치 토글 시 알림창 띄우기 (실제 연동 로직 미구현)
const toggleLink = (platform) => {
  if (platform.linked) {
    alertStore.info(`${platform.name} 계정이 연동되었습니다.(기능 준비중)`,2000)
  } else {
    alertStore.info(`${platform.name} 계정 연동이 해제되었습니다.(기능 준비중)`,2000)
  }
}

// 프로필 수정 함수
const updateProfile = async () => {
  // 비밀번호 입력 시 확인란과 다르면 에러 발생 후 종료
  if (form.value.password && form.value.password !== form.value.passwordConfirm) {
    alertStore.error('비밀번호가 일치하지 않습니다.')
    return
  }

  // 수정할 데이터 구성 (비밀번호 제외)
  const updateData = {
    nickname: form.value.nickname,
    phone: form.value.phone,
    email: form.value.email
  }

  try {
    // Supabase DB 업데이트 요청
    const { error } = await db
      .from('user')
      .update(updateData)
      .eq('id', userStore.id) // userStore.id가 PK로 있어야 함

    if (error) {
      alertStore.error('정보 수정 중 오류가 발생했습니다: ' + error.message)
      return
    }

    // 비밀번호 변경 처리 (주석 참고)
    if (form.value.password) {
      // supabase.auth.updateUser() 로 비밀번호 변경 처리 가능
      const { error: pwError } = await db.auth.updateUser({
        password: form.value.password
      })
      if (pwError) {
        alertStore.error('비밀번호 변경 실패: ' + pwError.message)
        return
      }
    }

    alertStore.success('정보가 수정되었습니다.')
    router.push('/mypage')
  } catch (err) {
    alertStore.error('서버 통신 중 오류가 발생했습니다.')
  }
}
</script>

<style scoped lang="scss">
/* 컨테이너 스타일 */
.container {
  width: 95%;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #e7ebfa;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 제목 스타일 */
.title {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #283A97;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(40, 58, 151, 0.3);
  gap: 2px;
}

/* 라벨 스타일 */
.label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

/* 폼 내부 세로 정렬 및 간격 */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 입력창 기본 스타일 */
.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #ffffff;
  font-size: 0.875rem;
  color: #1f2937;
}

.form-input:focus {
  outline: none;
  border-color: #283A97;
  box-shadow: 0 0 0 1px #283A97;
}

/* 비활성화 입력창 스타일 */
.form-static {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  font-size: 0.875rem;
  color: #9ca3af;
  cursor: not-allowed;
}

/* 제출 버튼 스타일 */
.button-submit {
  width: 100%;
  padding: 0.5rem 0;
  background-color: #283A97;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.button-submit:hover {
  background-color: #445194;
}

/* 소셜 연동 섹션 */
.social-switch-section {
  margin-top: 1.5rem;
}

/* 소셜 연동 제목 */
.switch-title {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.75rem;
}

/* 2열 그리드 배치 */
.switch-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* 각 스위치 아이템 스타일 */
.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

/* 플랫폼 이름 라벨 */
.switch-label {
  font-size: 0.875rem;
  color: #1f2937;
}

/* 스위치 컨테이너 */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  /* 슬라이더 가로 길이 */
  height: 22px;
  /* 슬라이더 세로 높이 */
}

/* 숨긴 체크박스 */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* 슬라이더 기본 배경 */
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  /* top:0; right:0; bottom:0; left:0 */
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 22px;
  /* 높이랑 같게 둥글게 */
}

/* 슬라이더 내부 동그라미 */
.slider::before {
  position: absolute;
  content: "";
  height: 18px;
  /* 동그라미 크기 */
  width: 18px;
  left: 2px;
  /* 왼쪽 간격 */
  bottom: 2px;
  /* 아래 간격 */
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
  /* 완전 동그라미 */
}

/* 체크된 상태 - 배경 파란색 */
input:checked+.slider {
  background-color: #283A97;
}

/* 체크된 상태 - 동그라미 오른쪽으로 이동 */
input:checked+.slider::before {
  transform: translateX(18px);
}
</style>