import type { ProjectType } from "./ProjectType";
import type { User } from "./User";

export type Project = {
  id: string;
  title: string;
  description: string;
  registrationDate: Date;
  user: User;
  estaActivo: boolean;
  projectType: ProjectType;
};