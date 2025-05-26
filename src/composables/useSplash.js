// src/composable/useSplash.js

import { ref } from 'vue'

export function useSplash(duration = 3000) {
  const isLoading = ref(true)
  function showSplash() {
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, duration)
  }
  return { isLoading, showSplash }
}
