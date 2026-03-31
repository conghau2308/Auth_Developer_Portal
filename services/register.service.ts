import { apiClient } from "@/lib/api-client";
import { CreateUserDTO } from "@/types/api.types";

export const registerService = {
    checkUsername: (username: string) => apiClient.post('auth/check-username', { username }),

    register: (data: CreateUserDTO) =>
        apiClient.post("auth/enroll", { username: data.username, name: data.name, email: data.email, image_b64: data.image_b64 }),
}