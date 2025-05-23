// src/stores/header.js
import { defineStore } from 'pinia'

export const useHeaderStore = defineStore('header', {
    state: () => ({
        show: true,
        title: null,
        backUrl: null,
    }),
    actions: {
        setTitle(title, backUrl = null) {
            this.title = title;
            this.backUrl = backUrl;
        },
        setShow(show) {
            this.show = show;
        }
    }
})

export const TITLE_MAP = {
    mainView: '',         // 헤더 숨김
    shop: '포인트샵',
    rshop: '상품 상세',
    survey: '설문',
    education: '교육',
    mypage: '마이페이지',
};
