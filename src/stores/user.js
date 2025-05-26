// src/stores/user.js
// 원래 주현 코드

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
    createdAt: 20250523,
    totalNeedDays: 7,
    progressDays: 5,
    continuousDays: 5,
    // 어제 날짜로 설정
    lastParticipate: new Date(Date.now() - 24 * 60 * 60 * 1000)
}

export const useUserStore = defineStore('user', {
    state: () => ({ ...DEFAULT_VALUES }),
    getters: {
        isLogined: (state) => !!state.id,
        // 오늘 참여했는지 여부
        isParticipatedToday: (state) => {
            const last = new Date(state.lastParticipate)
            const today = new Date()
            return (
                last.getFullYear() === today.getFullYear() &&
                last.getMonth() === today.getMonth() &&
                last.getDate() === today.getDate()
            )
        }
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
        },
        // 참여 기록 처리: 연속참여 계산, progressDays 증가, lastParticipate 갱신
        recordParticipation() {
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            const last = new Date(this.lastParticipate)
            const wasYesterday =
                last.getFullYear() === yesterday.getFullYear() &&
                last.getMonth() === yesterday.getMonth() &&
                last.getDate() === yesterday.getDate()

            // 연속참여: 어제가 참여일이면 +1, 아니면 1로 리셋
            this.continuousDays = wasYesterday ? this.continuousDays + 1 : 1

            // 전체 진행일수 증가
            this.progressDays++

            // 오늘 날짜로 갱신
            this.lastParticipate = today
        },
        calcContinuousBonus(todayReward) {
            const threshold = 1.0;
            let progressDays = (this.isParticipatedToday) ? this.progressDays - 1 : this.progressDays;
            const progressPct = progressDays / this.totalNeedDays;
            return Math.round(todayReward * progressPct) * threshold;
        }

        // 5d/7d * 10p = 7p  -> 10 + 7 = 17
    }
})
