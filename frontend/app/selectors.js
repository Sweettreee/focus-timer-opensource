import { useStore } from "./AppStore";
import { computeTodayStats, computeStreak } from "../features/history/stats";

export function useUser() {
  return useStore().state.user;
}

export function useView() {
  return useStore().state.view;
}

export function useSessions() {
  return useStore().state.sessions;
}

export function useTasks() {
  return useStore().state.tasks;
}

// 세션에서 파생되는 통계(오늘 집중/세션 수/스트릭) - 헤더와 히스토리가 공유
export function useStats() {
  const { sessions } = useStore().state;
  return {
    ...computeTodayStats(sessions),
    streak: computeStreak(sessions),
  };
}
