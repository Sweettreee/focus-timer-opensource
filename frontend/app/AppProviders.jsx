// 스토어 Provider + 부팅 시 초기 로드.
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
      // 각 service가 토큰 유무로 서버/로컬을 분기한다.
      // sessions: 로그인 시 MySQL, 비로그인 시 [] / tasks: 로그인 시 MySQL, 비로그인 시 localStorage
      // allSettled: 한 호출이 실패해도(예: 일시적 서버 오류) 나머지 복원은 진행한다.
      // → 토큰이 유효하면 새로고침 후에도 user가 복원되어 로그인 상태가 유지된다.
      const [sessionsR, tasksR, userR] = await Promise.allSettled([
        sessionService.list(),
        taskService.list(),
        authService.getCurrentUser(),
      ]);
      const user = userR.status === "fulfilled" ? userR.value : null;
      const sessions = sessionsR.status === "fulfilled" ? sessionsR.value : [];
      const tasks = tasksR.status === "fulfilled" ? tasksR.value : [];
      if (!cancelled) {
        // view 복원: 로그인 상태면 포커스 룸, 아니면 랜딩(메모리뿐인 view가 새로고침 때마다 초기화되는 문제 보완).
        dispatch({
          type: "HYDRATE",
          payload: { sessions, tasks, user, view: user ? "focus" : "landing" },
        });
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
