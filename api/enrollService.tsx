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
  clientId: string;
  clientSecret: string;
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
