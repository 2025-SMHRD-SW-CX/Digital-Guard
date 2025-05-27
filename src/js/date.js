// 날짜 변환 유틸 (js/date.js)

export function toLocalDateTimeString(date) {
  // date: 문자열(KST 기준) 또는 Date 객체
  const d = date ? new Date(date) : new Date();
  // yyyy-mm-dd HH:MM:SS 포맷
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

export function getKSTISOString(date = new Date()) {
  // date: Date 객체 또는 파싱가능한 문자열
  const d = new Date(date);
  // 9시간(=32400000ms) 더함
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString(); // 'YYYY-MM-DDTHH:mm:ss.sssZ' (Z붙지만 시각은 KST임)
}
export function getTimeLeftUntilNextMidnight() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const msLeft = nextMidnight - now;
  const hours = Math.floor(msLeft / (1000 * 60 * 60));
  const mins = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((msLeft % (1000 * 60)) / 1000);
  return { hours, mins, secs };
}

