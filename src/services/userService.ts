import { users } from '../data/mockData';
import { User, UserRole, UserStatus } from '../models/ui_types/user';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  getUsers: async (): Promise<User[]> => {
    await delay(800);
    return [...users];
  },

  getCustomers: async (): Promise<User[]> => {
    await delay(800);
    return users.filter(u => u.role === 'Customer');
  },

  getStaff: async (): Promise<User[]> => {
    await delay(800);
    return users.filter(u => u.role !== 'Customer');
  },

  getUserById: async (id: string): Promise<User> => {
    await delay(500);
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user };
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await delay(1000);
    const newUser: User = {
      ...userData,
      id: `u${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    // Mock push
    users.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    await delay(1200);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    const updatedUser = { ...users[index], ...userData };
    users[index] = updatedUser;
    return updatedUser;
  },

  toggleUserStatus: async (id: string): Promise<User> => {
    await delay(1000);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    users[index].status = users[index].status === UserStatus.BLOCKED 
      ? UserStatus.ACTIVE 
      : UserStatus.BLOCKED;
      
    return { ...users[index] };
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay(1000);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
    }
  }
};
