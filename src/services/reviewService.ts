import api, { PagedResponse } from '../api/apiClient';
import { Review, ReviewStatus } from '../models/ui_types/review';

// ─── BE Response Types ──────────────────────────────────────
interface ReviewStaffDto {
  id: string;
  rating: number;
  comment: string;
  productName?: string;
  status: string;
  violationReason?: string;
  createdAt: string;
  profile: {
    fullName: string;
    avatarUrl?: string;
  };
}

// ─── Mapping ────────────────────────────────────────────────
const mapStaffReview = (dto: ReviewStaffDto): Review => ({
  id: dto.id,
  userId: '',
  userName: dto.profile?.fullName || 'Anonymous',
  userAvatar: dto.profile?.avatarUrl,
  productId: '',
  rating: dto.rating,
  comment: dto.comment || '',
  status: (dto.status as ReviewStatus) || ReviewStatus.VISIBLE,
  createdAt: dto.createdAt,
  productName: dto.productName,
});

export const reviewService = {
  getReviewsByProductId: async (_productId: string): Promise<Review[]> => {
    // BE doesn't have a customer-facing product reviews endpoint
    return [];
  },

  getAllReviews: async (pageNumber = 1, pageSize = 20): Promise<Review[]> => {
    const paged = await api.get<PagedResponse<ReviewStaffDto>>(
      `/Review/latest?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
    return paged.items.map(mapStaffReview);
  },

  submitReview: async (_reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> => {
    // BE doesn't have a customer submit review endpoint
    throw new Error('Submit review is not supported by the server.');
  },

  moderateReview: async (id: string, status: ReviewStatus): Promise<void> => {
    if (status === ReviewStatus.HIDDEN) {
      await api.put(`/Review/${id}/hide`, { reason: 'Hidden by staff' });
    }
  },

  replyToReview: async (id: string, reply: string): Promise<void> => {
    await api.post(`/Review/${id}/reply`, { content: reply });
  },
};
