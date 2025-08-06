import axios from "axios";

//import.meta.env.VITE_API_URL ||
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  message: string;
  user_email: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

export const passwordResetService = {
  async requestReset(data: PasswordResetRequest): Promise<{ message: string }> {
    const response = await axios.post(
      `${API_BASE_URL}/reset_password/request`,
      data
    );
    return response.data;
  },

  async verifyToken(token: string): Promise<TokenVerificationResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/reset_password/verify-token/${token}`
    );
    return response.data;
  },

  async confirmReset(data: PasswordResetConfirm): Promise<{ message: string }> {
    const response = await axios.post(
      `${API_BASE_URL}/reset_password/confirm`,
      data
    );
    return response.data;
  },
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || error.message || "Erro desconhecido";
  }
  return error instanceof Error ? error.message : "Erro desconhecido";
};
