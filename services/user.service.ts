import { apiClient } from '@/lib/api-client';
import { UpdateUserDTO, User } from '@/types/api.types';


export const userService = {
  getProfile: () => apiClient.get<User>('/users/me'),
  
  updateProfile: (data: UpdateUserDTO) => 
    apiClient.patch<User>('/users/me', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};