import { apiEndpoints } from "@/api/endpoints";
import { type CreateUser, type User, type UserFormData } from "@/types/User";
import type { IUserService } from "@/services/interfaces/IUserService";

class UserServiceReal implements IUserService {
  async createUser(
    token: string,
    user: CreateUser
  ): Promise<{ success: boolean; message?: string; user?: UserFormData }> {
    try {
      const response = await fetch(apiEndpoints.users.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Error al crear el usuario");
      }
      const newUser: User = await response.json();
      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al crear el usuario",
      };
    }
  }

  async getAllUsers(
    token: string
  ): Promise<{ success: boolean; message?: string; users?: UserFormData[] }> {
    try {
      const response = await fetch(apiEndpoints.users.GET_ALL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const users: User[] = await response.json();
      return {
        success: true,
        users: users,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener los usuarios",
      };
    }
  }

  async getUserByEmail(
    token: string,
    email: string
  ): Promise<{ success: boolean; message?: string; user?: UserFormData }> {
    try {
      const response = await fetch(
        apiEndpoints.users.GET_USER_BY_EMAIL(email),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const user: User = await response.json();
      return {
        success: true,
        user: user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener los usuarios",
      };
    }
  }

  async deleteUserByEmail(
    token: string, 
    email: string
  ): Promise<{ success: boolean; message?: string; }> {
    try {
      const response = await fetch(
        apiEndpoints.users.DELETE_USER_BY_EMAIL(email),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al eliminar el usuario",
      };
    }
  }

  async getUserProfile(
    token: string
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const response = await fetch(apiEndpoints.users.GET_PROFILE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener el perfil del usuario");
      }
      const user: User = await response.json();
      return {
        success: true,
        user: user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener el perfil del usuario",
      };
    }
  }

  async updateUserById(
    token: string,
    user: UserFormData
  ): Promise<{ success: boolean; message?: string; user?: UserFormData }> {
    console.log("Updating user:", user);
    try {
      if (!user._id) {
        return {
          success: false,
          message: "El id es requerido para actualizar el usuario",
        };
      }

      const response = await fetch(
        apiEndpoints.users.UPDATE_USER_BY_ID(user._id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }
      const updatedUser = (await response.json()) as User;
      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al actualizar el usuario",
      };
    }
  }

  async changePassword(
    token: string,
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(apiEndpoints.users.CHANGE_PASSWORD(email), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          password_confirm: confirmPassword,
        }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          return { success: false, message: "Contraseña actual incorrecta" };
        }
        const errorData = (await response.json()) as { message: string };
        return {
          success: false,
          message: errorData.message || "Error al cambiar la contraseña",
        };
      }
      return { success: true, message: "Contraseña cambiada correctamente" };
    } catch {
      return { success: false, message: "Error al conectar con el servidor" };
    }
  }

  async updateUserProfile(
    token: string,
    user: User
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const response = await fetch(apiEndpoints.users.UPDATE_USER_PROFILE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar el perfil del usuario");
      }
      const userProfile = (await response.json()) as User;
      return {
        success: true,
        user: userProfile,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al actualizar el perfil del usuario",
      };
    }
  }
}

export const userServiceReal = new UserServiceReal();
