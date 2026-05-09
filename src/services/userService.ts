import { users } from '../data/mockData';
import { User } from '../models/ui_types/user';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  getUsers: async (): Promise<User[]> => {
    await delay(900);
    return [...users];
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    await delay(1200);
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user, ...userData };
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay(1000);
    // Simulation
  }
};
