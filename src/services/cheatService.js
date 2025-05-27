import { db } from './supabase'
import { updateUserTotalPoint } from '@/services/pointService'

/**
 * 시연용 치트 함수
 * - userId에 대해, 모든 기록 초기화 후 5일 연속 퀴즈 기록 및 포인트 지급
 * - 교육영상 퀴즈(edu_quiz_participation) 기록도 같이 삭제
 */
export const runCheat = async ({
  userId,
  point,
  reason,
  continuousDays = 5, // 기본값 5일
}) => {
  // 1. 기존 기록 삭제 (point_history, quiz_participation, edu_quiz_participation)
  await db.from('point_history').delete().eq('user_id', userId)
  await db.from('quiz_participation').delete().eq('user_id', userId)
  await db.from('edu_quiz_participation').delete().eq('user_id', userId) // ← 이 줄 추가!

  // 2. 포인트 내역 추가 (치트 1건)
  await db.from('point_history').insert([
    { user_id: userId, point, reason }
  ])

  // 3. user_progress 업데이트
  await db.from('user_progress')
    .update({
      progress_days: continuousDays,
      continuous_days: continuousDays,
      last_participated: null
    })
    .eq('user_id', userId)

  // 4. quiz_participation 5일치 기록 추가
  // (quiz_id는 존재하는 퀴즈 5개를 자동 할당)
  const { data: quizList, error } = await db
    .from('quiz_questions')
    .select('id')
    .order('date', { ascending: true })
    .limit(continuousDays)
  if (error) throw new Error('quiz_questions 목록 조회 실패')

  const today = new Date()
  const participationRows = []
  for (let i = 0; i < continuousDays; i++) {
    // 각 날짜 계산 (오늘 ~ 과거)
    const d = new Date(today)
    d.setDate(d.getDate() - (continuousDays - 1 - i))
    const quiz_date = d.toISOString().split('T')[0]  // yyyy-mm-dd

    participationRows.push({
      user_id: userId,
      quiz_date,
      question_id: quizList[i % quizList.length].id,  // quiz_id 순환 할당
      is_correct: true,
      reward_point: 10,
    })
  }

  await db.from('quiz_participation').insert(participationRows)

  // 5. total point 계산 갱신
  await updateUserTotalPoint(userId)
}

// 사용 예시
// await runCheat({ userId: 'kjh36102', point: 10000, reason: '시연용 치트', continuousDays: 5 })
