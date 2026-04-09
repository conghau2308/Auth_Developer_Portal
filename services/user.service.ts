import { apiClient } from '@/lib/api-client';
import { AuthorizedApplicationResponseDto, UpdateUserDTO, User } from '@/types/api.types';


export const userService = {
  getProfile: () => apiClient.get<User>('/users/me'),

  updateProfile: (data: UpdateUserDTO) =>
    apiClient.patch('/users/update-infor', data),

  getAuthorizedApplications: () =>
    apiClient.get<AuthorizedApplicationResponseDto>('/users/authorized-applications'),

  deleteAuthorizedApplication: (consent_id: string) =>
    apiClient.delete(`/users/authorized-applications/${consent_id}/revoke`),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};