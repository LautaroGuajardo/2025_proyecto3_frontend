import type { ProjectType } from "./ProjectType";
import type { UserFormData } from "./User";

export type Project = {
  _id: string;
  title: string;
  description: string;
  registrationDate: Date;
  user?: UserFormData;
  createdAt?: Date;
  projectType: ProjectType;
};