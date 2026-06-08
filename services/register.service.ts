import { apiClient } from "@/lib/api-client";
import { CreateUserDTO } from "@/types/api.types";

export const registerService = {
    checkUsername: (username: string) => apiClient.post('auth/check-username', { username }),
    checkEmail: (email: string) => apiClient.post('auth/check-email', { email }),

    register: (data: CreateUserDTO) =>
        apiClient.post("auth/enroll", {
            username: data.username,
            name: data.name,
            email: data.email,
            helper_data_b64: data.helper_data_b64,
            mask_b64: data.mask_b64,
            key_hash_b64: data.key_hash_b64,
        }),
}