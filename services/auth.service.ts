import { apiClient } from '@/lib/api-client';
import { User } from '@/types/api.types';

export const authService = {
  login: (username: string, c_prime_b64: string) =>
    apiClient.post('/auth/verify', { username, c_prime_b64 }),

  logout: () => apiClient.post('/auth/logout'),

  getMe: () => apiClient.get<User>('/auth/me'),

  // Refresh tự động xử lý trong interceptor rồi
};