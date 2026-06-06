// 인증 액션 컨트롤러. 입력 검증은 View에서 끝낸 뒤 호출된다.
// 로그인/로그아웃 시 tasks·sessions를 서버/로컬 기준으로 다시 로드한다.
import { useCallback } from "react";
import { useStore } from "../../app/AppStore";
import * as authService from "./authService";
import * as taskService from "../tasks/taskService";
import * as sessionService from "../history/sessionService";

export function useAuthController() {
  const { dispatch } = useStore();

  // 로그인/로그아웃 후 tasks·sessions를 다시 로드해 디스패치.
  // 각 service가 토큰 유무로 서버/로컬(or 빈 배열)을 분기한다.
  const reloadData = useCallback(async () => {
    const [tasks, sessions] = await Promise.all([
      taskService.list(),
      sessionService.list(),
    ]);
    dispatch({ type: "SET_TASKS", payload: tasks });
    dispatch({ type: "SET_SESSIONS", payload: sessions });
  }, [dispatch]);

  const login = useCallback(
    async (creds) => {
      const user = await authService.login(creds);
      dispatch({ type: "SET_USER", payload: user });
      dispatch({ type: "SET_VIEW", payload: "focus" });
      // 로그인 직후 서버(MySQL) 데이터로 갱신
      await reloadData();
    },
    [dispatch, reloadData],
  );

  const register = useCallback(
    async (creds) => {
      await authService.register(creds);
      dispatch({ type: "SET_VIEW", payload: "login" });
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "SET_VIEW", payload: "login" });
    // 로그아웃 후 재로딩: tasks는 로컬, sessions는 빈 배열(로그인 전용)
    await reloadData();
  }, [dispatch, reloadData]);

  return { login, register, logout };
}
