import type { IAuthService } from "@/services/interfaces/IAuthService";
import type { LoginFormDto, LoginResponseDto } from "@/dto/LoginFormDto";
import type { RegisterFormDto } from "@/dto/RegisterFormDto";
import { Role } from "@/types/Role";
import { USERS } from "./userServiceMock";

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
}

export const authServiceMock = new AuthServiceMock();
