// session_date(ISQ) -> 타임스탬프(ms). 달력/정렬 등에서 사용
export function sessionTimestamp(s) {
  // 날짜 문자열을 UTC기준으로 파깅해 Date 객체를 반환함
  return new Date(s.session_date).getTime();
}
