import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { useUserStore } from '@/stores/user'
import { useAdminStore } from '@/stores/admin'
import { useAlertStore } from '@/stores/alert'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ───────────── 권한별 경로 분리 ──────────────
// 일반 회원만 접근 가능한 주요 서비스
const USER_NEED_LOGIN_TOKENS = ['main', 'shop', 'survey', 'education', 'mypage', 'challenge']
// 관리자 전용 페이지 (모든 /admin 경로)
const ADMIN_NEED_LOGIN_TOKENS = ['admin'] // (firstToken 기준)

// 로그인된 일반 유저가 접근 불가한 경로
const BLOCKED_FOR_LOGGED_IN = [
  '/', '/login', '/findUserId', '/findUserPw'
]
// 로그인된 관리자가 접근 불가한 경로
const ADMIN_BLOCKED_FOR_LOGGED_IN = [
  '/admin/login'
]

// ───────────── 라우터 가드 ──────────────
router.beforeEach(async (to, from, next) => {
  const tokens = to.path.split('/').filter(Boolean)
  const firstToken = tokens[0] ?? ''
  const userStore = useUserStore()
  const adminStore = useAdminStore()
  const alertStore = useAlertStore()

  // 1. 일반유저 세션 복구
  if (!userStore.loginChecked) {
    await userStore.syncLoginCookieState()
  }
  // 2. 관리자 세션 복구
  if (!adminStore.loginChecked) {
    await adminStore.syncLoginCookieState()
  }

  // 3. 관리자 로그인 상태로 /admin/login 접근 → /admin/main 이동
  if (adminStore.isLogined && ADMIN_BLOCKED_FOR_LOGGED_IN.includes(to.path.split('?')[0])) {
    return next('/admin/main')
  }

  // 4. 일반 로그인 상태로 BLOCKED_FOR_LOGGED_IN 접근 → /main 이동
  if (userStore.isLogined && BLOCKED_FOR_LOGGED_IN.includes(to.path.split('?')[0])) {
    return next('/main')
  }

  // 5. 일반유저 로그인 필요한 페이지(관리자/비로그인 접근 불가)
  if (
    USER_NEED_LOGIN_TOKENS.includes(firstToken) &&
    (!userStore.isLogined || adminStore.isLogined)
  ) {
    alertStore.danger('로그인 후 이용 가능합니다.', 3000)
    return next('/login')
  }

  // 6. 관리자 로그인 필요한 페이지(일반유저/비로그인 접근 불가)
  if (
    ADMIN_NEED_LOGIN_TOKENS.includes(firstToken) &&
    !adminStore.isLogined
  ) {
    alertStore.danger('로그인 후 이용 가능합니다.', 3000)
    return next('/admin/login')
  }

  // 7. 그 외는 허용
  next()
})

export default router
