<!-- src/components/InputField.vue -->
<template>
    <div class="input-field" :class="{ error: props.error || validationResult === false, focus: isFocused }">
        <label v-if="label" class="input-label">{{ label }}</label>
        <div class="input-wrapper">
            <input ref="inputEl" :type="type" :placeholder="placeholder" class="input" :value="modelValue"
                :readonly="readOnly" @input="$emit('update:modelValue', $event.target.value)" @focus="isFocused = true"
                @blur="isFocused = false" @keydown.enter="$emit('enter')" :autocomplete="autocomplete" />
            <slot name="right"></slot>
        </div>
        <transition name="fade">
            <div v-if="showMessage" class="input-message" :class="messageClass">
                {{ messageText }}
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
const props = defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    type: { type: String, default: 'text' },
    errorMessage: String,
    validMessage: String,
    autocomplete: { type: String, default: 'off' },
    validator: Function,   // 🎯 추가
    error: Boolean,
    readOnly: { type: Boolean, default: false },
    externalError: String, // 명시적 에러
    externalValid: String, // 명시적 성공
})
const isFocused = ref(false)
const inputEl = ref(null)

const validationResult = computed(() => {
    // validator가 있으면, modelValue를 인자로 전달해서 결과 true/false/undefined
    if (typeof props.validator === 'function') {
        return props.validator(props.modelValue)
    }
    return undefined
})

const showMessage = computed(() =>
    props.externalError ||
    props.externalValid ||
    (validationResult.value === false && props.errorMessage) ||
    (validationResult.value === true && props.validMessage)
)
const messageText = computed(() =>
    props.externalError ? props.externalError
        : props.externalValid ? props.externalValid
            : validationResult.value === false ? props.errorMessage
                : validationResult.value === true ? props.validMessage
                    : ''
)

const messageClass = computed(() => {
    if (props.externalError) return 'input-message-error'
    if (props.externalValid) return 'input-message-valid'
    if (validationResult.value === false) return 'input-message-error'
    if (validationResult.value === true) return 'input-message-valid'
    return ''
})

defineExpose({ inputEl })
</script>

<style lang="scss" scoped>
.input-field {
    width: 100%;
    margin-bottom: 0.25rem;

    .input-label {
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 0.4em;
        color: #1e3a8a;
        display: block;
    }

    .input-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
    }

    .input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1.5px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
        transition:
            border-color 0.25s,
            box-shadow 0.25s;
        outline: none;
        background: white;

        // input 애니메이션
        &:focus {
            border-color: #1e3a8a;
            box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.08);
        }

        &::placeholder {
            color: #bbb;
            opacity: 1;
            transition: color 0.25s;
        }

        &:focus::placeholder {
            color: #ddd;
        }
    }

    &.error .input {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.08);
    }

    &.focus .input:not(.error) {
        border-color: #1e3a8a;
        box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.10);
    }

    .input-message {
        text-align: left;
        font-size: 13px;
        margin-top: 3px;
        min-height: 1.5em;

        &-error {
            color: #ef4444;
        }

        &-valid {
            color: #1e3a8a;
        }
    }

}

// 부드러운 페이드 인/아웃
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.18s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
