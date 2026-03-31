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
        mutationFn: ({ username, imageBase64 }: LoginDTO) =>
            authService.login(username, imageBase64),
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
            queryClient.setQueryData(['auth', 'me'], null); // ✅ Navbar thấy ngay
            queryClient.cancelQueries({ queryKey: ['auth'] }); // ✅ Hủy fetch đang chạy
            queryClient.removeQueries({ queryKey: ['auth'] }); // ✅ Xóa cache
            // router.push('/login');
        },
        onError: () => {
            // Dù logout API fail cũng clear local state
            queryClient.setQueryData(['auth', 'me'], null);
            queryClient.removeQueries({ queryKey: ['auth'] });
            router.push('/login');
        }
    });
};