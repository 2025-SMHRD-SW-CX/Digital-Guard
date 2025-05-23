// src/stores/user.js

/*

예시코드


import { useUserStore } from '@/stores/user'

// 1. Pinia 스토어 인스턴스 가져오기 (setup 함수 안에서 실행)
const user = useUserStore()

// 로그인
user.login({  //supabase에서 가져온값을 넣어줌으로써 로그인처리가된다.
  id: 'user123',
  name: '홍길동',
  nickname: '길동이',
  phone: '010-1234-5678',
  birthday: '1999-01-01',
  totalReward: 1000,
  createdAt: '2024-05-23'
})

// 포인트 직접 설정
user.setPoint(500)

// 포인트 추가
user.addPoint(200)

// 로그아웃(초기화)
user.logout()


*/


import { defineStore } from 'pinia'

/* 로그인 로직 완성 후 아래 초기데이터 쓰기 */
// const DEFAULT_VALUES = {
//     id: null,
//     name: null,
//     nickname: null,
//     phone: null,
//     birthday: null,
//     totalReward: null,
//     createdAt: null
// }


const DEFAULT_VALUES = {
    id: 'abc1234',
    name: '홍길동',
    nickname: '길동쨩',
    phone: '01012345678',
    birthday: '20000101',
    totalReward: 20000,
    createdAt: 20250523
}

export const useUserStore = defineStore('user', {
    state: () => ({ ...DEFAULT_VALUES }),
        getters: {
        isLogined: (state) => !!state.id
    },
    actions: {
        login({ id, name, nickname, phone, birthday, totalReward, createdAt }) {
            this.id = id;
            this.name = name;
            this.nickname = nickname;
            this.phone = phone;
            this.birthday = birthday;
            this.totalReward = totalReward;
            this.createdAt = createdAt;
        },
        logout() {
            // 상태를 기본값으로 리셋
            Object.assign(this, DEFAULT_VALUES)
        },
        setPoint(value) {
            // totalReward 값을 직접 설정
            this.totalReward = value
        },
        addPoint(amount) {
            // totalReward 값을 amount만큼 증가 (숫자 변환 및 null 체크)
            this.totalReward = (Number(this.totalReward) || 0) + Number(amount)
        }
    }
})
