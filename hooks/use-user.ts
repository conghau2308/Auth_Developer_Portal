import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export const useProfile = () => {
    return useQuery({
        queryKey: ['user', 'profile'],
        queryFn: userService.getProfile,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
        },
    });
};