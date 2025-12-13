import type { User } from "@/types/User";

export interface ICreateUserService {
  createUser(
    user: User
  ): Promise<{ success: boolean; message?: string }>;
}