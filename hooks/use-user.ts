import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { UpdateUserDTO } from '@/types/api.types';
import { toast } from 'sonner';

export const useProfile = () => {
    return useQuery({
        queryKey: ['user', 'profile'],
        queryFn: userService.getProfile,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateUserDTO) => userService.updateProfile({
            ...data,
            name: data.name.trim(),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: () => {
            toast.error('Cập nhật thông tin thất bại. Vui lòng thử lại.');
        }
    });
};

export const useAuthorizedApplications = () => {
    return useQuery({
        queryKey: ['user', 'authorized-applications'],
        queryFn: userService.getAuthorizedApplications,
    });
};

export const useRevokeApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (consent_id: string) => userService.deleteAuthorizedApplication(consent_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'authorized-applications'] });
            toast.success('Đã revoke quyền truy cập ứng dụng!');
        },
        onError: () => {
            toast.error('Revoke quyền thất bại. Vui lòng thử lại.');
        }
    });
};