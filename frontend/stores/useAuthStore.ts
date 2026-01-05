
import { create } from 'zustand';
import { User, UserRole, StripeStatus, KYCStatus } from '../types';
import { authService, LoginRequest, RegisterRequest } from '../src/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateStripeStatus: (status: StripeStatus) => void;
  updateUser: (data: Partial<User>) => void;
  verifyUser: (isVerified: boolean, status: KYCStatus) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erro ao fazer login', 
        isLoading: false,
        isAuthenticated: false 
      });
      throw error;
    }
  },
  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erro ao registrar', 
        isLoading: false,
        isAuthenticated: false 
      });
      throw error;
    }
  },
  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      set({ user: null, isAuthenticated: false, error: null });
    }
  },
  checkAuth: async () => {
    const token = authService.getToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      // Token inválido, limpar estado
      localStorage.removeItem('auth_token');
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
    }
  },
  updateStripeStatus: (status: StripeStatus) => 
    set((state) => ({
      user: state.user ? { ...state.user, stripeStatus: status } : null
    })),
  updateUser: (data: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null
    })),
  verifyUser: (isVerified: boolean, status: KYCStatus) =>
    set((state) => ({
      user: state.user ? { 
        ...state.user, 
        isVerified, 
        kycStatus: status,
        verificationDate: isVerified ? new Date().toISOString() : undefined 
      } : null
    })),
}));
