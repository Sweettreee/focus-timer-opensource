// 태스크 액션 컨트롤러. service가 서버/로컬을 분기하고 최신 전체 목록을 반환한다.
import { useCallback } from "react";
import { useStore } from "../../app/AppStore";
import * as taskService from "./taskService";

export function useTaskController() {
  const { dispatch } = useStore();

  const apply = useCallback(
    async (listPromise) => {
      const tasks = await listPromise;
      dispatch({ type: "SET_TASKS", payload: tasks });
    },
    [dispatch],
  );

  const addTask = useCallback(
    (text) => {
      if (!text.trim()) return;
      return apply(taskService.add(text.trim()));
    },
    [apply],
  );

  const toggleTask = useCallback(
    (id) => apply(taskService.toggle(id)),
    [apply],
  );
  const deleteTask = useCallback(
    (id) => apply(taskService.remove(id)),
    [apply],
  );

  return { addTask, toggleTask, deleteTask };
}
