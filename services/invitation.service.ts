import { apiClient } from "@/lib/api-client";
import { AcceptInvitationResponseDto } from "@/types/api.types";

export const invitationService = {
    acceptInvitation: (token: string) => apiClient.post<AcceptInvitationResponseDto>(`invitations/accept?token=${token}`),

    declineInvitation: (token: string) => apiClient.post(`invitations/decline?token=${token}`),
}