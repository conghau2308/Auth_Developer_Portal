import { apiClient } from "@/lib/api-client";
import { DeltaResponseDto, OAuth2ValidateClientResponseDto, OAuthAuthorizeRequestDto, OAuthAuthorizeResponseDto, OAuthConsentRequestDto, OAuthValidateParams } from "@/types/api.types";

export const oauthService = {
    validate: (params: OAuthValidateParams) =>
        apiClient.get<OAuth2ValidateClientResponseDto>('/oauth2/validate', { params }),

    // Lấy helper_data (δ) và mask — state từ OAuth flow buộc request phải đến từ phiên PKCE hợp lệ
    getDelta: (username: string, state: string) =>
        apiClient.get<DeltaResponseDto>('/auth/delta', { params: { username, state } }),

    // authorize nhận hash_k_b64 thay vì ảnh khuôn mặt
    authorize: (data: OAuthAuthorizeRequestDto) =>
        apiClient.post<OAuthAuthorizeResponseDto>('/oauth2/authorize', data),

    authorizeConsent: (data: OAuthConsentRequestDto) =>
        apiClient.post<OAuthAuthorizeResponseDto>('/oauth2/authorize/consent', data),
};