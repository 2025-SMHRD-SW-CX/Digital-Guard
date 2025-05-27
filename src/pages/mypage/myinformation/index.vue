
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
        <input id="passwordConfirm" type="password" v-model="form.passwordConfirm" class="form-input" autocomplete="new-password" />
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

      <!-- 수정 버튼 -->
      <button type="submit" class="button-submit">수정하기</button>
    </form>
  </div>

  <div v-else>
    <p>사용자 정보를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
// Vue 반응형 API 임포트
import { ref, watch } from 'vue';

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

// 폼 상태 관리
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

// userStore 값 변화 감지하여 폼 초기화
watch(
  () => ({
    id: userStore.id,
    birthday: userStore.birthday,
    name: userStore.name,
    nickname: userStore.nickname,
    phone: userStore.phone,
    email: userStore.email,
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

// 프로필 수정 함수
const updateProfile = async () => {
  // 비밀번호가 입력되어 있고, 확인란과 다르면 에러 출력 후 종료
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
    // Supabase profiles 테이블에 update 요청
    const { error } = await db
      .from('user')
      .update(updateData)
      .eq('id', userStore.id) // userStore.id가 PK로 있어야 함

    if (error) {
      alertStore.error('정보 수정 중 오류가 발생했습니다: ' + error.message)
      return
    }

    // 비밀번호 변경은 별도 함수나 supabase.auth API를 통해 처리 (아래 주석 참고)
    if (form.value.password) {
      // 예시) supabase.auth.updateUser() 로 비밀번호 변경 처리
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
/* 컨테이너: 너비 95%, 중앙 정렬, 배경색, 테두리 둥글게, 그림자 */
.container {
  width: 95%;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #e7ebfa;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 제목 스타일: 중앙 정렬, 크기, 색상, 아래 경계선 */
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

/* 라벨 스타일: 블록, 색상, 아래 마진 */
.label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

/* 폼: 세로 정렬, 항목 간격 */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 입력창 기본 스타일: 너비, 패딩, 테두리, 배경, 글자색 */
/* 포커스 시 테두리와 그림자 효과 */
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

/* 비활성화된 입력창 스타일: 연한 회색 배경, 커서 없음 */
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

/* 제출 버튼: 너비 100%, 배경색, 흰색 글자, 테두리 없음, 둥근 모서리 */
/* 마우스 오버 시 색상 변경 */
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
</style>
