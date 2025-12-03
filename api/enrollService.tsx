import axios, { AxiosResponse } from "axios";

/**
 * Dữ liệu GỬI đi (khớp với CreateClientDto trong backend)
 */
export interface ICreateClientDto {
  appName: string;
  redirectUris: string[];
}

/**
 * Dữ liệu NHẬN về (khớp với ClientSecretDto trong backend)
 */
export interface IClientSecretDto {
  client_id: string;
  client_secret: string;
}

/**
 * Service đăng ký client với Authorization Server
 */
export const registerClientService = async (
  clientData: ICreateClientDto
): Promise<IClientSecretDto> => {
  try {
    const response: AxiosResponse<IClientSecretDto> = await axios.post(
      `http://localhost:8080/portal/api/v1/enroll`,
      clientData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Register client failed:", error);
    throw new Error("Register client failed");
  }
};

/**
 * Service đăng nhập demo CHỈ VỚI USERNAME
 */
export const demoLoginService = async (username: string): Promise<boolean> => {
  try {
    await axios.post(
      `http://localhost:8080/portal/demo-login`,
      { username: username }, // Gửi DTO chỉ có username
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Rất quan trọng để NHẬN cookie
      }
    );
    // Nếu request thành công (không ném lỗi), xem như login OK
    return true;
  } catch (error: unknown) {
    console.error("❌ Demo login failed:", error);
    return false;
  }
};

export const userLogin = async (
  username: string
): Promise<{ success: boolean; message: string } | null> => {
  try {
    const response = await axios.post(
      `http://localhost:8080/face-auth/verify/${username}`,
      {}, // ✅ Body rỗng (endpoint này không cần body)
      {
        withCredentials: true, // ✅ ĐÚNG: nằm trong config (tham số thứ 3)
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Login response:", response);
    console.log("✅ Response headers:", response.headers);

    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("❌ User authenticate failed:", error);
    return null;
  }
};

export const userEnrollService = async (
  username: string,
  name: string,
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post<{ success: boolean; message: string }>(
      "http://localhost:8080/face-auth/enroll",
      { username, name, email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Enroll failed:", error.response?.data);
      throw new Error(error.response?.data?.message || "Enroll failed");
    }
    console.error("❌ Unexpected error:", error);
    throw new Error("Enroll failed");
  }
};
