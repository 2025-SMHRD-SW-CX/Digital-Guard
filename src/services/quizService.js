// src/services/quizService.js
import { db } from './supabase'

export const submitQuizAnswer = async (userId, questionId, isCorrect, rewardAmount) => {
  const today = new Date().toISOString().slice(0, 10)
  const reward = isCorrect ? rewardAmount : 0

  // 퀴즈 참여 기록 저장
  await db.from('quiz_participation').insert([
    {
      user_id: userId,
      quiz_date: today,
      question_id: questionId,
      is_correct: isCorrect,
      reward_point: reward,
    }
  ])

  if (isCorrect) {
    // 2. 포인트 내역 저장
    await db.from('point_history').insert([
      {
        user_id: userId,
        point: reward,
        reason: '퀴즈 정답 보상',
      }
    ])

    //  user_progress 갱신
    const { data: progress } = await db
      .from('user_progress')
      .select('last_participated, progress_days, continuous_days')
      .eq('user_id', userId)
      .single()

    const todayDate = new Date(today)
    const lastDate = progress?.last_participated ? new Date(progress.last_participated) : null
    const yesterday = new Date(todayDate)
    yesterday.setDate(todayDate.getDate() - 1)

    const alreadyToday = lastDate?.toDateString() === todayDate.toDateString()
    const newTotal = alreadyToday ? progress.progress_days : progress.progress_days + 1
    const newContinuous =
      lastDate?.toDateString() === yesterday.toDateString()
        ? progress.continuous_days + 1
        : 1

    await db.from('user_progress').update({
      progress_days: newTotal,
      continuous_days: alreadyToday ? progress.continuous_days : newContinuous,
      last_participated: today,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId)
  }

}