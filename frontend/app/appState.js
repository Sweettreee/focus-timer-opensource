// 앱 상태의 순수 Model: 초기 상태 + 전이 규칙(reducer). React 의존 없음.

export const initialState = {
  user: null,
  sessions: [],
  tasks: [],
  //첫 화면 랜딩페이지로
  view: 'landing',
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
