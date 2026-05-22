import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authService } from '../services/endpoints';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  register: (
    fullName: string,
    email: string,
    password: string,
    dob?: string,
    gender?: string,
    mobileNumber?: string,
    panCard?: string
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (updatedUser) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null,
      })),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      register: async (fullName, email, password, dob, gender, mobileNumber, _panCard) => {
        const { data } = await authService.register(
          fullName,
          email,
          password,
          dob || '',
          gender,
          mobileNumber
        );
        const result = data.data;
        if (result?.session?.accessToken) {
          localStorage.setItem('token', result.session.accessToken);
          set({
            user: result.user,
            token: result.session.accessToken,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
