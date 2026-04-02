import { apiClient } from "@/lib/api-client";
import { OAuth2ValidateClientResponseDto, OAuthAuthorizeRequestDto, OAuthAuthorizeResponseDto, OAuthConsentRequestDto, OAuthValidateParams } from "@/types/api.types";

export const oauthService = {
    validate: (params: OAuthValidateParams) =>
        apiClient.get<OAuth2ValidateClientResponseDto>('/oauth2/validate', { params }),

    authorize: (data: OAuthAuthorizeRequestDto) =>
        apiClient.post<OAuthAuthorizeResponseDto>('/oauth2/authorize', data),

    authorizeConsent: (data: OAuthConsentRequestDto) =>
        apiClient.post<OAuthAuthorizeResponseDto>('/oauth2/authorize/consent', data),
};