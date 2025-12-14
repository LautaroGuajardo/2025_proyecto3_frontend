import { Role } from "./Role";

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
};

export interface UserFormData {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
}
