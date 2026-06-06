// session_date(ISO) → 타임스탬프(ms). 달력/정렬 등에서 사용.
export function sessionTimestamp(s) {
  return new Date(s.session_date).getTime();
}
