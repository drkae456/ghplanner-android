import { useEffect, useMemo, useState, PropsWithChildren, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext } from 'react';
import { AppState } from 'react-native';

import { env } from '../config/env';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  isHydrating: boolean;
  isAuthenticated: boolean;
  tokens?: AuthTokens;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  access: 'GHPLANNER_ACCESS_TOKEN',
  refresh: 'GHPLANNER_REFRESH_TOKEN'
};

async function saveTokens(tokens: AuthTokens) {
  await SecureStore.setItemAsync(STORAGE_KEYS.access, tokens.accessToken);
  await SecureStore.setItemAsync(STORAGE_KEYS.refresh, tokens.refreshToken);
}

async function removeTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.access),
    SecureStore.deleteItemAsync(STORAGE_KEYS.refresh)
  ]);
}

async function loadTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(STORAGE_KEYS.access),
    SecureStore.getItemAsync(STORAGE_KEYS.refresh)
  ]);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [tokens, setTokens] = useState<AuthTokens | undefined>();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadTokens().then((stored) => {
      if (stored) {
        setTokens(stored);
      }
      setHydrated(true);
    });
  }, []);

  const signIn = useCallback(async (credentials: { email: string; password: string }) => {
    const response = await fetch(env.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || 'Failed to sign in');
    }

    const data = (await response.json()) as AuthTokens;
    await saveTokens(data);
    setTokens(data);
  }, []);

  const refreshTokens = useCallback(async () => {
    if (!tokens?.refreshToken) return;

    const response = await fetch(env.auth.refresh, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken })
    });

    if (response.ok) {
      const data = (await response.json()) as AuthTokens;
      await saveTokens(data);
      setTokens(data);
    } else {
      await removeTokens();
      setTokens(undefined);
    }
  }, [tokens?.refreshToken]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: 'active' | 'background' | 'inactive') => {
      if (nextAppState === 'active') {
        refreshTokens().catch(() => {});
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [refreshTokens]);

  const signOut = useCallback(async () => {
    try {
      await fetch(env.auth.revoke, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens?.refreshToken })
      });
    } catch (error) {
      // no-op, still clear local state
    }
    await removeTokens();
    setTokens(undefined);
  }, [tokens?.refreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isHydrating: !hydrated,
      isAuthenticated: Boolean(tokens?.accessToken),
      tokens,
      signIn,
      signOut
    }),
    [hydrated, tokens, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
