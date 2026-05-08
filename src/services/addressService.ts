import { delay } from '../app/utils/delay';
import { Address } from '../models/ui_types/address';
import { mockAddresses } from '../data/mockData';

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    await delay(800);
    return [...mockAddresses];
  },

  createAddress: async (address: Omit<Address, 'id'>): Promise<Address> => {
    await delay(1000);
    const newAddress = { ...address, id: Math.random().toString(36).substr(2, 9) };
    
    if (newAddress.isDefault) {
      // Logic to reset other defaults
      mockAddresses.forEach(a => a.isDefault = false);
    }
    
    mockAddresses.push(newAddress);
    return newAddress;
  },

  updateAddress: async (id: string, updates: Partial<Address>): Promise<Address> => {
    await delay(1000);
    const index = mockAddresses.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Address not found');

    if (updates.isDefault) {
      mockAddresses.forEach(a => a.isDefault = false);
    }

    mockAddresses[index] = { ...mockAddresses[index], ...updates };
    return mockAddresses[index];
  },

  deleteAddress: async (id: string): Promise<void> => {
    await delay(800);
    const index = mockAddresses.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAddresses.splice(index, 1);
    }
  },

  setDefaultAddress: async (id: string): Promise<void> => {
    await delay(500);
    mockAddresses.forEach(a => {
      a.isDefault = a.id === id;
    });
  }
};
