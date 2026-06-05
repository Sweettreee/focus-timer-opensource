// frontend/app/appState.js
// 앱 상태의 순수 Model: 초기 상태 + 전이 규칙(reducer). React 의존 없음.

export const initialState = {
  user: null,
  sessions: [],
  tasks: [],
  view: 'landing', // 앱의 첫 화면을 'landing'으로 설정 (기존: 'focus')
};

export function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    default:
      return state;
  }
}