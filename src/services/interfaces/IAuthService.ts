import type { LoginFormDto, LoginResponseDto } from "@/dto/LoginFormDto";
import type { RegisterFormDto } from "@/dto/RegisterFormDto";

export interface IAuthService {
  login(data: LoginFormDto): Promise<LoginResponseDto>;

  register(
    data: Omit<RegisterFormDto, "confirmPassword">
  ): Promise<{ success: boolean; message?: string }>;

  logout(token: string): Promise<{ success: boolean; message?: string }>;
}
