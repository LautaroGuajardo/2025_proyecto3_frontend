import type { ICreateUserService } from "@/services/interfaces/ICreateUserService";
import type { User } from "@/types/User";
import { appendUserMock, USERS } from "./userServiceMock";

class CreateUserServiceMock implements ICreateUserService {
  async createUser(
    user: User
  ): Promise<{ success: boolean; message?: string }> {
    const exists = USERS.some((u) => u.email === user.email);
      if (exists) {
        return Promise.resolve({
          success: false,
          message: "Usuario ya existente",
        });
      }
    appendUserMock(user);
    return { success: true };
  }
}
export const createUserServiceMock = new CreateUserServiceMock();