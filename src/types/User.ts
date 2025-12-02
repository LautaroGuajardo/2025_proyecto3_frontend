import type { Subarea } from "./Subarea";
import { Role } from "./Role";

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  role: Role;
  phone?: string;
  fechaRegistro?: Date;
  subArea?: Subarea;
};
