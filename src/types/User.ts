import { Role } from "./Role";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  subarea?: string;
  area?: string;
};

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  subarea?: string;
  area?: string;
}
