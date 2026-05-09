import { mockNotifications } from '../data/mockData';
import { Notification } from '../models/ui_types/notification';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    await delay(500);
    return [...mockNotifications].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  markAsRead: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotifications[index] = { ...mockNotifications[index], isRead: true };
    }
  },

  markAllAsRead: async (): Promise<void> => {
    await delay(500);
    mockNotifications.forEach((n, i) => {
      mockNotifications[i] = { ...n, isRead: true };
    });
  }
};
