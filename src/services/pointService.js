import { db } from './supabase'

/**
 * 사용자의 ID를 이용해 point_history 테이블에서 자신의 point 내역 합을 가져온다.
 * 포인트가 변하는 작업 후에 리턴값을 이용해 userStore.total_point를 업데이트 해주면 된다.
 * @param {string} userId 사용자 ID
 */
export const updateUserTotalPoint = async (userId) => {
    /* 
        sum_point_by_user는 supabase에서 직접 쿼리를 날려서 생성한 rpc 함수
    */
    const { data: updated, error } = await db.rpc('update_user_total_point', { uid: userId });

    if (error) {
        console.error('사용자 포인트 집계 에러:', error);
    } else {
        return updated;
    }
}