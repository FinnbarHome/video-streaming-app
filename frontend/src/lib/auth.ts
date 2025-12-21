export type AuthState = {
  token: string | null;
  userId: string | null;
  username: string | null;
};

const STORAGE_KEYS = {
  token: 'token',
  userId: 'userId',
  username: 'username',
} as const;

export function getAuth(): AuthState {
  return {
    token: localStorage.getItem(STORAGE_KEYS.token),
    userId: localStorage.getItem(STORAGE_KEYS.userId),
    username: localStorage.getItem(STORAGE_KEYS.username),
  };
}

export function setAuth(next: Partial<AuthState>) {
  if (next.token !== undefined) {
    if (next.token) localStorage.setItem(STORAGE_KEYS.token, next.token);
    else localStorage.removeItem(STORAGE_KEYS.token);
  }

  if (next.userId !== undefined) {
    if (next.userId) localStorage.setItem(STORAGE_KEYS.userId, next.userId);
    else localStorage.removeItem(STORAGE_KEYS.userId);
  }

  if (next.username !== undefined) {
    if (next.username)
      localStorage.setItem(STORAGE_KEYS.username, next.username);
    else localStorage.removeItem(STORAGE_KEYS.username);
  }
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.userId);
  localStorage.removeItem(STORAGE_KEYS.username);
}

export function isSignedIn() {
  const { userId } = getAuth();
  return Boolean(userId);
}
