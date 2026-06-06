// 태스크 도메인 모델 (순수).
// 비로그인(localStorage) 모드에서 새 태스크를 만들 때 사용. 로그인 시엔 서버가 id를 부여한다.

export function createTask(text) {
  return {
    id: Date.now(),
    text: text.trim(),
    checked: false,
  };
}
