import { apiEndpoints } from "@/api/endpoints";
import type { Project } from "@/types/Project";
import type { IProjectService } from "@/services/interfaces/IProjectService";

class ProjectServiceReal implements IProjectService {
  async getAllProjects(
    token: string
  ): Promise<{ success: boolean; message?: string; projects?: Project[] }> {
    try {
      const response = await fetch(apiEndpoints.projects.GET_ALL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los proyectos");
      }
      const projects: Project[] = await response.json();
      return {
        success: true,
        projects: projects,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener los proyectos",
      };
    }
  }

  async createProject(
    token: string,
    project: Partial<Project>
  ): Promise<{ success: boolean; message?: string; project?: Project }>{
    try {
      const response = await fetch(apiEndpoints.projects.CREATE_PROJECT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
      });
      if (!response.ok) {
        throw new Error("Error al crear el proyecto");
      }
      const createdProject: Project = await response.json();
      return {
        success: true,
        project: createdProject,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al crear el proyecto",
      };
    }
  }
  async updateProjectById(
    token: string,
    project: Partial<Project>
  ): Promise<{ success: boolean; message?: string; project?: Project }>{
    try {
      const response = await fetch(
        apiEndpoints.projects.UPDATE_PROJECT(project._id?.toString() || ""),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(project),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el proyecto");
      }
      const updatedProject: Project = await response.json();
      return {
        success: true,
        project: updatedProject,
      };
    }catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al actualizar el proyecto",
      };
    }
  }

  async deleteProjectById(
    token: string,
    projectId: string
  ): Promise<{ success: boolean; message?: string }>{
    try {
      const response = await fetch(
        apiEndpoints.projects.DELETE_PROJECT(projectId),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el proyecto");
      }
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al eliminar el proyecto",
      };
    }
  }
}
export const projectServiceReal = new ProjectServiceReal();