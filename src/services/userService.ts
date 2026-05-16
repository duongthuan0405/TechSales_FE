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
  if (roles.includes('Admin')) return 'Technical Admin';
  if (roles.includes('Staff')) return 'Staff';
  if (roles.includes('Business Admin')) return 'Business Admin';
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
    const paged = await api.get<PagedResponse<UserDto>>(
      '/admin/users/staff?pageNumber=1&pageSize=100',
    );
    return paged.items.map(mapUser);
  },

  getUserById: async (_id: string): Promise<User> => {
    // BE doesn't have a get-user-by-id admin endpoint
    // Use current user endpoint as fallback
    const dto = await api.get<UserDto>('/user/me');
    return mapUser(dto);
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    // Map UI role back to BE role string
    const beRole = userData.role === 'Technical Admin' ? 'Technical Admin' : 
                   userData.role === 'Business Admin' ? 'Business Admin' : 'Staff';

    const dto = await api.post<UserDto>('/admin/users', {
      email: userData.email,
      password: 'TemporaryPassword123!', // You might want to let the admin set this
      roles: [beRole]
    });
    return mapUser(dto);
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    // This is for admin updates of any user
    const dto = await api.put<UserDto>(`/admin/users/${id}`, userData);
    return mapUser(dto);
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
    const isBlocking = currentStatus !== UserStatus.BLOCKED;
    if (!isBlocking) {
      await api.post(`/admin/users/${id}/unlock`);
    } else {
      await api.post(`/admin/users/${id}/lock`, { until: null });
    }

    // Try to find in customers first
    const customers = await userService.getCustomers();
    let updated = customers.find(u => u.id === id);
    
    // If not in customers, try staff
    if (!updated) {
      const staff = await userService.getStaff();
      updated = staff.find(u => u.id === id);
    }

    if (!updated) {
      // Fallback: return manual update if refetch fails to find user (should not happen usually)
      return {
        id,
        status: isBlocking ? UserStatus.BLOCKED : UserStatus.ACTIVE,
        // These fields might be stale but at least we don't throw
        email: '', 
        fullName: '',
        role: 'Customer',
        createdAt: new Date().toISOString()
      } as User;
    }
    return updated;
  },


};
