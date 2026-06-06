// 통계·스트릭 계산 단일 출처 (순수). 헤더와 히스토리가 같은 정의를 공유한다.
import { sessionTimestamp } from "./session";

// 분 → '2h 15m' / '45m' / '0m'
export function formatMinutes(total) {
  if (total <= 0) return "0m";
  if (total < 60) return `${total}m`;
  const hrs = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

// 오늘 집중 시간 + 세션 수
export function computeTodayStats(sessions) {
  const today = new Date().toDateString();
  const todays = sessions.filter(
    (s) => new Date(s.session_date).toDateString() === today,
  );
  const totalMinutes = todays.reduce((acc, s) => acc + s.duration, 0);
  return {
    todayFocus: formatMinutes(totalMinutes),
    sessions: todays.length,
  };
}

// 연속 활동일 중 최장 streak (일 단위). 스트릭 정의는 이 함수 하나로 통일.
export function computeStreak(sessions) {
  const days = new Set(
    sessions.map((s) => new Date(sessionTimestamp(s)).setHours(0, 0, 0, 0)),
  );
  if (days.size === 0) return 0;
  const sorted = [...days].sort((a, b) => a - b);
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] === 86400000) {
      cur += 1;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}
