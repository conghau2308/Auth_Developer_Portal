import { registerService } from "@/services/register.service";
import { CreateUserDTO } from "@/types/api.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCheckUsername = () => useMutation({
    mutationFn: (username: string) => registerService.checkUsername(username),
});

export const useRegister = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: CreateUserDTO) => registerService.register(data),
        onSuccess: () => {
            toast.success("Đăng ký tài khoản thành công");
            router.push('/login');
        },
        onError: (error) => {
            toast.error("Đã có lỗi xảy ra", { description: error.message });
        }
    });
};