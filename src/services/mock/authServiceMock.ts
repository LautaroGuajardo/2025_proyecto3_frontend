import type { IAuthService } from "@/services/interfaces/IAuthService";
import type { LoginFormDto, LoginResponseDto } from "@/dto/LoginFormDto";
import type { RegisterFormDto } from "@/dto/RegisterFormDto";
import { Role } from "@/types/Role";
import { USERS, type UserWithPassword } from "./userServiceMock";
import { tokenServiceMock } from "./tokenServiceMock";

class AuthServiceMock implements IAuthService {
  async login(data: LoginFormDto): Promise<LoginResponseDto> {
    const user = USERS.find(
      (u) => u.email === data.email && u.password === data.password
    );
    if (!user) {
      return Promise.resolve({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Simular token
    const accessToken = btoa(`${user.email}:${user.role}`);

    return Promise.resolve({
      success: true,
      accessToken,
    });
  }

  async register(data: Omit<RegisterFormDto, "confirmPassword">) {
    const exists = USERS.some((u) => u.email === data.email);
    if (exists) {
      return Promise.resolve({
        success: false,
        message: "Usuario ya existente",
      });
    }

    const newUser: UserWithPassword = {
      id: (USERS.length + 1).toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: Role.USER,
      phone: data.phone,
      area: data.area || null,
      subarea: data.subarea || null,
      password: data.password,
    };

    USERS.push(newUser);

    return Promise.resolve({
      success: true,
      message: "Usuario registrado con éxito",
    });
  }

  async logout(_token: string) {
    void _token; // Evitar warning de variable no usada
    return Promise.resolve({
      success: true,
    });
  }
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (!token) {
      return Promise.resolve({
        success: false,
        message: "Token es requerido (mock)",
      });
    }
    const { success, message } = await tokenServiceMock.validateToken(token);
    if (!success) {
      return Promise.resolve({
        success: false,
        message: `Token inválido: ${message} (mock)`,
      });
    }
    if (newPassword !== confirmPassword)
      return Promise.resolve({
        success: false,
        message: "Passwords no coinciden (mock)",
      });
    const idx = USERS.findIndex((u) => u.email === email);
    if (idx === -1)
      return Promise.resolve({
        success: false,
        message: "Usuario no encontrado (mock)",
      });
    USERS[idx].password = newPassword;
    return Promise.resolve({ success: true, message: "Mock resetPassword" });
  }

  async changePassword(
    token: string,
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    if (newPassword !== confirmPassword)
      return { success: false, message: "Passwords no coinciden (mock)" };

    const { success, message } = await tokenServiceMock.validateToken(token);
    if (!success)
      return Promise.resolve({
        success: false,
        message: `Token inválido: ${message} (mock)`,
      });
    const user = USERS.find((u) => u.email === email);
    if (!user)
      return Promise.resolve({
        success: false,
        message: "Usuario no encontrado (mock)",
      });
    if (user.password !== oldPassword)
      return Promise.resolve({
        success: false,
        message: "Contraseña anterior incorrecta (mock)",
      });
    user.password = newPassword;
    return Promise.resolve({ success: true });
  }
  async forgotPassword(email: string) {
    const user = USERS.find((u) => u.email === email);
    if (!user) {
      return Promise.resolve({
        success: false,
        message: "Usuario no encontrado (mock)",
      });
    }
    // Simular envío de email con OTP
    return Promise.resolve({
      success: true,
      message: "Mock forgotPassword",
      otp: "123456", // OTP simulado
    } as any);
  }
  async regenerateOtp(_data: { token: string; email: string }) {
    // Simular regeneración de OTP
    return {
      success: true,
      message: "Mock regenerateOtp",
      otp: "123456",
    } as any;
  }
}

export const authServiceMock = new AuthServiceMock();
