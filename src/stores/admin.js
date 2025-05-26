import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { db } from '@/services/supabase'

const COOKIE_KEY = 'login_admin_id'
const COOKIE_EXPIRES = 7
const DEFAULT_VALUES = {
    id: null,
    name: null,
    phone: null,
    birthday: null,
    department: null,
    position: null,
    createdAt: null,
}

export const useAdminStore = defineStore('admin', {
    state: () => ({ ...DEFAULT_VALUES, loginChecked: false }),
    getters: {
        isLogined: state => !!state.id,
    },
    actions: {
        /** 로그인 시 id만 쿠키에 저장 */
        async loginWithSupabase(id, pw) {
            const { data, error } = await db
                .from('admin_login_view')   // 어드민 전용 view(테이블명 맞춰서 변경!)
                .select('*')
                .eq('id', id)
                .eq('password', pw)
                .single()
            if (error || !data) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
            this._applyAdminData(data)
            // id만 저장
            Cookies.set(COOKIE_KEY, data.id, { expires: COOKIE_EXPIRES, path: '/' })
            this.loginChecked = true
            return data
        },

        /** 쿠키(id)로 상태 복구 */
        async syncLoginCookieState() {
            const adminId = Cookies.get(COOKIE_KEY)
            if (adminId) {
                const { data, error } = await db
                    .from('admin_login_view')
                    .select('*')
                    .eq('id', adminId)
                    .single()
                if (error || !data) {
                    this.logout()
                } else {
                    this._applyAdminData(data)
                    // 쿠키 기간 갱신
                    Cookies.set(COOKIE_KEY, adminId, { expires: COOKIE_EXPIRES, path: '/' })
                }
            } else {
                this.logout()
            }
            this.loginChecked = true
        },

        logout() {
            Object.assign(this, DEFAULT_VALUES)
            Cookies.remove(COOKIE_KEY, { path: '/' })
            this.loginChecked = true
        },

        /** 내부전용: admin 데이터 할당 */
        _applyAdminData(data) {
            this.id = data['id']
            this.name = data['name']
            this.phone = data['phone']
            this.birthday = data['birthday']
            this.department = data['department']
            this.position = data['position']
            this.createdAt = data['created_at']
        }
    }
})
