// 화면 전환 컨트롤러
import { useCallback } from "react";
import { useStore } from "./AppStore";

export function useNavController() {
  const { dispatch } = useStore();

  const goTo = useCallback(
    (view) => dispatch({ type: "SET_VIEW", payload: view }),
    [dispatch],
  );

  return { goTo };
}
