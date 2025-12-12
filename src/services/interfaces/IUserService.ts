import type { User, UserFormData } from "@/types/User";

export interface IUserService {
  getAllUsers(
    token: string
  ): Promise<{ success: boolean; message?: string; users?: UserFormData[] }>;
  getUserByEmail(
    token: string,
    email: string
  ): Promise<{ success: boolean; message?: string; user?: UserFormData }>;
  getUserProfile(
    token: string
  ): Promise<{ success: boolean; message?: string; user?: User }>;
  updateUserByEmail(
    token: string,
    user: Partial<UserFormData>
  ): Promise<{ success: boolean; message?: string; user?: UserFormData }>;
  deleteUserByEmail(
    token: string,
    email: string
  ): Promise<{ success: boolean; message?: string }>;
  updateUserProfile(
    token: string,
    user: Partial<User>
  ): Promise<{ success: boolean; message?: string; user?: User }>;
}
