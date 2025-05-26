// src/services/quizService.js
import { db } from './supabase'

export const submitQuizAnswer = async (userId, questionId, isCorrect) => {
  const today = new Date().toISOString().slice(0, 10)
  const reward = isCorrect ? 17 : 0

  // 1. 퀴즈 참여 기록 저장
  await db.from('quiz_participation').insert([
    {
      user_id: userId,
      quiz_date: today,
      question_id: questionId,
      is_correct: isCorrect,
      reward_point: reward,
    }
  ])

  // 2. 포인트 내역 저장
  await db.from('point_history').insert([
    {
      user_id: userId,
      point: reward,
      reason: isCorrect ? '퀴즈 정답 보상' : '퀴즈 오답',
    }
  ])

  // 3. total_reward 업데이트
  const { data: userData } = await db.from('user').select('total_reward').eq('id', userId).single()
  if (userData) {
    await db.from('user')
      .update({ total_reward: userData.total_reward + reward })
      .eq('id', userId)
  }

  // 4. user_progress 갱신
  const { data: progress } = await db
    .from('user_progress')
    .select('last_participated, total_days, continuous_days')
    .eq('user_id', userId)
    .single()

  const todayDate = new Date(today)
  const lastDate = progress?.last_participated ? new Date(progress.last_participated) : null
  const yesterday = new Date(todayDate)
  yesterday.setDate(todayDate.getDate() - 1)

  const alreadyToday = lastDate?.toDateString() === todayDate.toDateString()
  const newTotal = alreadyToday ? progress.total_days : progress.total_days + 1
  const newContinuous =
    lastDate?.toDateString() === yesterday.toDateString()
      ? progress.continuous_days + 1
      : 1

  await db.from('user_progress').update({
    total_days: newTotal,
    continuous_days: alreadyToday ? progress.continuous_days : newContinuous,
    last_participated: today,
    updated_at: new Date().toISOString(),
  }).eq('user_id', userId)
}
