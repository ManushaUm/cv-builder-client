export interface AuthUser {
  id: string;
  name: string;
  email: string;
  quota: {
    date: string;
    used: number;
    limit: number;
    remaining: number;
  };
  hasCustomGeminiKey?: boolean;
  hasCustomGroqKey?: boolean;
}

export interface BackendHealth {
  ok: boolean;
  dbConnected: boolean;
  dbError: string | null;
  hasMongoUri: boolean;
  aiConfigured?: {
    gemini: boolean;
    groq: boolean;
    ollamaUrl: string;
  };
}

const TOKEN_KEY = 'rendercv_auth_token';
const USER_KEY = 'rendercv_auth_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function checkBackendHealth(): Promise<BackendHealth> {
  try {
    return await apiFetch('/api/health', { method: 'GET' });
  } catch {
    return {
      ok: false,
      dbConnected: false,
      dbError: 'Backend server unreachable',
      hasMongoUri: false,
    };
  }
}

export async function reconnectMongoDB(): Promise<BackendHealth> {
  return await apiFetch('/api/health/reconnect', { method: 'POST' });
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setAuthSession(res.token, res.user);
  return res;
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthSession(res.token, res.user);
  return res;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await apiFetch('/api/auth/me', { method: 'GET' });
  if (res.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }
  return res.user;
}

export async function fetchUserResumes(): Promise<any[]> {
  const res = await apiFetch('/api/resumes', { method: 'GET' });
  return Array.isArray(res.resumes) ? res.resumes : [];
}

export async function saveResumeToCloud(resume: any, targetJd?: string): Promise<any> {
  const res = await apiFetch('/api/resumes', {
    method: 'POST',
    body: JSON.stringify({ ...resume, targetJd }),
  });
  return res.resume;
}

export async function syncAllResumesToCloud(resumes: any[], targetJd?: string): Promise<any[]> {
  const res = await apiFetch('/api/resumes/sync', {
    method: 'POST',
    body: JSON.stringify({ resumes, targetJd }),
  });
  return Array.isArray(res.resumes) ? res.resumes : [];
}

export async function deleteResumeFromCloud(clientId: string): Promise<void> {
  await apiFetch(`/api/resumes/${encodeURIComponent(clientId)}`, {
    method: 'DELETE',
  });
}

export async function callBackendAiGateway(payload: {
  systemPrompt: string;
  userPrompt: string;
  preferredProvider?: string;
  ollamaModel?: string;
  geminiModel?: string;
  clientGeminiKey?: string;
}): Promise<{
  rawContent: string;
  providerUsed: string;
  quota?: AuthUser['quota'];
}> {
  const res = await apiFetch('/api/ai/tailor', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res.quota) {
    const stored = getStoredUser();
    if (stored) {
      stored.quota = res.quota;
      localStorage.setItem(USER_KEY, JSON.stringify(stored));
    }
  }
  return res;
}
