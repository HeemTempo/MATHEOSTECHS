import axiosInstance from './axiosInstance';
import type { User } from './auth';

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'reporter' | 'operator' | 'admin';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'reporter' | 'operator' | 'admin';
  is_active?: boolean;
}

export interface UserFilters {
  role?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export const usersApi = {
  getAll: async (filters?: UserFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axiosInstance.get<UsersResponse>(`/users?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserData) => {
    const response = await axiosInstance.post<UserResponse>('/users', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserData) => {
    const response = await axiosInstance.put<UserResponse>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  getOperators: async () => {
    const response = await axiosInstance.get<UsersResponse>('/operators');
    return response.data;
  },

  getReporters: async () => {
    const response = await axiosInstance.get<UsersResponse>('/reporters');
    return response.data;
  },

  activate: async (id: number) => {
    const response = await axiosInstance.put<UserResponse>(`/users/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number) => {
    const response = await axiosInstance.put<UserResponse>(`/users/${id}/deactivate`);
    return response.data;
  },
};
