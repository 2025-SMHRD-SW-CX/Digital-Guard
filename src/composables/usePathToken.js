// src/composables/usePathToken.js
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function usePathToken() {
  const route = useRoute()
  // ['education','detail'] 같이 /education/detail → ['education','detail']
  const tokens = computed(() => route.path.split('/').filter(Boolean))

  const firstToken = computed(() => tokens.value[0] ?? '')
  const tokenDepth = computed(() => tokens.value.length)

  // 탭 활성화 여부 헬퍼
  const isActive = (tab) => firstToken.value === tab

  return { tokens, firstToken, tokenDepth, isActive }
}
