import { apiClient } from "@/lib/api-client"
import { ClientCredentialsResponseDto, ClientMemberResponseDto, EnrollNewClientRequestDto, EnrollNewClientResponseDto, InviteUserRequest, MemberIsPendingDto, MemberOfClientDto, NewClientSecretResponseDto, UpdateClientRequestDto, UserSearchDto } from "@/types/api.types"

export const developerService = {
    enrollNewClient: (data: EnrollNewClientRequestDto) => apiClient.post<EnrollNewClientResponseDto>("/developer/enroll", data),

    getClients: () => apiClient.get<ClientMemberResponseDto[]>("/developer/client-members"),

    getClientCredentials: (client_id: string) => apiClient.get<ClientCredentialsResponseDto>(`/developer/credentials/${client_id}`),

    deleteClientSecret: (client_id: string, secret_id: string) =>
        apiClient.delete(`/developer/${client_id}/secrets/${secret_id}`),

    genNewClientSecret: (client_id: string) => apiClient.post<NewClientSecretResponseDto>(`/developer/generate-secret/${client_id}`),

    updateClient: (client_id: string, data: UpdateClientRequestDto) =>
        apiClient.patch(`developer/update/${client_id}`, data),

    deleteClient: (client_id: string) => apiClient.delete(`developer/${client_id}`),

    getMembersByClientId: (client_id: string) => apiClient.get<MemberOfClientDto[]>(`developer/client-members/${client_id}`),

    getMembersByClientIdIsPending: (client_id: string) => apiClient.get<MemberIsPendingDto[]>(`developer/${client_id}/invitations`),

    deleteInvitation: (client_id: string, invitationId: string) =>
        apiClient.delete(`developer/${client_id}/invitations/${invitationId}`),

    getSearchUsers: (query: string) => apiClient.get<UserSearchDto[]>(`/developer/search-users?query=${query}`),

    inviteUserToClient: (client_id: string, data: InviteUserRequest) =>
        apiClient.post(`developer/${client_id}/invitations`, data),
}