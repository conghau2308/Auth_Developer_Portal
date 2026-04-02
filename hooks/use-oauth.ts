import { useQuery, useMutation } from '@tanstack/react-query';
import type { OAuthAuthorizeRequestDto, OAuthConsentRequestDto, OAuthValidateParams } from '@/types/api.types';
import { oauthService } from '@/services/oauth.service';
import { useRouter } from 'next/navigation';

export const useOAuthValidate = (params: OAuthValidateParams) =>
    useQuery({
        queryKey: ['oauth', 'validate', params.client_id],
        queryFn: () => oauthService.validate(params),
        retry: false,
        staleTime: Infinity, // params không đổi trong session
    });

export const useAuthorize = (onConsentRequired: (scopes: string[]) => void) => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: OAuthAuthorizeRequestDto) => oauthService.authorize(data),
        onSuccess: (response) => {
            if (response.consent_required) {
                // Backend yêu cầu hiện consent screen với pending_scopes
                onConsentRequired(response.pending_scopes);
            } else {
                // Đã có consent đủ scope → redirect thẳng
                router.push(response.redirect_url);
            }
        },
        onError: (error) => {
            console.error('Authorization error:', error);
        }
    });
};

export const useAuthorizeConsent = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: OAuthConsentRequestDto) => oauthService.authorizeConsent(data),
        onSuccess: (response) => {
            if (!response.consent_required) {
                router.push(response.redirect_url);
            }
        },
        onError: (error) => {
            console.error('Consent error:', error);
        }
    });

}