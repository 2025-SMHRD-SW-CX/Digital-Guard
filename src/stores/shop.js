// src/stores/shop.js
import { defineStore } from 'pinia'

export const ITEMS = [
    {
        id: 31,
        image: '/images/cu3000.webp',
        brand: 'CU',
        name: '모바일 상품권 3천원권',
        price: 2700,
        discount: 10,
        route: 'cu3000',
        liked: false
    },
    {
        id: 32,
        image: '/images/컴포즈아메.webp',
        brand: '컴포즈커피',
        name: '아메리카노',
        price: 1600,
        discount: 10,
        route: 'compose',
        liked: false
    },
    {
        id: 1,
        image: '/images/올리브영.png',
        brand: '올리브영',
        name: '기프티콘 2만원권',
        price: 18000,
        discount: 10,
        route: 'Olive',
        liked: false,

    },
    {
        id: 2,
        image: '/images/메가커피.webp',
        brand: '메가커피',
        name: '기프티콘 5천원권',
        price: 4500,
        discount: 10,
        liked: false
    },
    {
        id: 3,
        image: '/images/컴포즈 커피.webp',
        brand: '컴포즈커피',
        name: '기프티콘 5천원권',
        price: 4500,
        discount: 10,
        liked: false
    },
    {
        id: 4,
        image: '/images/맘스터치.webp',
        brand: '맘스터치',
        name: '싸이버거 세트',
        price: 7300,
        discount: 10,
        liked: false
    },
    {
        id: 5,
        image: '/images/배달의 민족.webp',
        brand: '배달의민족',
        name: '기프티콘 2만원권',
        price: 18000,
        discount: 10,
        liked: false
    },
    {
        id: 6,
        image: '/images/베라.png',
        brand: '베스킨라빈스',
        name: '파인트아이스크림',
        price: 8800,
        discount: 10,
        liked: false
    },
    {
        id: 7,
        image: '/images/설빙.webp',
        brand: '설빙',
        name: '인절미설빙',
        price: 8800,
        discount: 10,
        liked: false
    },
    {
        id: 8,
        image: '/images/신박한패션템.webp',
        brand: '신박한패션템',
        name: '미니카세트키링',
        price: 7100,
        discount: 10,
        liked: false
    },
    {
        id: 9,
        image: '/images/스벅아2카스테라.webp',
        brand: '스타벅스',
        name: '아메리카노2잔+생크림카스텔라',
        price: 12500,
        discount: 10,
        liked: false
    },
    {
        id: 10,
        image: '/images/메가리카노.webp',
        brand: '메가커피',
        name: '아이스아메리카노',
        price: 1800,
        discount: 10,
        liked: false
    },
    {
        id: 11,
        image: '/images/초코에몽.webp',
        brand: 'GS25',
        name: '초코에몽',
        price: 1400,
        discount: 10,
        liked: false
    },
    {
        id: 12,
        image: '/images/바나나우유.webp',
        brand: 'CU',
        name: '빙그레)바나나우유',
        price: 1600,
        discount: 10,
        liked: false
    },
    {
        id: 13,
        image: '/images/소프트콘.webp',
        brand: '롯데리아',
        name: '소프트콘',
        price: 1200,
        discount: 10,
        liked: false
    },
    {
        id: 14,
        image: '/images/파베초콜릿케이크.webp',
        brand: '투썸플레이스',
        name: '파베초콜릿케이크(쁘띠)',
        price: 7900,
        discount: 10,
        liked: false
    },
    {
        id: 15,
        image: '/images/춘식이우유.webp',
        brand: 'GS25',
        name: '춘식이초코우유',
        price: 1650,
        discount: 10,
        liked: false
    },
    {
        id: 16,
        image: '/images/CU2000.webp',
        brand: 'CU',
        name: '모바일 상품권 2천원권',
        price: 1800,
        discount: 10,
        liked: false
    },
    {
        id: 17,
        image: '/images/GS255천원.webp',
        brand: 'GS25',
        name: '모바일 상품권 5천원권',
        price: 4500,
        discount: 10,
        liked: false
    },
    {
        id: 18,
        image: '/images/초코송이.webp',
        brand: '세븐일레븐',
        name: '초코송이',
        price: 900,
        discount: 10,
        liked: false
    },
    {
        id: 19,
        image: '/images/아이스모찌.webp',
        brand: '베스킨라빈스',
        name: '아이스모찌(스트로베리)',
        price: 2950,
        discount: 10,
        liked: false
    },
    {
        id: 20,
        image: '/images/꿀수박주스.webp',
        brand: '메가커피',
        name: '꿀수박주스',
        price: 3600,
        discount: 10,
        liked: false
    },
    {
        id: 21,
        image: '/images/말랑카피바라.webp',
        brand: '아이데이지',
        name: '말랑몰랑 카피바라',
        price: 4400,
        discount: 10,
        liked: false
    },
    {
        id: 22,
        image: '/images/떠먹는아박.webp',
        brand: '투썸플레이스',
        name: '떠먹는아박',
        price: 6100,
        discount: 10,
        liked: false
    },
    {
        id: 23,
        image: '/images/돌인형.webp',
        brand: '데데리트',
        name: '진지한돌멩이인형',
        price: 8000,
        discount: 10,
        liked: false
    },
    {
        id: 24,
        image: '/images/세계문학전집.webp',
        brand: '예스24',
        name: '세계문학전집32',
        price: 12800,
        discount: 10,
        liked: false
    },
    {
        id: 25,
        image: '/images/애플망고치즈설빙.webp',
        brand: '설빙',
        name: '애플망고치즈설빙',
        price: 13000,
        discount: 10,
        liked: false
    },
    {
        id: 26,
        image: '/images/물범바디플로우.webp',
        brand: '루시아이',
        name: '뱃살물범 바디플로우',
        price: 14100,
        discount: 10,
        liked: false
    },
    {
        id: 27,
        image: '/images/딸기크림떡.webp',
        brand: '청년떡집',
        name: '딸기크림떡',
        price: 15200,
        discount: 10,
        liked: false
    },
    {
        id: 28,
        image: '/images/고추바사삭.webp',
        brand: '굽네치킨',
        name: '고추바사삭+콜라1.25L',
        price: 18000,
        discount: 10,
        liked: false
    },
    {
        id: 29,
        image: '/images/교촌허니콤보.webp',
        brand: '교촌치킨',
        name: '허니콤보+콜라1.25L',
        price: 18000,
        discount: 10,
        liked: false
    },
    {
        id: 30,
        image: '/images/이미스캡.webp',
        brand: '이미스',
        name: 'EMIS TONE ON TONE WAPPEN BALL CAP 11종',
        price: 44100,
        discount: 10,
        liked: false
    },
    {
        id: 33,
        image: '/images/스타벅스.webp',
        brand: '스타벅스',
        name: '스타벅스 2만원권',
        price: 18000,
        discount: 10,
        liked: false
    },

]

export const useShopStore = defineStore('shop', {
  state: () => ({
    cart: [],
    wish: [],
    selectedCartIds: [], // ✅ 선택된 장바구니 항목의 id 저장
    orderInfo: {},
    orderItems: [],
  }),

})
