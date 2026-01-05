
import { create } from 'zustand';
import { User, UserRole, StripeStatus, KYCStatus } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  updateStripeStatus: (status: StripeStatus) => void;
  updateUser: (data: Partial<User>) => void;
  verifyUser: (isVerified: boolean, status: KYCStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (role: UserRole) => {
    const mockUser: User = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name: role === UserRole.ADMIN ? 'Admin Evelou' : role === UserRole.ORGANIZER ? 'Organizador Teste' : 'Comprador Feliz',
      email: role.toLowerCase() + '@evelou.com',
      role: role,
      avatar: `https://ui-avatars.com/api/?name=${role}&background=random`,
      stripeStatus: role === UserRole.ORGANIZER ? StripeStatus.PENDING : undefined,
      isVerified: role === UserRole.ADMIN, // Admins já nascem verificados
      kycStatus: role === UserRole.ORGANIZER ? 'pending' : 'not_started',
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
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
