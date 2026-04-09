import { publicApi } from '@/lib/api-client';
import { InvitationPreviewResponseDto } from '@/types/api.types';

export const publicService = {
  getInvitationPreview: (token: string) =>
    publicApi.get<InvitationPreviewResponseDto>(`invitations/preview?token=${token}`),
};