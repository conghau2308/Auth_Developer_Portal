import axios, { AxiosInstance } from 'axios';
import { queryClient } from './query-client';

interface ApiClient extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'> {
  get<T = any>(url: string, config?: object): Promise<T>;
  post<T = any>(url: string, data?: any, config?: object): Promise<T>;
  put<T = any>(url: string, data?: any, config?: object): Promise<T>;
  delete<T = any>(url: string, config?: object): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: object): Promise<T>;
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ── Instance gốc (có call signature, dùng nội bộ) ──
const _apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

const _publicApi = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 10000,
});

// ── Export với type đã override ──
export const apiClient = _apiClient as unknown as ApiClient;
export const publicApi = _publicApi as unknown as ApiClient;

// ============ INTERCEPTOR - Tự động refresh token ============
_apiClient.interceptors.response.use(
  (response) => response.data.data,
  async (error) => {
    const originalRequest = error.config;
    const skipRefreshUrls = ['/auth/refresh', '/auth/logout', '/auth/login'];
    const isSkipUrl = skipRefreshUrls.some(url => originalRequest?.url?.includes(url));

    if (error.response?.status === 401 && !originalRequest._retry && !isSkipUrl) {
      originalRequest._retry = true;
      try {
        await _apiClient.post('/auth/refresh');
        return _apiClient(originalRequest);
      } catch (refreshError) {
        queryClient.setQueryData(['auth', 'me'], null);
        queryClient.removeQueries({ queryKey: ['auth'] });
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      queryClient.setQueryData(['auth', 'me'], null);
      // ✅ Không removeQueries — chỉ set null là đủ
      // removeQueries gây re-fetch vô hạn
    }

    return Promise.reject(error);
  }
);

_publicApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);