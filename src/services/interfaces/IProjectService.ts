import type { Project } from "@/types/Project";

export interface IProjectService {
  getAllProjects(
    token: string
  ): Promise<{ success: boolean; message?: string; projects?: Project[] }>;
  createProject(
    token: string,
    project: Partial<Project>
  ): Promise<{ success: boolean; message?: string; project?: Project }>;
  updateProjectById(
    token: string,
    project: Partial<Project>
  ): Promise<{ success: boolean; message?: string; project?: Project }>;
  deleteProjectById(
    token: string,
    project: string
  ): Promise<{ success: boolean; message?: string }>;
}