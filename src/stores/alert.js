// src/stores/alert.js


/*

[사용 예제]


import { useAlertStore } from '@/stores/alert.js'

function showAlerts() {
  const alertStore = useAlertStore()

  // 2초 뒤 자동 사라지는 info
  alertStore.info('목록에 추가되었습니다', 2000)

  // 3초 뒤 자동 사라지는 success
  alertStore.success('저장 완료!', 3000)

  // duration 없이 호출 → X 버튼으로만 닫힘
  alertStore.warning('이 알림은 수동으로만 닫힙니다')

  // danger, confirm 도 동일하게
  alertStore.danger('에러가 발생했습니다', 4000)
  alertStore.confirm('처리를 진행하시겠습니까?', 0)
}

// 예: 페이지 로드 직후 또는 버튼 클릭 핸들러 등에서 호출
showAlerts()

*/


import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
    const alerts = ref([])

    function _notify(type, message, duration) {
        const id = Date.now() + Math.random()
        const alert = { id, type, message, duration }
        alerts.value.unshift(alert)

        if (typeof duration === 'number' && duration > 0) {
            setTimeout(() => remove(id), duration)
        }
    }

    function info(message, duration)    { _notify('info', message, duration) }
    function success(message, duration) { _notify('success', message, duration) }
    function warning(message, duration) { _notify('warning', message, duration) }
    function danger(message, duration)  { _notify('danger', message, duration) }
    function confirm(message, duration) { _notify('confirm', message, duration) }

    function remove(id) {
        const idx = alerts.value.findIndex(a => a.id === id)
        if (idx !== -1) alerts.value.splice(idx, 1)
    }

    return {
        alerts,
        info,
        success,
        warning,
        danger,
        confirm,
        remove
    }
})