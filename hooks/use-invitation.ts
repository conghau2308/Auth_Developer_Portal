import { invitationService } from "@/services/invitation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAcceptInvitation = (token: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => invitationService.acceptInvitation(token),
        onSuccess: (response) => {
            queryClient.removeQueries({ queryKey: ["invitations", "preview", token] });
            toast.success("Tham gia thành công.");
            router.push(`/settings/developer/${response.clientId}`);
        },
        onError: () => {
            toast.error("Tham gia thất bại, vui lòng thử lại sau.");
        }
    });
};

export const useDeclineInvitation = (token: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => invitationService.declineInvitation(token),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["invitations", "preview", token] });
            toast.success("Từ chối thành công.");
            router.push("/");
        },
        onError: () => {
            toast.error("Từ chối thất bại, vui lòng thử lại sau.")
        }
    });
};