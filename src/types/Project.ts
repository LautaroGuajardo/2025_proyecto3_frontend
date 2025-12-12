import type { ProjectType } from "./ProjectType";
import type { UserFormData } from "./User";

export type Project = {
  id: string;
  title: string;
  description: string;
  registrationDate: Date;
  user?: UserFormData;
  projectType: ProjectType;
};