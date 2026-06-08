import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { LoginDTO } from '@/types/api.types';

export const useAuth = () => {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: authService.getMe,
        retry: false, // Không retry nếu unauthorized
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ username, c_prime_b64 }: LoginDTO) =>
            authService.login(username, c_prime_b64),
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['auth'] });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            // Chỉ SET null, KHÔNG remove → tránh trigger refetch
            queryClient.setQueryData(['auth', 'me'], null);

            // Cancel mọi query đang pending liên quan auth
            queryClient.cancelQueries({ queryKey: ['auth'] });

            router.push('/login'); // Navigate SAU khi set state
        },
        onError: () => {
            queryClient.setQueryData(['auth', 'me'], null);
            queryClient.cancelQueries({ queryKey: ['auth'] });
            router.push('/login');
        }
    });
};