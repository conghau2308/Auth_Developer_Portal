import { developerService } from "@/services/developer.service"
import { EnrollNewClientRequestDto, InviteUserRequest, UpdateClientRequestDto, UpdateMemberRoleRequestDto } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useClientMembership = () => {
    return useQuery({
        queryKey: ["developer", "client-membership"],
        queryFn: developerService.getClients,
    });
};

export const useEnrollNewClient = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: EnrollNewClientRequestDto) => developerService.enrollNewClient(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-membership"] });
            toast.success("Đăng ký OAuth App mới thành công.");
            router.replace(`/settings/developer/${response.id}`);
        },
        onError: () => {
            toast.error("Đăng ký thất bại, vui lòng thử lại.");
        }
    })
}

export const useClientCredentials = (client_id: string) => {
    return useQuery({
        queryKey: ["developer", "client-credentials", client_id],
        queryFn: () => developerService.getClientCredentials(client_id),
        enabled: !!client_id, // Chỉ chạy khi có client_id
    });
};

export const useDeleteClientSecret = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ client_id, secret_id }: { client_id: string; secret_id: string }) =>
            developerService.deleteClientSecret(client_id, secret_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-credentials"] });
            toast.success('Đã xóa secret thành công!');
        },
        onError: () => {
            toast.error('Xóa secret thất bại. Vui lòng thử lại.');
        }
    });
};

export const useGenNewClientSecret = (client_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => developerService.genNewClientSecret(client_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-credentials"] });
        },
        onError: () => {
            toast.error('Tạo secret mới thất bại. Vui lòng thử lại.');
        }
    });
};

export const useUpdateClient = (client_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateClientRequestDto) => developerService.updateClient(client_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-credentials", client_id] });
            toast.success("Đã lưu thay đổi.");
        },
        onError: () => {
            toast.error("Lưu thất bại, vui lòng thử lại.");
        },
    });
};

export const useDeleteClient = (client_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => developerService.deleteClient(client_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-credentials", client_id] });
            queryClient.invalidateQueries({ queryKey: ["developer", "client-membership"] });
        },
        onError: () => {
            toast.error("Xóa thất bại, vui lòng thử lại.");
        }
    })
}

export const useClientMembers = (client_id: string) => {
    return useQuery({
        queryKey: ["developer", "client-members", client_id],
        queryFn: () => developerService.getMembersByClientId(client_id),
        enabled: !!client_id,
    });
};

export const useClientMemberIsPending = (client_id: string) => {
    return useQuery({
        queryKey: ["developer", "client-members-pending", client_id],
        queryFn: () => developerService.getMembersByClientIdIsPending(client_id),
        enabled: !!client_id,
    });
};

export const useDeleteInvitation = (client_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) => developerService.deleteInvitation(client_id, invitationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-members-pending", client_id] });
            toast.success("Thu hồi lời mời thành công.");
        },
        onError: () => {
            toast.error("Thu hồi lời mời thất bại, vui lòng thử lại sau.");
        }
    });
};

export const useSearchUsers = (query: string) => {
    return useQuery({
        queryKey: ["developer", "user-search", query],
        queryFn: () => developerService.getSearchUsers(query),
        enabled: query.trim().length >= 2, // Chỉ search khi gõ >= 2 ký tự
        staleTime: 30_000,
    });
};

export const useSendInvitation = (client_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InviteUserRequest) =>
            developerService.inviteUserToClient(client_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-members-pending", client_id] });
            toast.success("Đã gửi lời mời thành công.");
        },
        onError: (error: any) => {
            // Xử lý các error code cụ thể từ backend
            const code = error?.response?.data?.code;
            if (code === "USER_NOT_FOUND") {
                toast.error("Không tìm thấy người dùng với email này.");
            } else if (code === "ALREADY_MEMBER") {
                toast.error("Người dùng này đã là thành viên của ứng dụng.");
            } else if (code === "INVITATION_ALREADY_SENT") {
                toast.error("Đã có lời mời đang chờ xác nhận cho email này.");
            } else {
                toast.error("Gửi lời mời thất bại, vui lòng thử lại.");
            }
        },
    });
};

export const useUpdateClientMemberRole = (client_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateMemberRoleRequestDto) =>
            developerService.updateMemberRole(client_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-members", client_id] });
            toast.success("Cập nhật quyền thành công.");
        },
        onError: () => {
            toast.error("Cập nhật quyền thất bại, vui lòng thử lại sau.");
        }
    })
};

export const useRemoveClientMember = (client_id: string, member_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => developerService.deleteMemberRole(client_id, member_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developer", "client-members", client_id] });
            toast.success("Xóa thành viên thành công.");
        },
        onError: () => {
            toast.error("Xóa thành viên thất bại, vui lòng thử lại sau.");
        }
    })
};