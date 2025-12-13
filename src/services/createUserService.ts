
import type { User } from "@/types/User";
import { apiEndpoints } from "@/api/endpoints";
import type { ICreateUserService } from "./interfaces/ICreateUserService";

class CreateUserServiceReal implements ICreateUserService {
  async createUser(
    user: User
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(apiEndpoints.create_user.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Error al crear el usuario",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Error de red al crear el usuario",
      };
    }
  }
}

export const createUserServiceReal = new CreateUserServiceReal();