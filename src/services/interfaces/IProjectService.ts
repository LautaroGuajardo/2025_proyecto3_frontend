import type { Project } from "@/types/Project";

export interface IProjectService {
  getAllProjects(
    token: string
  ): Promise<{ success: boolean; message?: string; projects?: Project[] }>;
  getProjectsByUserId(
    token: string,
    userId: string
  ): Promise<{ success: boolean; message?: string; projects?: Project[] }>;
  getProjectById(
    token: string,
    projectId: string
  ): Promise<{ success: boolean; message?: string; project?: Project }>;
  createProject(
    token: string,
    project: Partial<Project>
  ): Promise<{ success: boolean; message?: string; project?: Project }>;
  updateProjectById(
    token: string,
    projectId: string,
    project: Partial<Project>
  ): Promise<{ success: boolean; message?: string; project?: Project }>;
  deleteProjectById(
    token: string,
    projectId: string
  ): Promise<{ success: boolean; message?: string }>;
}