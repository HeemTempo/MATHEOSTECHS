import axiosInstance from './axiosInstance';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'reporter' | 'operator' | 'admin';
  is_active?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/login', credentials);
    
    // If response.data is a string, parse it
    if (typeof response.data === 'string') {
      return JSON.parse(response.data);
    }
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/logout');
  },
};
