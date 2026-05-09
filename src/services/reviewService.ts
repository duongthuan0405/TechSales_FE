import { mockReviews } from '../data/mockData';
import { Review, ReviewStatus } from '../models/ui_types/review';
import { delay } from '../utils/delay';

export const reviewService = {
  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    await delay(600);
    return mockReviews.filter(r => r.productId === productId && r.status === ReviewStatus.VISIBLE);
  },

  getAllReviews: async (): Promise<Review[]> => {
    await delay(800);
    return [...mockReviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
  },

  moderateReview: async (id: string, status: ReviewStatus): Promise<void> => {
    await delay(800);
    const index = mockReviews.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReviews[index] = { ...mockReviews[index], status };
    }
  },

  replyToReview: async (id: string, reply: string): Promise<void> => {
    await delay(800);
    const index = mockReviews.findIndex(r => r.id === id);
    if (index !== -1) {
      const review = mockReviews[index];
      const newResponse = {
        id: `resp-${Math.random().toString(36).substr(2, 9)}`,
        reviewId: id,
        userId: 'u3', // Mocking current staff user ID
        userName: 'Staff',
        content: reply,
        createdAt: new Date().toISOString()
      };
      
      mockReviews[index] = { 
        ...review, 
        responses: [...(review.responses || []), newResponse],
        reply: reply // Keep for backward compatibility
      };
    }
  }
};
