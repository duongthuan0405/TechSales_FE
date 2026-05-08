export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

export type UserRole = 'Staff' | 'Customer' | 'BusinessAdmin' | 'TechnicalAdmin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface User {
  id: string;
  email: string;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  
  // Joined from UserProfile
  fullName: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  password?: string;
  
  // Roles (simplified for UI)
  role: UserRole;
}
