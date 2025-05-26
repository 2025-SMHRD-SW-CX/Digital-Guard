<template>
  <CardView class="signup">
    <p class="signup__intro">회원 가입을 위해 정보를 입력해주세요.</p>
    <form class="signup__form" @submit.prevent="openConfirmation">
      <!-- 아이디 -->
      <div class="signup__input-group">
        <input v-model="username" type="text" placeholder="아이디" class="signup__input" @input="validateUsername" />
        <p v-if="username.trim() === ''" class="signup__message signup__message--warn">아이디를 입력해주세요.</p>
        <p v-else-if="!isUsernameValid" class="signup__message signup__message--warn">아이디는 영문과 숫자만 입력할 수 있습니다.</p>
        <p v-else class="signup__message signup__message--info">사용할 수 있는 아이디입니다.</p>
      </div>

      <!-- 비밀번호 -->
      <div class="signup__input-group">
        <div class="signup__input-password-wrap">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="비밀번호"
            class="signup__input signup__input--with-toggle" @input="validatePassword" />
          <button type="button" class="signup__toggle" @click="showPassword = !showPassword" tabindex="-1" aria-label="비밀번호 표시/숨기기">
            <svg v-if="showPassword" class="signup__eye-icon" viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="#666" stroke-width="2" d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle fill="none" stroke="#666" stroke-width="2" cx="12" cy="12" r="3"/></svg>
            <svg v-else class="signup__eye-icon" viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="#666" stroke-width="2" d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle fill="none" stroke="#666" stroke-width="2" cx="12" cy="12" r="3"/><line x1="4" y1="4" x2="20" y2="20" stroke="#aaa" stroke-width="2"/></svg>
          </button>
        </div>
        <p v-if="password && !isPasswordValid" class="signup__message signup__message--warn">
          비밀번호는 영문+숫자+특수기호 포함 8자 이상이어야 합니다.
        </p>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="signup__input-group">
        <div class="signup__input-password-wrap">
          <input :type="showPasswordConfirm ? 'text' : 'password'" v-model="passwordConfirm" placeholder="비밀번호 확인"
            class="signup__input signup__input--with-toggle" />
          <button type="button" class="signup__toggle" @click="showPasswordConfirm = !showPasswordConfirm" tabindex="-1" aria-label="비밀번호 확인 표시/숨기기">
            <svg v-if="showPasswordConfirm" class="signup__eye-icon" viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="#666" stroke-width="2" d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle fill="none" stroke="#666" stroke-width="2" cx="12" cy="12" r="3"/></svg>
            <svg v-else class="signup__eye-icon" viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="#666" stroke-width="2" d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle fill="none" stroke="#666" stroke-width="2" cx="12" cy="12" r="3"/><line x1="4" y1="4" x2="20" y2="20" stroke="#aaa" stroke-width="2"/></svg>
          </button>
        </div>
        <p v-if="passwordConfirm !== ''" class="signup__message"
          :class="password === passwordConfirm ? 'signup__message--info' : 'signup__message--warn'">
          {{ password === passwordConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
        </p>
      </div>

      <!-- 이름 -->
      <div class="signup__input-group">
        <input v-model="name" type="text" placeholder="이름" class="signup__input" @input="filterKoreanName" />
      </div>

      <!-- 생년월일 -->
      <div class="signup__input-group">
        <input v-model="birth" type="text" placeholder="생년월일 (예: 16081103)" class="signup__input"
          @input="() => filterOnlyNumber('birth')" maxlength="8" />
      </div>

      <!-- 전화번호 -->
      <div class="signup__input-group">
        <input v-model="phone" type="text" placeholder="전화번호 (- 없이)" class="signup__input"
          @input="() => filterOnlyNumber('phone')" maxlength="11" />
      </div>

      <!-- 이메일 -->
      <div class="signup__input-group">
        <div class="signup__email-row">
          <input v-model="emailId" type="text" placeholder="이메일 아이디" class="signup__email-id" />
          <span class="signup__at">@</span>
          <select v-model="selectedDomain" class="signup__email-domain">
            <option disabled value="">도메인 선택</option>
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
            <option value="self">직접 입력</option>
          </select>
          <input v-if="selectedDomain === 'self'" v-model="customDomain" type="text" placeholder="직접 입력"
            class="signup__email-custom" />
        </div>
        <p v-if="!isEmailValid" class="signup__message signup__message--warn">올바른 이메일 형식을 입력해주세요.</p>
      </div>

      <!-- 성별 -->
      <div class="signup__gender-row">
        <button :class="genderClass('male')" @click.prevent="selectGender('male')">남자</button>
        <button :class="genderClass('female')" @click.prevent="selectGender('female')">여자</button>
      </div>

      <!-- 약관 동의 -->
      <div class="signup__checkbox-row" @click.stop="openTermsPopup">
        <input type="checkbox" id="agree" class="signup__checkbox" v-model="agree" />
        <label for="agree" class="signup__checkbox-label">
          이용·인증약관 및 개인정보 처리방침 동의
        </label>
      </div>

      <!-- 가입 버튼 -->
      <button class="signup__submit" :disabled="!canSubmit" @click="openConfirmation">
        회원 가입
      </button>
    </form>
  </CardView>

  <!-- 약관 동의 모달 -->
  <ModalView v-model="showTermModal" title="개인정보처리방침 및 이용약관 동의" type="confirm" :backdrop="false" confirmText="동의합니다"
    cancelText="동의하지 않습니다" @confirm="agreeTerm" @cancel="denyTerm">
    <div class="signup__modal-content">
      <h3>1. 개인정보 수집 항목</h3>
      <p>이름, 이메일, 비밀번호 등</p>
      <h3>2. 이용 목적</h3>
      <p>회원 관리, 서비스 제공 등</p>
      <h3>3. 보관 기간</h3>
      <p>회원 탈퇴 시 또는 법령에 따른 기간</p>
      <p><strong>※ 전체 약관은 스크롤하여 확인해 주세요.</strong></p>
    </div>
  </ModalView>

  <!-- 회원가입 확인 모달 -->
  <ModalView v-model="showConfirmModal" title="회원가입" type="confirm" :backdrop="false" @confirm="confirmRegister">
    회원가입을 진행하시겠습니까?
  </ModalView>
</template>

<script setup>
import { reactive, ref, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import CardView from '@/components/CardView.vue'
import ModalView from '@/components/ModalView.vue'
import { db } from '@/services/supabase'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  passwordConfirm: '',
  name: '',
  birth: '',
  phone: '',
  gender: '',
  agree: false,
})

const {
  username, password, passwordConfirm, name,
  birth, phone, gender, agree,
} = toRefs(form)

// 이메일
const emailId = ref('')
const selectedDomain = ref('')
const customDomain = ref('')
const email = computed(() => {
  if (!emailId.value) return ''
  const domain = selectedDomain.value === 'self' ? customDomain.value : selectedDomain.value
  return `${emailId.value}@${domain}`
})

// 상태/유효성
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const isUsernameValid = ref(true)
const isPasswordValid = ref(true)
const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

const canSubmit = computed(() =>
  username.value.trim() !== '' &&
  isUsernameValid.value &&
  password.value !== '' &&
  isPasswordValid.value &&
  passwordConfirm.value !== '' &&
  password.value === passwordConfirm.value &&
  isEmailValid.value &&
  agree.value
)

// 메서드
const selectGender = g => { gender.value = g }
const genderClass = g =>
  ['signup__gender-btn', gender.value === g ? 'selected' : '']

const validateUsername = () => {
  isUsernameValid.value = /^[A-Za-z0-9]+$/.test(username.value)
}
const validatePassword = () => {
  isPasswordValid.value = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_+=~`|:;"'<>,.?/]).{8,}$/.test(password.value)
}
const filterKoreanName = () => {
  name.value = name.value.replace(/[^\uAC00-\uD7A3]/g, '')
}
const filterOnlyNumber = field => {
  form[field] = form[field].replace(/[^0-9]/g, '').slice(0, field === 'birth' ? 8 : 11)
}

// 모달
const showTermModal = ref(false)
const showConfirmModal = ref(false)
const openTermsPopup = () => { showTermModal.value = true }
const agreeTerm = () => { agree.value = true }
const denyTerm = () => { agree.value = false }
const openConfirmation = () => { showConfirmModal.value = true }

 // <-- 이 위치가 맞습니다!

const confirmRegister = async () => {
  if (!canSubmit.value) return

  const id = username.value.trim()  // 사용자가 입력한 아이디를 id로 사용

  const { data, error } = await db.from('user').insert({
    id,
    name: name.value,
    nickname : name.value,
    phone: phone.value,
    birthday: birth.value,
    email: email.value,
    password: password.value // 운영 시 해싱 꼭!
  })

  if (error) {
    console.error('에러 내용:', error)
    alert('회원가입 실패: ' + error.message)
    return
  }

  alert('회원가입 성공!')
  router.push('/welcome')
}

</script>

<style lang="scss" scoped>
.signup {
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;

  &__intro {
    font-weight: 500;
    font-size: 1.1rem;
    margin-bottom: 1em;
    text-align: center;
    width: 100%;
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__input-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 0.25rem;
  }

  // input + toggle button 고정
  &__input-password-wrap {
    position: relative;
    width: 100%;

    .signup__input {
      width: 100%;
      padding-right: 3rem;
    }
    .signup__toggle {
      position: absolute;
      right: 0.8rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
    }
    .signup__eye-icon {
      display: block;
      width: 22px;
      height: 22px;
      pointer-events: none;
    }
  }

  &__input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #1e3a8a;
    border-radius: 0.25rem;
    font-size: 16px;

    &::placeholder {
      font-size: 15px;
      color: #9ca3af;
    }
    &--with-toggle {
      padding-right: 3rem;
    }
  }

  &__message {
    margin-top: 0.25rem;
    font-size: 14px;
    line-height: 1.4;

    &--warn {
      color: #ef4444;
    }
    &--info {
      color: #1e3a8a;
    }
  }

  &__email-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  &__email-id,
  &__email-custom {
    flex: 1;
    min-width: 70px;
    padding: 0.65rem 0.8rem;
    border: 1px solid #1e3a8a;
    border-radius: 0.25rem;
    font-size: 15px;
  }
  &__at {
    font-weight: bold;
  }
  &__email-domain {
    padding: 0.6rem;
    font-size: 14px;
    border: 1px solid #1e3a8a;
    border-radius: 0.25rem;
  }

  &__gender-row {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    .signup__gender-btn {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 0.25rem;
      font-weight: bold;
      font-size: 16px;
      border: 1px solid #1e3a8a;
      background: #eee;
      color: #444;
      &.selected {
        background: #1e3a8a;
        color: #fff;
      }
    }
  }

  &__checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid #1e3a8a;
    border-radius: 0.25rem;
    padding: 0.75rem 1rem;
    font-size: 14px;
    cursor: pointer;
  }
  &__checkbox {
    accent-color: #1e3a8a;
  }
  &__checkbox-label {
    cursor: pointer;
    user-select: none;
  }

  &__submit {
    width: 100%;
    background: #e5e7eb;
    color: #4b5563;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    margin-top: 1rem;
    cursor: not-allowed;
    &:enabled {
      background: #1e3a8a;
      color: #fff;
      cursor: pointer;
    }
  }
  &__modal-content {
    text-align: left;
    max-height: 300px;
    overflow-y: auto;
    font-size: 14px;
    padding-right: 1rem;
  }
}
</style>
