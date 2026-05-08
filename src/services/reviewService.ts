import { mockReviews } from '../data/mockData';
import { Review, ReviewStatus } from '../models/ui_types/review';
import { delay } from '../app/utils/delay';

export const reviewService = {
  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    await delay(600);
    return mockReviews.filter(r => r.productId === productId && r.status === ReviewStatus.VISIBLE);
  },

  submitReview: async (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> => {
    await delay(1000);
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      status: ReviewStatus.VISIBLE,
      createdAt: new Date().toISOString()
    };
    mockReviews.unshift(newReview);
    return newReview;
  }
};
