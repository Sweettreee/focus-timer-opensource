// 스토어 Provider + 부팅 시 초기 로드
import { useEffect } from "react";
import { AppStoreProvider, useStore } from "./AppStore";
import * as sessionService from "../features/history/sessionService";
import * as taskService from "../features/tasks/taskService";
import * as authService from "../features/auth/authService";

function Bootstrap({ children }) {
  const { dispatch } = useStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 각 service가 토큰 유무로 서버/로컬을 분기한다
      // sessions: 로그인 시 MySQL, 비로그인 시 [] / tasks: 로그인 시 MySQL, 비 로그인 시 localstorage
      const [sessions, tasks, user] = await Promise.all([
        sessionService.list(),
        taskService.list(),
        authService.getCurrentUser(),
      ]);
      if (!cancelled) {
        dispatch({ type: "HYDATE", payload: { sessions, tasks, user } });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return children;
}

export default function AppProviders({ children }) {
  return (
    <AppStoreProvider>
      <Bootstrap>{children}</Bootstrap>
    </AppStoreProvider>
  );
}
