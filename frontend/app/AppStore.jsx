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
  if (!ctx) throw new Error("useSotre must be used within AppStoreProvider");
  return ctx;
}
