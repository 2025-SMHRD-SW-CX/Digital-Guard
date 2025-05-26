<template>
  <CardView class="signup">
    <p class="signup__intro">회원 가입을 위해 정보를 입력해주세요.</p>
    <form class="signup__form" @submit.prevent="openConfirmation">
      <!-- 아이디 -->
      <InputField v-model="username" placeholder="아이디" :validator="validator.username"
        errorMessage="아이디는 영문과 숫자만 입력할 수 있습니다." autocomplete="username" :readOnly="idCheckStatus === true"
        :externalError="idCheckStatus === false ? '이미 사용 중인 아이디입니다.' : ''"
        :externalValid="idCheckStatus === true ? '사용 가능한 아이디입니다.' : ''">
        <template #right>
          <button class="id-check-btn" type="button" @click="idCheckStatus === true ? handleResetId() : handleIdCheck()"
            :disabled="!validator.username(username) || !username">
            {{ idCheckStatus === true ? '다시입력' : '중복검사' }}
          </button>
        </template>
      </InputField>
      <!-- 안내 메시지도 아래에서 조건부로 -->
      <!-- <p v-if="idCheckStatus === false" class="signup__message signup__message--warn">
        이미 사용 중인 아이디입니다.
      </p>
      <p v-if="idCheckStatus === true" class="signup__message signup__message--info">
        사용 가능한 아이디입니다.
      </p> -->

      <!-- 비밀번호 -->
      <InputField v-model="password" type="password" placeholder="비밀번호" :validator="validator.password"
        errorMessage="영문+숫자 포함, 8자 이상 (사용가능 특수문자는 !@#$%^&*()-_=+[]{};:,.<>?~) 입력해야 합니다." validMessage="안전한 비밀번호입니다."
        autocomplete="new-password" :show-password-toggle="true" />

      <!-- 비밀번호 확인 -->
      <InputField v-model="passwordConfirm" type="password" placeholder="비밀번호 확인" :validator="validator.passwordCheck"
        errorMessage="비밀번호가 일치하지 않습니다." validMessage="비밀번호가 일치합니다." autocomplete="new-password"
        :show-password-toggle="true" />

      <!-- 이름 -->
      <InputField v-model="name" placeholder="이름" :validator="validator.name" errorMessage="이름은 한글만 입력할 수 있습니다."
        autocomplete="name" />

      <!-- 생년월일 -->
      <InputField v-model="birth" placeholder="생년월일 (예: 16081103)" :validator="validator.birth"
        errorMessage="8자리 숫자만 입력하세요." maxlength="8" autocomplete="bday" />

      <!-- 전화번호 -->
      <InputField v-model="phone" placeholder="전화번호 (- 없이)" :validator="validator.phone"
        errorMessage="휴대폰 번호를 10~11자리 숫자로 입력하세요." maxlength="11" autocomplete="tel" />

      <!-- 이메일 -->
      <div class="signup__row signup__email-row">
        <InputField v-model="emailId" placeholder="이메일 아이디" />
        <span class="signup__at">@</span>
        <select v-model="selectedDomain" class="signup__email-domain">
          <option disabled value="">도메인 선택</option>
          <option value="gmail.com">gmail.com</option>
          <option value="naver.com">naver.com</option>
          <option value="daum.net">daum.net</option>
          <option value="self">직접 입력</option>
        </select>
      </div>
      <!-- 직접입력은 아랫줄에서 보여주기 -->
      <div v-if="selectedDomain === 'self'" class="signup__row signup__custom-domain-row">
        <InputField v-model="customDomain" placeholder="직접 입력" />
      </div>

      <!-- 이메일 전체가 입력됐을 때만 메시지 띄우기 -->
      <div v-if="shouldShowEmailError" class="signup__message signup__message--warn">
        올바른 이메일 형식을 입력해주세요.
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
import CardView from '@/components/CardView.vue'
import ModalView from '@/components/ModalView.vue'
import InputField from '@/components/InputField.vue'
import { reactive, ref, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser, checkUserIdDuplicate } from '@/services/userService.js'
import { useAlertStore } from '@/stores/alert'

const router = useRouter()
const alertStore = useAlertStore();

const form = reactive({
  username: '', password: '', passwordConfirm: '', name: '', birth: '', phone: '', gender: '', agree: false,
})
const { username, password, passwordConfirm, name, birth, phone, gender, agree } = toRefs(form)
const emailId = ref(''); const selectedDomain = ref(''); const customDomain = ref('')
const email = computed(() => {
  if (!emailId.value) return ''
  const domain = selectedDomain.value === 'self' ? customDomain.value : selectedDomain.value
  return `${emailId.value}@${domain}`
})

const idCheckStatus = ref(null) // null: 미확인, true: 사용 가능, false: 중복, 'reset': 다시입력 상태

const handleIdCheck = async () => {
  // 빈값은 체크 X
  if (!username.value) return
  const ok = await checkUserIdDuplicate(username.value)
  idCheckStatus.value = ok ? true : false
}

const handleResetId = () => {
  username.value = ''
  idCheckStatus.value = null
}

const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

const shouldShowEmailError = computed(() => {
  // 기본 도메인 선택: emailId와 selectedDomain이 모두 입력됐고, 이메일이 invalid
  if (selectedDomain.value && selectedDomain.value !== 'self') {
    return emailId.value && !isEmailValid.value
  }
  // 직접입력: emailId, customDomain 모두 입력됐고, 이메일이 invalid
  if (selectedDomain.value === 'self') {
    return emailId.value && customDomain.value && !isEmailValid.value
  }
  return false
})


