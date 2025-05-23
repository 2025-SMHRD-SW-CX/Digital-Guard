<template>
  <div class="signup-container">
    <p class="intro-text">회원 가입을 위해 정보를 입력해주세요.</p>
    <form class="form-block" @submit.prevent="openConfirmation">
      <!-- 아이디 -->
      <div class="input-group">
        <input v-model="username" type="text" placeholder="아이디" class="custom-input" @input="validateUsername" />
        <p v-if="username.trim() === ''" class="input-message warning-text">아이디를 입력해주세요.</p>
        <p v-else-if="!isUsernameValid" class="input-message warning-text">아이디는 영문과 숫자만 입력할 수 있습니다.</p>
        <p v-else class="input-message info-text">사용할 수 있는 아이디입니다.</p>
      </div>

      <!-- 비밀번호 -->
      <div class="input-group password-wrapper">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="비밀번호" class="custom-input with-toggle" @input="validatePassword" />
        <button type="button" class="toggle-button" @click="showPassword = !showPassword">
          {{ showPassword ? '🙈' : '👁' }}
        </button>
        <p v-if="password && !isPasswordValid" class="input-message warning-text">비밀번호는 영문+숫자+특수기호를 포함해 8자 이상이어야 합니다.</p>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="input-group password-wrapper">
        <input :type="showPasswordConfirm ? 'text' : 'password'" v-model="passwordConfirm" placeholder="비밀번호 확인" class="custom-input with-toggle" />
        <button type="button" class="toggle-button" @click="showPasswordConfirm = !showPasswordConfirm">
          {{ showPasswordConfirm ? '🙈' : '👁' }}
        </button>
        <p v-if="passwordConfirm !== ''" class="input-message">
          <span v-if="password === passwordConfirm" class="info-text">비밀번호가 일치합니다.</span>
          <span v-else class="warning-text">비밀번호가 일치하지 않습니다.</span>
        </p>
      </div>

      <!-- 이름 -->
      <div class="input-group">
        <input v-model="name" type="text" placeholder="이름" class="custom-input" @input="filterKoreanName" />
      </div>

      <!-- 생년월일 -->
      <div class="input-group">
        <input v-model="birth" type="text" placeholder="생년월일 (ex. 16081103)" class="custom-input" @input="() => filterOnlyNumber('birth')" />
      </div>

      <!-- 전화번호 -->
      <div class="input-group">
        <input v-model="phone" type="text" placeholder="전화번호입력(- 없이 입력)" class="custom-input" @input="() => filterOnlyNumber('phone')" />
      </div>

      <!-- 이메일 -->
      <div class="input-group">
        <div class="email-inline">
          <input v-model="emailId" type="text" placeholder="이메일 아이디" class="email-id-input" />
          <span class="at-sign">@</span>
          <select v-model="selectedDomain" class="email-select">
            <option disabled value="">도메인 선택</option>
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
            <option value="self">직접 입력</option>
          </select>
          <input v-if="selectedDomain === 'self'" v-model="customDomain" type="text" placeholder="직접 입력" class="custom-domain-input" />
        </div>
        <p v-if="!isEmailValid" class="input-message warning-text">올바른 이메일 형식을 입력해주세요.</p>
      </div>

      <!-- 성별 -->
      <div class="gender-container">
        <div class="gender-buttons">
          <button :class="genderClass('male')" @click.prevent="() => selectGender('male')">남자</button>
          <button :class="genderClass('female')" @click.prevent="() => selectGender('female')">여자</button>
        </div>
      </div>

      <!-- 학교 -->
      <div class="input-group">
        <input v-model="school" type="text" placeholder="다니는 학교를 선택해주세요" class="custom-input" @input="filterKoreanSchool" />
      </div>

      <!-- 약관 동의 -->
      <div class="checkbox-block">
        <input type="checkbox" id="agree" class="form-checkbox" :checked="agree" @change="openTermsPopup" />
        <label for="agree">이용·인증약관 및 개인정보 처리방침 동의</label>
      </div>

      <!-- 가입 버튼 -->
      <button class="submit-button" :disabled="!canSubmit">회원 가입</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, toRefs, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/services/supabase';
import Swal from 'sweetalert2';

const router = useRouter();

const form = reactive({
  username: '',
  password: '',
  passwordConfirm: '',
  name: '',
  birth: '',
  phone: '',
  gender: '',
  school: '',
  agree: false,
});

const {
  username, password, passwordConfirm, name,
  birth, phone, gender, school, agree,
} = toRefs(form);

// 이메일 관련
const emailId = ref('');
const selectedDomain = ref('');
const customDomain = ref('');
const email = computed(() => {
  if (!emailId.value) return '';
  const domain = selectedDomain.value === 'self' ? customDomain.value : selectedDomain.value;
  return `${emailId.value}@${domain}`;
});

// 상태 및 유효성
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const isUsernameValid = ref(true);
const isPasswordValid = ref(true);
const isEmailValid = computed(() => {
  const emailValue = email.value;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
});

