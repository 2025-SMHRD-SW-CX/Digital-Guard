<template>
  <div class="signup-container">
    <!-- 로고 -->
    <div class="logo-container">
      <img src="/images/brand.png" alt="Digital Guard Logo" class="logo-image" />
    </div>

    <!-- 안내 문구 -->
    <p class="intro-text">회원 가입을 위해 정보를 입력해주세요.</p>

    <!-- 입력 폼 -->
    <form class="form-block" @submit.prevent="openConfirmation">
      <!-- 아이디 입력 -->
      <div class="input-group">
        <input
          v-model="form.username"
          type="text"
          placeholder="아이디"
          class="custom-input"
          @input="validateUsername"
        />
        <p v-if="form.username.trim() === ''" class="input-message warning-text">아이디를 입력해주세요.</p>
        <p v-else-if="!isUsernameValid" class="input-message warning-text">아이디는 영문과 숫자만 입력할 수 있습니다.</p>
        <p v-else class="input-message info-text">사용할 수 있는 아이디입니다.</p>
      </div>

      <!-- 비밀번호 입력 -->
      <div class="input-group">
        <input
          v-model="form.password"
          type="password"
          placeholder="비밀번호"
          class="custom-input"
          @input="validatePassword"
        />
        <p v-if="form.password && !isPasswordValid" class="input-message warning-text">
          비밀번호는 영문+숫자+특수기호를 포함해 8자 이상이어야 합니다.
        </p>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="input-group">
        <input
          v-model="form.passwordConfirm"
          type="password"
          placeholder="비밀번호 확인"
          class="custom-input"
        />
        <p v-if="form.passwordConfirm !== ''" class="input-message">
          <span v-if="form.password === form.passwordConfirm" class="info-text">비밀번호가 일치합니다.</span>
          <span v-else class="warning-text">비밀번호가 일치하지 않습니다.</span>
        </p>
      </div>

      <!-- 이름 -->
      <div class="input-group">
        <input
          v-model="form.name"
          type="text"
          placeholder="이름"
          class="custom-input"
          @input="filterKoreanName"
        />
      </div>

      <!-- 생년월일 -->
      <div class="input-group">
        <input
          v-model="form.birth"
          type="text"
          placeholder="생년월일 (ex. 16081103)"
          class="custom-input"
          @input="filterOnlyNumber('birth')"
        />
      </div>

      <!-- 전화번호 -->
      <div class="input-group">
        <input
          v-model="form.phone"
          type="text"
          placeholder="전화번호입력(- 없이 입력)"
          class="custom-input"
          @input="filterOnlyNumber('phone')"
        />
      </div>

      <!-- 이메일 -->
      <div class="input-group">
        <input
          v-model="form.email"
          type="email"
          placeholder="이메일 (비밀번호 찾기 등에 이용 필수 아님)"
          class="custom-input"
          @input="validateEmail"
        />
        <p v-if="form.email && !isEmailValid" class="input-message warning-text">
          @이하의 주소를 입력해주세요.
        </p>
      </div>

      <!-- 성별 선택 -->
      <div class="gender-container">
        <div class="gender-buttons">
          <button :class="genderClass('male')" @click.prevent="selectGender('male')">남자</button>
          <button :class="genderClass('female')" @click.prevent="selectGender('female')">여자</button>
        </div>
      </div>

      <!-- 학교 입력 -->
      <div class="input-group">
        <input
          v-model="form.school"
          type="text"
          placeholder="다니는 학교를 선택해주세요"
          class="custom-input"
          @input="filterKoreanSchool"
        />
      </div>

      <!-- 약관 동의 -->
      <div class="checkbox-block">
        <input
          type="checkbox"
          id="agree"
          class="form-checkbox"
          v-model="form.agree"
          @click.prevent="openTermsPopup"
        />
        <label for="agree">이용·인증약관 및 개인정보 처리방침 동의</label>
      </div>

      <!-- 가입 버튼 -->
      <button type="submit" class="submit-button" :disabled="!canSubmit">
        휴대폰 인증 후 회원 가입
      </button>
    </form>

    <!-- 약관 팝업 모달 -->
    <div v-if="showTerms" class="terms-modal">
      <div class="terms-box">
        <h3>개인정보처리 지침 및 이용약관 보기</h3>
        <div class="terms-content">
          <h1>개인정보처리방침</h1>
          <p><strong>[디지털가드]</strong>(이하 "회사"라 함)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 본 개인정보처리방침은 이용자가 제공한 개인정보가 어떤 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떤 조치가 취해지고 있는지 알려드리기 위한 것입니다.</p>

          <h2>1. 개인정보 수집 항목 및 수집 방법</h2>
          <p>회사는 회원가입, 서비스 이용, 고객상담 등을 위해 다음과 같은 개인정보를 수집합니다.</p>
          <ul>
            <li><strong>수집 항목</strong>
              <ul>
                <li>필수항목: 이름, 이메일, 비밀번호, 서비스 이용기록, 접속 로그, 쿠키, 접속 IP</li>
                <li>선택항목: 프로필 이미지, 생년월일 등</li>
              </ul>
            </li>
            <li><strong>수집 방법</strong>: 회원가입 및 서비스 이용 시 직접 입력, 고객센터 문의, 자동 수집</li>
          </ul>

          <h2>2. 개인정보 수집 및 이용 목적</h2>
          <ul>
            <li>회원 관리: 본인 확인, 서비스 제공을 위한 사용자 식별</li>
            <li>서비스 제공 및 개선: 콘텐츠 제공, 맞춤형 서비스 제공, 오류 해결</li>
            <li>마케팅 및 광고 활용(동의한 경우): 신규 서비스 안내, 이벤트 정보 제공</li>
            <li>법적 의무 이행 및 분쟁 대응</li>
          </ul>

          <h2>3. 개인정보의 보유 및 이용 기간</h2>
          <ul>
            <li>회원 탈퇴 시 또는 수집·이용 목적 달성 시 지체 없이 파기</li>
            <li>관련 법령에 따른 보관
              <ul>
                <li>계약 또는 청약철회 기록: 5년</li>
                <li>대금 결제 및 재화 공급 기록: 5년</li>
                <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
                <li>접속 로그: 3개월</li>
              </ul>
            </li>
          </ul>

          <h2>4. 개인정보 제3자 제공</h2>
          <p>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 의거하거나 수사기관의 요청이 있는 경우</li>
          </ul>

          <h2>5. 개인정보 처리의 위탁</h2>
          <table border="1" cellpadding="5">
            <thead>
              <tr>
                <th>수탁자</th>
                <th>위탁업무 내용</th>
                <th>보유 및 이용기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Amazon Web Services</td>
                <td>인프라(서버) 운영</td>
                <td>회원 탈퇴 또는 계약 종료 시까지</td>
              </tr>
              <tr>
                <td>(예: SendGrid)</td>
                <td>이메일 발송 시스템 운영</td>
                <td>동일</td>
              </tr>
            </tbody>
          </table>

          <h2>6. 이용자 및 법정대리인의 권리와 행사 방법</h2>
          <ul>
            <li>개인정보 열람, 정정, 삭제, 처리 정지 요구 가능</li>
            <li>회원 탈퇴 또는 삭제 요청은 [설정] 또는 고객센터 이용</li>
            <li>만 14세 미만 아동은 법정대리인의 동의 필요</li>
          </ul>

          <h2>7. 개인정보의 파기 절차 및 방법</h2>
          <ul>
            <li><strong>파기 절차</strong>: 목적 달성 후 즉시 파기</li>
            <li><strong>파기 방법</strong>:
              <ul>
                <li>전자 파일: 복구 불가능한 방법으로 영구 삭제</li>
                <li>종이 문서: 분쇄 또는 소각</li>
              </ul>
            </li>
          </ul>

          <h2>8. 개인정보 보호를 위한 기술적/관리적 대책</h2>
          <ul>
            <li>개인정보 암호화 저장 및 전송</li>
            <li>접근 제한 및 권한 관리</li>
            <li>보안 프로그램 설치 및 주기적 점검</li>
          </ul>

          <h2>9. 개인정보 보호책임자</h2>
          <ul>
            <li><strong>성명</strong>: 홍길동</li>
            <li><strong>직책</strong>: 개인정보 보호책임자</li>
            <li><strong>연락처</strong>: privacy@digital.guard.com</li>
          </ul>

          <h2>10. 고지의 의무</h2>
          <p>본 개인정보처리방침은 법령 또는 회사 정책에 따라 변경될 수 있으며, 변경 시 사전 공지합니다.</p>
          <p><strong>시행일자</strong>: 2025년 5월 21일</p>
        </div>
        <button class="submit-button" @click="acceptTerms">동의하고 닫기</button>
      </div>
    </div>

    <!-- 확인 모달 -->
    <div v-if="showConfirmation" class="terms-modal">
      <div class="terms-box confirmation-box">
        <h3>회원가입</h3>
        <hr />
        <p>입력하신 정보로 회원가입을 진행하시겠습니까?</p>
        <div class="confirmation-buttons">
          <button class="submit-button" @click="confirmSignup">네</button>
          <button class="submit-button" @click="cancelSignup">아니오</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '', password: '', passwordConfirm: '', name: '', birth: '',
        phone: '', email: '', gender: '', school: '', agree: false,
      },
      isUsernameValid: true,
      isPasswordValid: true,
      isEmailValid: true,
      showTerms: false,
      showConfirmation: false,
    };
  },
  computed: {
    canSubmit() {
      return (
        this.form.username.trim() !== '' &&
        this.isUsernameValid &&
        this.form.password !== '' &&
        this.isPasswordValid &&
        this.form.passwordConfirm !== '' &&
        this.form.password === this.form.passwordConfirm &&
        this.form.agree
      );
    },
  },
  methods: {
    selectGender(gender) {
      this.form.gender = gender;
    },
    genderClass(g) {
      return [
        'gender-button',
        this.form.gender === g ? 'selected' : 'not-selected',
      ];
    },
    validateUsername() {
      const regex = /^[A-Za-z0-9]+$/;
      this.isUsernameValid = regex.test(this.form.username);
    },
    validatePassword() {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_+=~`|:;"'<>,.?/]).{8,}$/;
      this.isPasswordValid = regex.test(this.form.password);
    },
    filterKoreanName() {
      this.form.name = this.form.name.replace(/[^\uAC00-\uD7A3]/g, '');
    },
    filterKoreanSchool() {
      this.form.school = this.form.school.replace(/[^\uAC00-\uD7A3]/g, '');
    },
    filterOnlyNumber(field) {
      this.form[field] = this.form[field].replace(/[^0-9]/g, '').slice(0, field === 'birth' ? 8 : 11);
    },
    validateEmail() {
      const parts = this.form.email.split('@');
      this.isEmailValid = parts.length === 2 && parts[1].trim() !== '';
    },
    openTermsPopup() {
      this.showTerms = true;
    },
    acceptTerms() {
      this.form.agree = true;
      this.showTerms = false;
    },
    openConfirmation() {
      if (this.canSubmit) this.showConfirmation = true;
    },
    confirmSignup() {
      this.showConfirmation = false;
      alert('회원가입이 완료되었습니다.');
    },
    cancelSignup() {
      this.showConfirmation = false;
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
.signup-container {
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
}
.logo-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}
.logo-image {
  height: 24px;
  width: auto;
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
  line-height: 1.5;
  border: 1px solid #1e3a8a;
  box-sizing: border-box;
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
  width: 100%;
  max-width: 340px;
  box-sizing: border-box;
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
  box-sizing: border-box;
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

.confirmation-box h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.confirmation-box hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
}

.confirmation-box p {
  font-size: 15px;
  margin: 0.5rem 0;
}

.confirmation-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

</style>
