import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { db } from '@/services/supabase'
import bcrypt from 'bcryptjs'
import { getTimeLeftUntilNextMidnight, toLocalDateTimeString } from '@/js/date'

const COOKIE_KEY = 'login_user_id';
const COOKIE_EXPIRES = 7;
const DEFAULT_VALUES = {
    id: null,
    name: null,
    nickname: null,
    phone: null,
    birthday: null,
    total_point: null,
    createdAt: null,
    totalNeedDays: 7, //꼭 챌린지가 계속 7일이 아니라 더 큰 챌린지를 참여하는 식으로 확장이 가능할 여지가 있으니 고정값으로 조정
    progressDays: null,
    continuousDays: null,
    lastParticipate: null
}

export const useUserStore = defineStore('user', {
    state: () => ({ ...DEFAULT_VALUES }),
    getters: {
        isLogined: state => !!state.id,
        isParticipatedToday: (state) => {
            const last = state.lastParticipate;
            if (!last) return false;

            // 이제는 변환 필요 없음!
            const lastStr = toLocalDateTimeString(last).slice(0, 10);
            const todayStr = toLocalDateTimeString().slice(0, 10);

            // 남은 시간도 기존 함수 그대로 사용
            const left = getTimeLeftUntilNextMidnight();
            console.log(`[isParticipatedToday] 다음날 0시까지 남은 시간: ${left.hours}시간 ${left.mins}분 ${left.secs}초`);

            return lastStr === todayStr;
        },



    },
    actions: {
        /** 로그인 시(비번 확인 등), id만 쿠키에 저장 */
        async loginWithSupabase(id, pw) {
            const { data, error } = await db
                .from('login_view')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');

            // bcryptjs로 비교!
            const isValid = bcrypt.compareSync(pw, data.password)
            if (!isValid) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')

            this._applyUserData(data)
            Cookies.set(COOKIE_KEY, data.id, { expires: 7, path: '/' })
            return data
        },

        /** [중요] id로만 상태 복구: 쿠키(id) → supabase 재조회 → 로그인 상태 세팅 */
        async syncLoginCookieState() {
            const userId = Cookies.get(COOKIE_KEY)
            if (userId) {
                const { data, error } = await db
                    .from('login_view')
                    .select('*')
                    .eq('id', userId)
                    .single()
                if (error || !data) {
                    this.logout()
                } else {
                    this._applyUserData(data)
                    // ✅ 쿠키 기간 갱신 (값 똑같이 set하면 만료만 새로 설정됨)
                    Cookies.set(COOKIE_KEY, userId, { expires: COOKIE_EXPIRES, path: '/' })
                }
            } else {
                this.logout()
            }
        },

        logout() {
            Object.assign(this, DEFAULT_VALUES)
            Cookies.remove(COOKIE_KEY, { path: '/' })
        },

        /** 내부 전용: user 데이터 store에 할당 */
        _applyUserData(data) {
            this.id = data['id']
            this.name = data['name']
            this.nickname = data['nickname']
            this.phone = data['phone']
            this.birthday = data['birthday']
            this.total_point = data['total_point']
            this.createdAt = data['created_at']
            this.progressDays = data['progress_days']
            this.continuousDays = data['continuous_days']
            this.lastParticipate = data['last_participated']

            console.log("User Data: ", data)
        },
        calcContinuousBonus(todayReward) {
            const threshold = 1.0;
            let progressDays = (this.isParticipatedToday) ? this.progressDays - 1 : this.progressDays;
            const progressPct = progressDays / this.totalNeedDays;
            return Math.round(todayReward * progressPct) * threshold;
        },
        recordParticipation() {
            // 오늘을 'UTC 기준' yyyy-mm-dd로!
            const todayUtcStr = new Date().toISOString().slice(0, 10); // '2024-05-29'

            const lastDateStr = typeof this.lastParticipate === 'string'
                ? this.lastParticipate.slice(0, 10)
                : new Date(this.lastParticipate).toISOString().slice(0, 10);

            // 어제가 UTC 기준으로 뭐였는지 구함
            const today = new Date(todayUtcStr); // 오늘(UTC 0시)
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().slice(0, 10);

            const wasYesterday = lastDateStr === yesterdayStr;

            // 연속참여: 어제가 참여일이면 +1, 아니면 1로 리셋
            this.continuousDays = wasYesterday ? this.continuousDays + 1 : 1;

            // 전체 진행일수 증가
            this.progressDays++;

            // 마지막 참여일을 UTC 기준 yyyy-mm-dd로 기록
            this.lastParticipate = todayUtcStr;  // 또는 DB에 insert/update 시 직접 todayUtcStr 넘기기
        },

        setPoint(value) {
            // total_point 값을 직접 설정
            this.total_point = value
        },
        addPoint(amount) {
            // total_point 값을 amount만큼 증가 (숫자 변환 및 null 체크)
            this.total_point = (Number(this.total_point) || 0) + Number(amount)
        },
    }
})