// 메서드
const selectGender = g => { gender.value = g }
const genderClass = g =>
  ['signup__gender-btn', gender.value === g ? 'selected' : '']

const validator = {
  username(val) {
    if (!val) return undefined; // 입력 전
    if (/^[A-Za-z0-9]+$/.test(val)) return true;
    return false;
  },
  password(val) {
    if (!val) return undefined
    // 허용 특수문자!
    const allowedSpecials = '!@#$%^&*()\\-_=+\\[\\]{};:,.<>?~'
    const regex = new RegExp(
      `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d${allowedSpecials}]{8,}$`
    )
    return regex.test(val)
  },
  passwordCheck(val) {
    if (!val) return undefined;
    if (val === password.value) return true;
    return false;
  },
  name(val) {
    if (!val) return undefined;
    if (/^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]+$/.test(val)) return true;
    return false;
  },
  birth(val) {
    if (!val) return undefined;
    if (/^\d{8}$/.test(val)) return true;
    return false;
  },
  phone(val) {
    if (!val) return undefined;
    if (/^\d{10,11}$/.test(val)) return true;
    return false;
  }
}

const canSubmit = computed(() =>
  idCheckStatus.value &&
  validator.username(username.value) === true &&
  validator.password(password.value) === true &&
  validator.passwordCheck(passwordConfirm.value) === true &&
  validator.name(name.value) === true &&
  validator.birth(birth.value) === true &&
  validator.phone(phone.value) === true &&
  isEmailValid.value && // 이메일은 기존대로
  agree.value
);


// 모달
const showTermModal = ref(false)
const showConfirmModal = ref(false)
const openTermsPopup = () => { showTermModal.value = true }
const agreeTerm = () => { agree.value = true }
const denyTerm = () => { agree.value = false }
const openConfirmation = () => { showConfirmModal.value = true }

const confirmRegister = async () => {
  if (!canSubmit.value) return

  const userObj = {
    id: username.value.trim(),
    name: name.value,
    nickname: name.value, // 필요에 따라 수정
    phone: phone.value,
    birthday: birth.value,
    email: email.value,
    gender: gender.value,
    password: password.value, // 평문 전달(해싱은 userService에서)
  }

  const { data, error } = await registerUser(userObj)
  if (error) {
    alertStore.danger('회원가입 실패: ' + error.message)
    return
  }

  router.push('/welcome')
}
</script>

<style lang="scss" scoped>
.signup {
  // 공통 컨테이너
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
  font-family: 'Roboto', sans-serif;

  &__intro {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 1em;
    width: 100%;
    text-align: center;
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  // 일관된 row 스타일
  &__row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px; // InputField와 align
    min-height: 48px; // 높이 통일
  }

  // 이메일 입력 row
  &__email-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 48px;

    .signup__at {
      font-weight: bold;
      font-size: 18px;
      min-width: 18px;
      text-align: center;
    }

    .signup__email-domain {
      height: 44px;
      min-width: 110px;
      max-width: 150px;
      padding: 0 1rem;
      border: 1.5px solid #ccc;
      border-radius: 8px;
      font-size: 16px;
      background: #fff;
      transition: border-color 0.25s, box-shadow 0.25s;
      outline: none;
      flex-shrink: 0;

      &:focus {
        border-color: #1e3a8a;
        box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.08);
      }
    }
  }

  &__custom-domain-row {
    margin-top: 4px; // 살짝 띄움
    width: 100%;
    // InputField와 똑같이!
  }

  // 성별 버튼 row
  &__gender-row {
    @extend .signup__row;

    .signup__gender-btn {
      flex: 1;
      height: 44px;
      border-radius: 8px;
      border: 1.5px solid #ccc;
      background: #fff;
      color: #444;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: border-color 0.25s, background 0.18s;

      &:focus,
      &.selected {
        border-color: #1e3a8a;
        background: #1e3a8a;
        color: #fff;
      }
    }
  }

  // 약관동의 row
  &__checkbox-row {
    @extend .signup__row;
    border: 1.5px solid #ccc;
    border-radius: 8px;
    background: #fff;
    padding: 0 1rem;
    font-size: 15px;
    cursor: pointer;
    transition: border-color 0.25s, box-shadow 0.25s;

    &:focus-within,
    &.active {
      border-color: #1e3a8a;
      box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.08);
    }

    .signup__checkbox {
      width: 20px;
      height: 20px;
      accent-color: #1e3a8a;
      margin: 0;
    }

    .signup__checkbox-label {
      flex: 1;
      cursor: pointer;
      user-select: none;
      color: #444;
    }
  }

  &__submit {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    background: #e5e7eb;
    color: #4b5563;
    font-weight: 600;
    font-size: 16px;
    margin-top: 1rem;
    cursor: not-allowed;
    border: none;

    &:enabled {
      background: #1e3a8a;
      color: #fff;
      cursor: pointer;
    }
  }

  &__message {
    text-align: left;
    margin-top: 0.25rem;
    font-size: 14px;
    line-height: 1.4;
    position: relative;
    bottom: 0.9rem;

    &--warn {
      color: #ef4444;
    }

    &--info {
      color: #1e3a8a;
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

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .id-check-btn {
    text-wrap: nowrap;
    margin-left: 0.5rem;
    padding: 0.7rem 1rem;
    font-size: 0.9em;
    border-radius: 0.5em;
    border: 1.5px solid #1e3a8a;
    background: #fff;
    color: #1e3a8a;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &:hover:not(:disabled) {
      background: #1e3a8a;
      color: #fff;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
