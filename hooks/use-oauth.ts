import { useQuery, useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { OAuthAuthorizeRequestDto, OAuthConsentRequestDto, OAuthValidateParams } from '@/types/api.types';
import { oauthService } from '@/services/oauth.service';
import { checkLiveness } from '@/lib/wifakey/antispoof';
import { alignFace, alignFaceWithYuNetKps } from '@/lib/wifakey/face-alignment';
import { getEmbedding } from '@/lib/wifakey/adaface';
import { wifakeyVerify } from '@/lib/wifakey/wifakey-core';
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
 * Hook để chạy WiFaKey verify cục bộ trong browser:
 * 1. Tải δ (helper_data) từ server
 * 2. Align face, lấy embedding qua AdaFace ONNX
 * 3. Chạy fuzzy decommitment → hash_k
 * 4. Trả hash_k_b64 để caller đưa vào authorize request
 *
 * c* và k không rời thiết bị.
 */
export function useWiFaKeyVerify() {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const computeHashK = useCallback(
        async (
            username: string,
            state: string,
            imageData: ImageData,
            landmarks: { x: number; y: number }[]
        ): Promise<string | null> => {
            setProcessing(true);
            setError(null);
            // Yield trước mỗi ONNX block để browser render loading state trước
            const yf = () => new Promise<void>(r => requestAnimationFrame(() => r()));
            try {
                await yf(); // browser paint "processing" UI trước khi block

                // 1+2. Song song: antispoof/detection + getDelta
                const [{ isReal, score, detected }, delta] = await Promise.all([
                    checkLiveness(imageData, landmarks),
                    oauthService.getDelta(username, state),
                ]);
                if (!isReal) throw new Error(`Phát hiện ảnh giả (score=${score.toFixed(2)}). Vui lòng dùng khuôn mặt thật.`);

                // 3. Align — YuNet kps (đã reorder) nếu detect được, fallback MediaPipe
                const aligned = detected?.kps
                    ? alignFaceWithYuNetKps(imageData, detected.kps)
                    : alignFace(imageData, landmarks);
                if (!aligned) throw new Error('Không thể căn chỉnh khuôn mặt');

                await yf(); // yield trước AdaFace (model lớn nhất)
                // 4. AdaFace embedding
                const embedding = await getEmbedding(aligned);

                // 4. Base64 decode helper_data và mask
                const fromB64 = (b64: string) =>
                    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
                const helperData = fromB64(delta.helper_data_b64);
                const maskR = fromB64(delta.mask_b64);

                // 5. WiFaKey verify (fuzzy decommitment) — cục bộ
                const hashK = await wifakeyVerify(embedding, helperData, maskR);

                // 6. Base64 encode để gửi lên server
                return btoa(String.fromCharCode(...hashK));
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

    return { computeHashK, processing, error, clearError };
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