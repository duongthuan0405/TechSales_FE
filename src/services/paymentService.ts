import { PaymentMethod } from '../models/ui_types/paymentMethod';

// BE doesn't have a payment methods endpoint.
// Return empty array — components should handle empty state.

export const paymentService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    return [];
  },
};
