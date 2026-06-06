// 앱 상태의 초기 상태 및 AppStore에서 사용할 함수들 정의
export const initialState = {
  user: null,
  sessions: [],
  tasks: [],
  view: "focus", // 'focus' | 'history' | 'login' | 'register'
  // 추후에 landing page로 변경 예정
};

// 초기 상태 이후에는 reducer에서 반환한 값이 state가 된다.
export function reducer(state, action) {
  switch (action.type) {
    case "HYDATE":
      return { ...state, ...action.payload };
    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    default:
      return state;
  }
}
