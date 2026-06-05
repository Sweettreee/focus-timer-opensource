import {
  apiFetch,
  setToken,
  clearToken,
  getToken,
} from "../../shared/apiClient";

export async function getCurrentUser() {
  if (!getToken()) return null;
  try {
    const data = await apiFetch("/api/auth/me", { auth: true });
    return data.user ?? null;
  } catch {
    clearToken();
    return null;
  }
}

export async function login({ email, password }) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(data.token);
  return data.user;
}

export async function register({ email, password, nickname }) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: { email, password, nickname },
  });
}

export async function logout() {
  clearToken();
}
