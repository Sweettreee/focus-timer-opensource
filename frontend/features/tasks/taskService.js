// 태스크 영속화 계층. 로그인 상태면 서버(/api/tasks), 아니면 localStorage.
// 모든 함수는 변경 후 "전체 목록"을 반환한다(백엔드 컨트롤러도 동일 계약).
import { KEYS, getJSON, setJSON } from "../../shared/storage";
import { apiFetch, getToken } from "../../shared/apiClient";
import { createTask } from "./task";

export async function list() {
  if (getToken()) {
    const data = await apiFetch("/api/tasks", { auth: true });
    return data.tasks ?? [];
  }
  // 비로그인: localStorage(시드 없이 빈 목록에서 시작)
  return getJSON(KEYS.tasks, []);
}

export async function add(text) {
  if (getToken()) {
    const data = await apiFetch("/api/tasks", {
      method: "POST",
      auth: true,
      body: { text },
    });
    return data.tasks ?? [];
  }
  const next = [...getJSON(KEYS.tasks, []), createTask(text)];
  setJSON(KEYS.tasks, next);
  return next;
}

export async function toggle(id) {
  if (getToken()) {
    const data = await apiFetch(`/api/tasks/${id}/toggle`, {
      method: "PATCH",
      auth: true,
    });
    return data.tasks ?? [];
  }
  const next = getJSON(KEYS.tasks, []).map((t) =>
    t.id === id ? { ...t, checked: !t.checked } : t,
  );
  setJSON(KEYS.tasks, next);
  return next;
}

export async function remove(id) {
  if (getToken()) {
    const data = await apiFetch(`/api/tasks/${id}`, {
      method: "DELETE",
      auth: true,
    });
    return data.tasks ?? [];
  }
  const next = getJSON(KEYS.tasks, []).filter((t) => t.id !== id);
  setJSON(KEYS.tasks, next);
  return next;
}
