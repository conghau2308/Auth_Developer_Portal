import { useQuery } from '@tanstack/react-query';
import { publicService } from '@/services/public.service';

export const useInvitationPreview = (token: string) => {
    return useQuery({
        queryKey: ["invitations", "preview", token],
        queryFn: () => publicService.getInvitationPreview(token),
        enabled: !!token,
    });
};