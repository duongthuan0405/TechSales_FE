import { paymentMethods } from '../data/mockData';
import { PaymentMethod } from '../models/ui_types/paymentMethod';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await delay(500);
    return [...paymentMethods.filter(pm => pm.isActive)];
  }
};
