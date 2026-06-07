// 세션 도메인 모델 (순수). UI 의존 없음.
// 정본(canonical) 세션 형태: { id, duration(분), session_date(ISO), memo }
// id와 session_date는 서버(MySQL)가 부여한다.

// session_date(ISO) → 타임스탬프(ms). 달력/정렬 등에서 사용.
export function sessionTimestamp(s) {
  return new Date(s.session_date).getTime();
}
