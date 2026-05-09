import { users } from '../data/mockData';
import { AuthUser, UserRole } from '../models/ui_types/user';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LoginParams {
  email: string;
  password?: string;
}

export interface RegisterParams {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
}

export const authService = {
  login: async ({ email, password }: LoginParams): Promise<AuthUser> => {
    await delay(1000);
    const foundUser = users.find(u => u.email === email && (u.password === password || !password));
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    return {
      id: foundUser.id,
      name: foundUser.fullName,
      email: foundUser.email,
      role: foundUser.role as UserRole,
    };
  },

  register: async (params: RegisterParams): Promise<AuthUser> => {
    await delay(1500);
    // Simulate server creating a user
    return {
      id: `u${Math.floor(Math.random() * 1000)}`,
      name: params.fullName,
      email: params.email,
      role: 'Customer',
    };
  },

  resetPassword: async (email: string): Promise<void> => {
    await delay(1200);
    console.log('Reset link sent to:', email);
  },

  confirmResetPassword: async (password: string, confirmPassword: string, token: string): Promise<void> => {
    await delay(1500);
    if (password !== confirmPassword) throw new Error('Passwords do not match');
    console.log('Password reset successfully for token:', token);
  },

  verifyEmail: async (token: string): Promise<void> => {
    await delay(1000);
    console.log('Email verified successfully with token:', token);
  },

  changePassword: async (oldPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
    await delay(1200);
    if (newPassword !== confirmPassword) throw new Error('New passwords do not match');
    console.log('Password changed successfully');
  }
};
