import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "@/config/api";

/**
 * Dữ liệu GỬI đi
 */
export interface ICreateClientDto {
  appName: string;
  redirectUris: string[];
}

/**
 * Dữ liệu NHẬN về
 */
export interface IClientSecretDto {
  client_id: string;
  client_secret: string;
}

export interface IUserInfor {
  username: string;
  name: string;
  email: string;
}

/* ===================== CLIENT ENROLL ===================== */

export const registerClientService = async (
  clientData: ICreateClientDto
): Promise<IClientSecretDto> => {
  const response: AxiosResponse<IClientSecretDto> = await axios.post(
    `${API_BASE_URL}/portal/api/v1/enroll`,
    clientData,
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
};

/* ===================== AUTH ===================== */

export const getAccessTokenByRefreshToken = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/face-auth/refresh`,
      {},
      { withCredentials: true }
    );

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Refresh failed",
    };
  }
};

export const getUserInfor = async (): Promise<{
  data: IUserInfor | null;
  success: boolean;
  message: string;
}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/face-auth/me`, {
      withCredentials: true,
    });

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Get user info failed",
      data: null,
    };
  }
};

export const userLogout = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/face-auth/logout`,
      {},
      { withCredentials: true }
    );

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Logout failed",
    };
  }
};

export const userLogin = async (
  username: string,
  imageBase64: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/face-auth/verify/${username}`,
      { image_b64: imageBase64 },
      { withCredentials: true }
    );

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Verify failed",
    };
  }
};

export const userEnrollService = async (
  username: string,
  name: string,
  email: string,
  imageBase64: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/face-auth/enroll`,
      { username, name, email, image_b64: imageBase64 },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Enroll failed",
    };
  }
};
