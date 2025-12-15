import type { IUserService } from "@/services/interfaces/IUserService";
import { Role } from "@/types/Role";
import type { User, UserFormData } from "@/types/User";

export const USERS: User[] = [
  {
    _id: "1",
    email: "admin1@example.com",
    firstName: "John",
    lastName: "Doe",
    role: Role.ADMIN,
    phone: "5551234567",
    password: "admin1pass",
  },
  {
    _id: "2",
    email: "customer1@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: Role.CUSTOMER,
    phone: "5559876543",
    password: "customer1pass",
  },
  {
    _id: "3",
    email: "user1@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    role: Role.USER,
    phone: "5555678901",
    password: "user1pass",
  },
  {
    _id: "4",
    email: "user2@example.com",
    firstName: "Bob",
    lastName: "Brown",
    role: Role.USER,
    phone: "5556789012",
    password: "user2pass",
  },
  {
    _id: "5",
    email: "customer2@example.com",
    firstName: "usuario",
    lastName: "5",
    role: Role.CUSTOMER,
    phone: "5559876543",
    password: "customer2pass",
  },
];

export const appendUserMock = (entry: User) => {
  USERS.push(entry);
};

class UserServiceMock implements IUserService {
  updateUserProfile(
    _token: string,
    user: UserFormData
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    const index = USERS.findIndex((u) => u.email === user.email);
    if (index !== -1) {
      USERS[index] = { ...USERS[index], ...user };
      return Promise.resolve({
        success: true,
        user: USERS[index] as unknown as User,
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
  ): Promise<{ success: boolean; users?: UserFormData[]; message?: string }> {
    void _token; // Evitar warning de variable no usada
    return {
      success: true,
      users: USERS,
    };
  }

  async getUserByEmail(
    _token: string, 
    email: string
  ): Promise<{ success: boolean; user?: UserFormData; message?: string }> {
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

  async deleteUserByEmail(
    _token: string,
    email: string
  ): Promise<{ success: boolean; message?: string }> {
    const index = USERS.findIndex((u) => u.email === email);
    if (index !== -1) {
      USERS.splice(index, 1);
      return Promise.resolve({ success: true });
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
      const userWithId: User = { ...user };
      return Promise.resolve({ success: true, user: userWithId });
    } catch {
      return Promise.resolve({
        success: false,
        message: "Token inválido (mock)",
      });
    }
  }

  async updateUserByEmail(
    _token: string,
    user: Partial<UserFormData>
  ): Promise<{ success: boolean; user?: UserFormData; message?: string }> {
    const index = USERS.findIndex((u) => u.email === user.email);
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
