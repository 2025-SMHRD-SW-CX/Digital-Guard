<template>
  <div class="terms-modal">
    <div class="modal">
      <!-- 헤더: prop으로 받은 title이 있을 때만 렌더링 -->
      <div class="title" v-if="title">
        <h3>{{ title }}</h3>
      </div>

      <!-- 본문: 기본 slot으로 대체 가능 -->
      <div class="content">
        <slot>
          <!-- slot에 내용이 없으면 이 문구가 기본으로 나옵니다 -->
          <p>정말 진행하시겠습니까?</p>
        </slot>
      </div>

      <!-- 버튼 영역: named slot, 없을 땐 type에 따라 기본 버튼 렌더링 -->
      <div class="buttons">
        <slot name="buttons">
          <template v-if="type === 'confirm'">
            <button class="submit-button" @click="onConfirm">네</button>
            <button class="cancel-button" @click="onCancel">아니오</button>
          </template>
          <template v-else>
            <button class="submit-button" @click="onConfirm">확인</button>
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'alert',
    validator: (v) => ['alert', 'confirm'].includes(v)
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
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

.modal {
  background: white;
  padding: 1rem;
  border-radius: 0.25rem;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal .title {
  border-bottom: 1px solid $color-lightgrey;
}

.modal .title h3 {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 1.25rem;
}

.modal .content {
  padding: 1rem 0.5rem;
}

.modal .content p {
  margin: 0;
  line-height: 1.4;
}

.modal .buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 0.5rem;
}

.modal .submit-button,
.modal .cancel-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
}

.modal .submit-button {
  background-color: $color-primary;
  color: white;
}

.modal .cancel-button {
  background-color: $color-lightgrey;
  color: $color-text;
}
</style>