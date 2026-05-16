import api, { PagedResponse } from '../api/apiClient';
import { User, UserRole, UserStatus } from '../models/ui_types/user';

// ─── BE Response Types ──────────────────────────────────────
interface UserDto {
  id: string;
  email: string;
  status: UserStatus;
  createdAt: string;
  roles: string[];
  profile: {
    fullName: string;
    phone: string;
    avatarUrl?: string;
    dateOfBirth?: string;
  } | null;
}

// ─── Role Mapping ───────────────────────────────────────────
const mapRole = (roles: string[]): UserRole => {
  if (roles.includes('Admin')) return 'TechnicalAdmin';
  if (roles.includes('Staff')) return 'Staff';
  if (roles.includes('BusinessAdmin')) return 'BusinessAdmin';
  return 'Customer';
};

const mapUser = (dto: UserDto): User => ({
  id: dto.id,
  email: dto.email,
  status: dto.status,
  createdAt: dto.createdAt,
  fullName: dto.profile?.fullName || '',
  phone: dto.profile?.phone || '',
  avatarUrl: dto.profile?.avatarUrl,
  dateOfBirth: dto.profile?.dateOfBirth,
  role: mapRole(dto.roles),
});

export const userService = {
  getUsers: async (): Promise<User[]> => {
    // Use admin customers endpoint
    const paged = await api.get<PagedResponse<UserDto>>(
      '/admin/users/customers?pageNumber=1&pageSize=100',
    );
    return paged.items.map(mapUser);
  },

  getCustomers: async (): Promise<User[]> => {
    const paged = await api.get<PagedResponse<UserDto>>(
      '/admin/users/customers?pageNumber=1&pageSize=100',
    );
    return paged.items.map(mapUser);
  },

  getStaff: async (): Promise<User[]> => {
    // BE doesn't have a separate staff list endpoint
    // Return empty — or could be added later
    return [];
  },

  getUserById: async (_id: string): Promise<User> => {
    // BE doesn't have a get-user-by-id admin endpoint
    // Use current user endpoint as fallback
    const dto = await api.get<UserDto>('/user/me');
    return mapUser(dto);
  },

  createUser: async (_userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    // BE doesn't have an admin create-user endpoint
    throw new Error('Create user is not supported by the server.');
  },

  updateUser: async (_id: string, _userData: Partial<User>): Promise<User> => {
    // For self-profile update
    throw new Error('Update user is not supported. Use profile update instead.');
  },

  updateProfile: async (data: {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
  }): Promise<void> => {
    await api.put('/user-profile', data);
  },

  toggleUserStatus: async (id: string, currentStatus: UserStatus): Promise<User> => {
    if (currentStatus === UserStatus.BLOCKED) {
      await api.post(`/admin/users/${id}/unlock`);
    } else {
      await api.post(`/admin/users/${id}/lock`, { until: null });
    }
    // Refetch users to get updated status
    const users = await userService.getCustomers();
    const updated = users.find(u => u.id === id);
    if (!updated) throw new Error('User not found after status update');
    return updated;
  },

  deleteUser: async (_id: string): Promise<void> => {
    // BE doesn't have a delete user endpoint
    throw new Error('Delete user is not supported by the server.');
  },
};
