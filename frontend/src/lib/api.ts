import { getAuth } from './auth';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const base = raw?.trim();
  if (!base) {
    throw new ApiError('VITE_API_BASE_URL is not set', 0, null);
  }
  return base.replace(/\/$/, '');
}

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const { token } = getAuth();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...init, headers });
  const data = await readJsonSafe(res);

  if (!res.ok) {
    const message =
      (data as any)?.error ||
      (data as any)?.message ||
      `Request failed (${res.status})`;
    throw new ApiError(String(message), res.status, data);
  }

  return data as T;
}
