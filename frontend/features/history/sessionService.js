// 세션 영속화 계층 — 로그인 전용. 단일 진실 공급원은 MySQL이다.
// 비로그인(토큰 없음)이면 세션은 저장/조회되지 않는다(빈 배열).
import { apiFetch, getToken } from "../../shared/apiClient";

export async function list() {
  if (!getToken()) return [];
  const data = await apiFetch("/api/history", { auth: true });
  return data.sessions ?? [];
}

export async function add({ duration, memo }) {
  // 비로그인 시 세션은 저장하지 않음
  if (!getToken()) return [];
  const data = await apiFetch("/api/history", {
    method: "POST",
    auth: true,
    body: { duration, memo: memo ?? null },
  });
  return data.sessions ?? [];
}

export async function removeSession(id) {
  if (!getToken()) return [];
  const data = await apiFetch(`/api/history/${id}`, {
    method: "DELETE",
    auth: true,
  });
  return data.sessions ?? [];
}
