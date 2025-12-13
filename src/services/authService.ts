import { apiEndpoints } from "@/api/endpoints";
import type { LoginFormDto, LoginResponseDto } from "@/dto/LoginFormDto";
// import { jwtDecode as jwtDecodeService } from "jwt-decode";
import type { RegisterFormDto } from "@/dto/RegisterFormDto";

import type { IAuthService } from "@/services/interfaces/IAuthService";

class AuthServiceReal implements IAuthService {
  async login({ email, password }: LoginFormDto): Promise<LoginResponseDto> {
    try {
      const response = await fetch(apiEndpoints.auth.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          return {
            success: false,
            message: errorData.message || "Cuenta no verificada",
          };
        }
        return {
          success: false,
          message: errorData.message || "Credenciales inválidas",
        };
      }
      if (response.status === 200) {
        const data = (await response.json()) as {
          accessToken: string;
          refreshToken: string;
        };
        const { accessToken, refreshToken } = data;
        return {
          success: true,
          accessToken,
          refreshToken,
        };
      }
      return {
        success: false,
        message: "Error al iniciar sesión",
      };
    } catch (error) {
      return {
        success: false,
        message:
            error instanceof Error
            ? error.message
            : "Error al conectar con el servidor",
      };
    }
  }

  async register(
    data: RegisterFormDto
  ): Promise<{ success: boolean; message?: string }> {
    console.log("Register data:", data);
    try {
      const requestBody: Partial<RegisterFormDto> = { ...data };
      const response = await fetch(apiEndpoints.auth.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (response.status !== 201) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Error al registrarse",
        };
      }
      return {
        success: true,
        message: "Usuario registrado correctamente",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
            ? error.message
            : "Error al conectar con el servidor",
      };
    }
  }

  async logout(token: string): Promise<{ success: boolean; message?: string }> {
    // ...existing code...
    try {
      const response = await fetch(apiEndpoints.auth.LOGOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return { success: true, message: "Sesión cerrada correctamente" };
      }
      return { success: false, message: "Error al cerrar sesión" };
    } catch (error) {
      return { 
        success: false, 
        message: 
          error instanceof Error
            ? error.message
            : "Error al cerrar sesión" };
    }
  }
}

export const authServiceReal = new AuthServiceReal();
