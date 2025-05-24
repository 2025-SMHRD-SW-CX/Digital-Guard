<template>
  <transition name="backdrop">
    <div v-if="modelValue" class="terms-modal-backdrop" @click.self="onBackdropClick" />
  </transition>
  <transition name="modal-body">
    <div v-if="modelValue" class="modal-body-wrap">
      <div class="modal">
        <div class="title" v-if="title">
          <h3>{{ title }}</h3>
        </div>
        <div class="content">
          <slot>
            <p>정말 진행하시겠습니까?</p>
          </slot>
        </div>
        <div class="buttons" v-if="props.useButton">
          <slot name="buttons">
            <template v-if="type === 'confirm'">
              <button class="submit-button" @click="onConfirm">{{ displayConfirmText }}</button>
              <button class="cancel-button" @click="onCancel">{{ displayCancelText }}</button>
            </template>
            <template v-else>
              <button class="submit-button" @click="onConfirm">{{ displayConfirmText }}</button>
            </template>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: null },
  type: { type: String, default: 'alert', validator: v => ['alert', 'confirm'].includes(v) },
  confirmText: { type: String, default: '' },
  cancelText: { type: String, default: '' },
  useButton: { type: Boolean, default: true },
  backdrop: { type: Boolean, default: true } // ← 추가
})

const emit = defineEmits(['confirm', 'cancel', 'update:modelValue'])

const displayConfirmText = computed(() =>
  props.confirmText || (props.type === 'confirm' ? '네' : '확인')
)
const displayCancelText = computed(() => props.cancelText || '아니오')

function close() {
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm')
  close()
}

function onCancel() {
  emit('cancel')
  close()
}

// 배경 클릭시 props.backdrop이 true일 때만 닫기
function onBackdropClick() {
  if (props.backdrop) onCancel()
}
</script>

<style lang="scss" scoped>
/* backdrop */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.backdrop-enter-to,
.backdrop-leave-from {
  opacity: 1;
}

.terms-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9100;
}

/* modal-body */
.modal-body-enter-active {
  animation: modal-bounce-in 0.65s cubic-bezier(.68, -0.55, .27, 1.5) forwards;
}

.modal-body-leave-active {
  animation: modal-bounce-out 0.23s cubic-bezier(.55, 0, .55, 1) forwards;
}

@keyframes modal-bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.65) translateY(48px);
  }

  38% {
    opacity: 1;
    transform: scale(1.11) translateY(0);
  }

  // 1차 팝!
  66% {
    transform: scale(0.96) translateY(0);
  }

  // 더 길게!
  81% {
    transform: scale(1.05) translateY(0);
  }

  // 2차 팝!
  91% {
    transform: scale(0.98) translateY(0);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-bounce-out {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  100% {
    opacity: 0;
    transform: scale(0.7) translateY(28px);
  }
}

.modal-body-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9110;
  /* backdrop보다 위 */
}

/* modal 본체 스타일 */
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
