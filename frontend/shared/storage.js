// localStorage 접근을 한곳에서 관리하는 저수준 래퍼
// 비로그인 모드의 할 일 목록 저장에만 사용한다.

export const KEYS = {
  tasks: "focus_room_tasks",
};

export function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 실패(용량 초과는 무시
  }
}
