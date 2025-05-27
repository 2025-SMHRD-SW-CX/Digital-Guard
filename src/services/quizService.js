// src/services/quizService.js
import { db } from './supabase'
import { getKSTISOString } from '@/js/date';

export const submitQuizAnswer = async (userId, questionId, isCorrect, rewardAmount) => {
  // **KST 기준 시각**
  const kstNow = getKSTISOString();

  const reward = isCorrect ? rewardAmount : 0;

  // 퀴즈 참여 기록 저장 (KST로)
  await db.from('quiz_participation').insert([
    {
      user_id: userId,
      quiz_date: kstNow, // KST 기준으로 저장!
      question_id: questionId,
      is_correct: isCorrect,
      reward_point: reward,
    }
  ]);

  if (isCorrect) {
    // 2. 포인트 내역 저장
    await db.from('point_history').insert([
      {
        user_id: userId,
        point: reward,
        reason: '퀴즈 정답 보상',
      }
    ]);

    // user_progress 갱신
    const { data: progress } = await db
      .from('user_progress')
      .select('last_participated, progress_days, continuous_days')
      .eq('user_id', userId)
      .single();

    const kstDate = new Date(kstNow);
    const lastDate = progress?.last_participated ? new Date(progress.last_participated) : null;
    const yesterday = new Date(kstDate);
    yesterday.setDate(kstDate.getDate() - 1);

    const alreadyToday = lastDate?.toDateString() === kstDate.toDateString();
    const newTotal = alreadyToday ? progress.progress_days : progress.progress_days + 1;
    const newContinuous =
      lastDate?.toDateString() === yesterday.toDateString()
        ? progress.continuous_days + 1
        : 1;

    await db.from('user_progress').update({
      progress_days: newTotal,
      continuous_days: alreadyToday ? progress.continuous_days : newContinuous,
      last_participated: kstNow, // KST 기준으로 저장!
      updated_at: getKSTISOString(),
    }).eq('user_id', userId);
  }
}