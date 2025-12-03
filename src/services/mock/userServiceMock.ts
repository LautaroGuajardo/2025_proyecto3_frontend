import type { IUserService } from "@/services/interfaces/IUserService";
import { Role } from "@/types/Role";
import type { User } from "@/types/User";

export type UserWithPassword = User & { password: string };

export const USERS: UserWithPassword[] = [
  {
    id: "1",
    email: "admin1@example.com",
    firstName: "John",
    lastName: "Doe",
    active: true,
    role: Role.ADMIN,
    phone: "5551234567",
    password: "admin1pass",
  },
  {
    id: "2",
    email: "customer1@example.com",
    firstName: "Jane",
    lastName: "Smith",
    active: true,
    role: Role.CUSTOMER,
    phone: "5559876543",
    password: "customer1pass",
  },
  {
    id: "3",
    email: "user1@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    active: true,
    role: Role.USER,
    phone: "5555678901",
    password: "user1pass",
  },
  {
    id: "4",
    email: "user2@example.com",
    firstName: "Bob",
    lastName: "Brown",
    active: true,
    role: Role.USER,
    phone: "5556789012",
    password: "user2pass",
  },
  {
    id: "5",
    email: "customer2@example.com",
    firstName: "usuario",
    lastName: "5",
    active: true,
    role: Role.CUSTOMER,
    phone: "5559876543",
    password: "customer2pass",
  },
];

class UserServiceMock implements IUserService {
  updateUserProfile(
    _token: string,
    user: Partial<User>
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    const index = USERS.findIndex((u) => u.email === user.email);
    if (index !== -1) {
      USERS[index] = { ...USERS[index], ...user };
      return Promise.resolve({
        success: true,
        user: USERS[index],
      });
    } else {
      return Promise.resolve({
        success: false,
        message: "Usuario no encontrado (mock)",
      });
    }
  }
  async getAllUsers(
    _token: string
  ): Promise<{ success: boolean; users?: User[]; message?: string }> {
    void _token; // Evitar warning de variable no usada
    return {
      success: true,
      users: USERS,
    };
  }

  async getUserByEmail(_token: string, email: string) {
    const user = USERS.find((u) => u.email === email);
    if (user) {
      return Promise.resolve({ success: true, user });
    } else {
      return Promise.resolve({
        success: false,
        message: "Usuario no encontrado (mock)",
      });
    }
  }

  async getUserProfile(
    _token: string
  ): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const [email] = atob(_token).split(":");
      const user = USERS.find((u) => u.email === email);
      if (!user)
        return Promise.resolve({
          success: false,
          message: "Usuario no encontrado (mock)",
        });
      return Promise.resolve({ success: true, user });
    } catch {
      return Promise.resolve({
        success: false,
        message: "Token inválido (mock)",
      });
    }
  }

  async updateUserByEmail(
    _token: string,
    userEmail: string,
    user: Partial<User>
  ): Promise<{ success: boolean; user?: User; message?: string }> {
    const index = USERS.findIndex((u) => u.email === userEmail);
    if (index !== -1) {
      USERS[index] = { ...USERS[index], ...user };
      return Promise.resolve({ success: true, user: USERS[index] });
    } else {
      return Promise.resolve({
        success: false,
        message: "Usuario no encontrado (mock)",
      });
    }
  }

  async changePassword(
    _token: string,
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    if (newPassword !== confirmPassword)
      return Promise.resolve({
        success: false,
        message: "Passwords no coinciden (mock)",
      });

    const index = USERS.findIndex((u) => u.email === email);
    if (index === -1) {
      return Promise.resolve({
        success: false,
        message: "Usuario no encontrado (mock)",
      });
    }
    if (USERS[index].password !== oldPassword) {
      return Promise.resolve({
        success: false,
        message: "Contraseña anterior incorrecta (mock)",
      });
    }
    USERS[index].password = newPassword;
    return Promise.resolve({
      success: true,
      message: "Contraseña cambiada (mock)",
    });
  }
}

export const userServiceMock = new UserServiceMock();
