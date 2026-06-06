// React 상태 인프라: Context + useReducer 배선. 전이 규칙은 models/appState에서 가져온다.
import { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./appState";

const AppStoreContext = createContext(null);

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
  if (!ctx) throw new Error("useStore must be used within AppStoreProvider");
  return ctx;
}
