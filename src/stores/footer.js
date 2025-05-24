// src/stores/footer.js
import { defineStore } from 'pinia'

export const useFooterStore = defineStore('footer', {
  state: () => ({
    show: true,
    activeTab: null,   // 푸터 활성 탭 (string)
  }),
  actions: {
    setShow(show) {
      this.show = show
    },
    setActiveTab(tab) {
      this.activeTab = tab
    }
  }
})

// 푸터에 표시할 탭들, 경로 매핑 (원하면 depth 관리도 여기에)
export const FOOTER_MAP = {
  main: 'main',
  education: 'education',
  survey: 'survey',
  shop: 'shop',
  mypage: 'mypage',
  challenge: 'challenge',
  // 필요시 하위 경로도 추가 가능
}
