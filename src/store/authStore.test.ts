import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Avoid persisting during test
vi.mock('zustand/middleware', () => {
  return {
    persist: (config: any) => config,
  };
});

describe('authStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set auth and store token in localStorage', () => {
    const mockUser = { id: '1', fullName: 'Test', email: 'test@example.com' } as any;
    
    useAuthStore.getState().setAuth(mockUser, 'mock-token');
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('mock-token');
    expect(state.isAuthenticated).toBe(true);
    expect(window.localStorage.getItem('token')).toBe('mock-token');
  });

  it('should logout and clear localStorage', () => {
    const mockUser = { id: '1', fullName: 'Test', email: 'test@example.com' } as any;
    useAuthStore.getState().setAuth(mockUser, 'mock-token');
    
    useAuthStore.getState().logout();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(window.localStorage.getItem('token')).toBeNull();
  });

  it('should update user fields', () => {
    const mockUser = { id: '1', fullName: 'Test', email: 'test@example.com' } as any;
    useAuthStore.getState().setAuth(mockUser, 'mock-token');
    
    useAuthStore.getState().updateUser({ fullName: 'Updated Name' });
    
    const state = useAuthStore.getState();
    expect(state.user?.fullName).toBe('Updated Name');
    expect(state.user?.email).toBe('test@example.com');
  });
});