const canSubmit = computed(() => {
  return (
    username.value.trim() !== '' &&
    isUsernameValid.value &&
    password.value !== '' &&
    isPasswordValid.value &&
    passwordConfirm.value !== '' &&
    password.value === passwordConfirm.value &&
    isEmailValid.value &&
    agree.value
  );
});

// 유효성 및 기타 메서드
const selectGender = (selectedGender) => {
  gender.value = selectedGender;
};

const genderClass = (g) => {
  return ['gender-button', gender.value === g ? 'selected' : 'not-selected'];
};

const validateUsername = () => {
  isUsernameValid.value = /^[A-Za-z0-9]+$/.test(username.value);
};

const validatePassword = () => {
  isPasswordValid.value = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_+=~`|:;"'<>,.?/]).{8,}$/.test(password.value);
};

const filterKoreanName = () => {
  name.value = name.value.replace(/[^\uAC00-\uD7A3]/g, '');
};

const filterKoreanSchool = () => {
  school.value = school.value.replace(/[^\uAC00-\uD7A3]/g, '');
};

const filterOnlyNumber = (field) => {
  form[field] = form[field].replace(/[^0-9]/g, '').slice(0, field === 'birth' ? 8 : 11);
};

const openTermsPopup = async (e) => {
  e.preventDefault();
  const { isConfirmed } = await Swal.fire({
    title: '<div style="white-space: normal; font-size: 20px; text-align: center;">개인정보처리방침 및 약관 동의</div>',
    html: `
      <div style="text-align: left; max-height: 300px; overflow-y: auto; font-size: 14px;">
        <h3>1. 개인정보 수집 항목</h3>
        <p>이름, 이메일, 비밀번호 등</p>
        <h3>2. 이용 목적</h3>
        <p>회원 관리, 서비스 제공 등</p>
        <h3>3. 보관 기간</h3>
        <p>회원 탈퇴 시 또는 법령에 따른 기간</p>
        <p style="margin-top:1rem;"><strong>※ 전체 약관은 스크롤하여 확인해 주세요.</strong></p>
      </div>
    `,
    confirmButtonText: '동의합니다',
    confirmButtonColor: '#1e3a8a',
    showCancelButton: true,
    cancelButtonText: '닫기',
    width: 600,
    padding: '1.5rem',
  });

  if (isConfirmed) {
    agree.value = true;
  }
};


const openConfirmation = () => {
  if (!canSubmit.value) return;

  Swal.fire({
    title: '회원가입',
    text: '입력하신 정보로 회원가입을 진행하시겠습니까?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '네',
    confirmButtonColor: '#1e3a8a',
    cancelButtonText: '아니오',
  }).then((result) => {
    if (result.isConfirmed) {
      submitForm();
    }
  });
};

const submitForm = () => {
  Swal.fire({
    icon: 'success',
    title: '회원가입 완료!',
    text: '로그인 페이지로 이동합니다.',
    confirmButtonText: '확인',
    confirmButtonColor: '#1e3a8a',
  }).then(() => {
    router.push('/welcome');
  });
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

.signup-container {
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
  box-sizing: border-box;
}

.intro-text {
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
}

.form-block {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.custom-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #1e3a8a;
  border-radius: 0.5rem;
  font-size: 16px;
  box-sizing: border-box;
}

.custom-input::placeholder {
  font-size: 15px;
  color: #9ca3af;
}

.input-message {
  margin-top: 0.25rem;
  line-height: 1.4;
  font-size: 14px;
}

.warning-text {
  color: #ef4444;
}

.info-text {
  color: #1e3a8a;
}

.password-wrapper {
  position: relative;
}

.with-toggle {
  padding-right: 3rem;
}

.toggle-button {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #4b5563;
  padding: 0;
  line-height: 1;
}

.gender-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.gender-buttons {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  max-width: 340px;
  box-sizing: border-box;
}

.gender-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 16px;
  border: 1px solid #1e3a8a;
}

.selected {
  background-color: #1e3a8a;
  color: #fff;
}

.not-selected {
  background-color: #e5e7eb;
  color: #444;
}

.checkbox-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #1e3a8a;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 14px;
}

.submit-button {
  width: 100%;
  max-width: 340px;
  background-color: #e5e7eb;
  color: #4b5563;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  cursor: not-allowed;
}

.submit-button:enabled {
  background-color: #1e3a8a;
  color: #fff;
  cursor: pointer;
}

.terms-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.terms-box {
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.terms-content {
  height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #f9f9f9;
  font-size: 14px;
  line-height: 1.4;
  width: 100%;
}

.confirmation-box {
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.confirmation-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

/* 이메일 입력 전용 스타일 */
.email-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.email-id-input {
  width: 140px;
  padding: 0.65rem 0.8rem;
  border: 1px solid #1e3a8a;
  border-radius: 0.5rem;
  font-size: 15px;
}

.at-sign {
  font-weight: bold;
}

.email-select {
  padding: 0.6rem;
  font-size: 14px;
  border: 1px solid #1e3a8a;
  border-radius: 0.5rem;
}

.custom-domain-input {
  width: 140px;
  padding: 0.65rem 0.8rem;
  border: 1px solid #1e3a8a;
  border-radius: 0.5rem;
  font-size: 15px;
}
</style>
