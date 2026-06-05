import { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./appState";

// 어디에서든 사용할 수 있는 전역 창고
const AppStoreContext = createContext(null);

// AppStoreContext안에 둘러쌓인 children은 모두 state, dispatch를 사용가능함
export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useSotre must be used within AppStoreProvider");
  return ctx;
}

// 1. 컴포넌트에서 dispatch 호출
// 2. React가 reducer를 자동실행
// 3. reducer 안에서 case를 찾기
// 4. 반환된 새 객체를 React가 새 state로 저장
// 5. state를 구독 중인 컴포넌트들 리렌더
