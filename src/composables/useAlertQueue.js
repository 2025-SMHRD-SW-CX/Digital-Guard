// src/composable/useAlertQueue.js

import { watch } from 'vue'
import { useAlertStore } from '@/stores/alert'

export function useAlertQueue(isLoadingRef) {
  const alertStore = useAlertStore()
  watch(isLoadingRef, (isLoading) => {
    if (!isLoading) {
      alertStore.flushQueue()
    } else {
      alertStore.hold()
    }
  }, { immediate: true })
}
