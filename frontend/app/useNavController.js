// 화면 전환 컨트롤러. prop drilling 대신 사용.
import { useCallback } from "react";
import { useStore } from "./AppStore";

export function useNavController() {
  const { dispatch } = useStore(); // useStore에서 dispatch만을 가져와 저장함

  // 바뀐 페이지에 맞게 dispatch를 해서, goTo에 담아 반환함
  const goTo = useCallback(
    (view) => dispatch({ type: "SET_VIEW", payload: view }),
    [dispatch],
  );

  return { goTo };
}
