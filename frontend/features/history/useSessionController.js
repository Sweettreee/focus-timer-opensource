// 세션 액션 컨트롤러: 사용자 액션 → Service(서버) → Model 갱신.
// 세션은 로그인 전용 — 비로그인 시 저장하지 않는다.
import { useCallback } from "react";
import { useStore } from "../../app/AppStore";
import { getToken } from "../../shared/apiClient";
import * as sessionService from "./sessionService";

export function useSessionController() {
  const { dispatch } = useStore();

  const addSession = useCallback(
    async ({ duration, memo }) => {
      if (!getToken()) return; // 비로그인: 세션 저장 안 함
      const sessions = await sessionService.add({ duration, memo });
      dispatch({ type: "SET_SESSIONS", payload: sessions });
    },
    [dispatch],
  );

  const deleteSession = useCallback(
    async (id) => {
      const sessions = await sessionService.removeSession(id);
      dispatch({ type: "SET_SESSIONS", payload: sessions });
    },
    [dispatch],
  );

  return { addSession, deleteSession };
}
