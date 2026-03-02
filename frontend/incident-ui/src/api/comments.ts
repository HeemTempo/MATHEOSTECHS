import axiosInstance from './axiosInstance';
import type { Comment } from './incidents';

export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export const commentsApi = {
  create: async (incidentId: number, comment: string): Promise<CommentResponse> => {
    const response = await axiosInstance.post(`/incidents/${incidentId}/comments`, { comment });
    return response.data;
  },
};
