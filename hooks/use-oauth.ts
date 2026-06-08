import { useQuery, useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { OAuthAuthorizeRequestDto, OAuthConsentRequestDto, OAuthValidateParams } from '@/types/api.types';
import { oauthService } from '@/services/oauth.service';
import { verifyWithNativeApp } from '@/lib/wifakey/native-bridge';
import { useRouter } from 'next/navigation';

export const useOAuthValidate = (params: OAuthValidateParams) =>
    useQuery({
        queryKey: ['oauth', 'validate', params.client_id],
        queryFn: () => oauthService.validate(params),
        retry: false,
        staleTime: Infinity,
    });

export const useAuthorize = (onConsentRequired: (scopes: string[]) => void) => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: OAuthAuthorizeRequestDto) => oauthService.authorize(data),
        onSuccess: (response) => {
            if (response.consent_required) {
                onConsentRequired(response.pending_scopes);
            } else {
                router.push(response.redirect_url);
            }
        },
        onError: (error) => {
            console.error('Authorization error:', error);
        }
    });
};

/**
 * Hook để lấy c' (noisy codeword) từ native app thay vì xử lý ONNX trong browser:
 * 1. Tải δ (helper_data + mask) từ server
 * 2. Gửi sang native app qua WebSocket → app mở camera, chạy pipeline đến bước XOR
 * 3. Nhận c_prime_b64 → trả về caller (IdP sẽ tự decode LDPC + tái tạo khoá)
 *
 * c*, k và ảnh khuôn mặt không bao giờ rời native process.
 */
export function useWiFaKeyVerify() {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const computeCPrime = useCallback(
        async (username: string, state: string): Promise<string | null> => {
            setProcessing(true);
            setError(null);
            try {
                // 1. Lấy δ từ server
                const delta = await oauthService.getDelta(username, state);

                // 2. Native app xử lý camera → XOR với δ → trả c'
                const c_prime_b64 = await verifyWithNativeApp(
                    delta.helper_data_b64,
                    delta.mask_b64,
                );
                return c_prime_b64;
            } catch (e) {
                setError(e instanceof Error ? e.message : 'WiFaKey verify thất bại');
                return null;
            } finally {
                setProcessing(false);
            }
        },
        []
    );

    const clearError = useCallback(() => setError(null), []);

    return { computeCPrime, processing, error, clearError };
}

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
