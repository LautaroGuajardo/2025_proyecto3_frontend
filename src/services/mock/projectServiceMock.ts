import type { IProjectService } from "@/services/interfaces/IProjectService";
import type { Project } from "@/types/Project";
import { ProjectType } from "@/types/ProjectType";
import { USERS } from "./userServiceMock";

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Proyecto Alpha",
    description: "Implementación inicial del sistema Alpha",
    registrationDate: new Date("2025-01-10T09:00:00Z"),
    user: USERS[1],
    projectType: ProjectType.TECNOLOGIA,
  },
  {
    id: "2",
    title: "Proyecto Beta",
    description: "Mantenimiento y mejoras para Beta",
    registrationDate: new Date("2025-02-15T10:30:00Z"),
    user: USERS[1],
    projectType: ProjectType.MANTENIMIENTO,
  },
  {
    id: "3",
    title: "Proyecto Gamma",
    description: "Despliegue en producción de Gamma",
    registrationDate: new Date("2025-03-20T14:15:00Z"),
    user: USERS[1],
    projectType: ProjectType.PRODUCCION,
  },
  {
    id: "4",
    title: "Proyecto Delta",
    description: "Servicios asociados al proyecto Delta",
    registrationDate: new Date("2025-04-05T08:45:00Z"),
    user: USERS[1],
    projectType: ProjectType.SERVICIOS,
  },
  {
    id: "5",
    title: "Proyecto Escondido",
    description: "Nadie debe saberlo",
    registrationDate: new Date("2025-04-05T08:45:00Z"),
    user: USERS[1],
    projectType: ProjectType.SERVICIOS,
  },
  {
    id: "6",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMERCIAL,
  },
  {
    id: "7",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMERCIAL,
  },
  {
    id: "8",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMERCIAL,
  },
  {
    id: "9",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMERCIAL,
  },
  {
    id: "10",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMERCIAL,
  },
  {
    id: "11",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMERCIAL,
  },
  {
    id: "12",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMERCIAL,
  },
];

class ProjectServiceMock implements IProjectService {
  async getAllProjects(_token: string) {
    void _token; // Evitar warning de variable no usada
    return { success: true, projects: PROJECTS };
  }

  async getProjectsByUserId(_token: string, userId: string) {
    const projects = PROJECTS.filter((p) => p.user.email === userId);
    return { success: true, projects };
  }

  async getProjectById(_token: string, projectId: string) {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return { success: false, message: "Proyecto no encontrado (mock)" };
    return { success: true, project };
  }

  async createProject(_token: string, project: Partial<Project>) {
    const newProject: Project = {
      id: "20",
      title: project.title ?? "Nuevo Proyecto",
      description: project.description ?? "",
      registrationDate: project.registrationDate ?? new Date(),
      user: project.user ?? USERS[1],
      projectType: project.projectType ?? ProjectType.COMERCIAL,
    };
    PROJECTS.push(newProject);
    return { success: true, project: newProject };
  }

  async updateProjectById(_token: string, projectId: string, project: Partial<Project>) {
    const idx = PROJECTS.findIndex((p) => p.id === projectId);
    if (idx === -1) return { success: false, message: "Proyecto no encontrado (mock)" };
    PROJECTS[idx] = { ...PROJECTS[idx], ...project };
    return { success: true, project: PROJECTS[idx] };
  }

  async deleteProjectById(_token: string, projectId: string) {
    const idx = PROJECTS.findIndex((p) => p.id === projectId);
    if (idx === -1) return { success: false, message: "Proyecto no encontrado (mock)" };
    PROJECTS.splice(idx, 1);
    return { success: true };
  }
}

export const projectServiceMock = new ProjectServiceMock();
