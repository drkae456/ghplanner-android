const API_BASE_URL =
  (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env?.EXPO_PUBLIC_API_URL ??
  'http://10.0.2.2:3000/api';

export const env = {
  apiBaseUrl: API_BASE_URL,
  auth: {
    login: `${API_BASE_URL}/mobile/auth/login`,
    refresh: `${API_BASE_URL}/mobile/auth/refresh`,
    revoke: `${API_BASE_URL}/mobile/auth/revoke`
  }
};
