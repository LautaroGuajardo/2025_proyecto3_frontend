import type { IProjectService } from "@/services/interfaces/IProjectService";
import type { Project } from "@/types/Project";
import { ProjectType } from "@/types/ProjectType";
import { USERS } from "./userServiceMock";

export const PROJECTS: Project[] = [
  {
    _id: "1",
    title: "Proyecto Alpha",
    description: "Implementación inicial del sistema Alpha",
    registrationDate: new Date("2025-01-10T09:00:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMMERCIAL,
  },
  {
    _id: "2",
    title: "Proyecto Beta",
    description: "Mantenimiento y mejoras para Beta",
    registrationDate: new Date("2025-02-15T10:30:00Z"),
    user: USERS[1],
    projectType: ProjectType.CONSTRUCTION,
  },
  {
    _id: "3",
    title: "Proyecto Gamma",
    description: "Despliegue en producción de Gamma",
    registrationDate: new Date("2025-03-20T14:15:00Z"),
    user: USERS[1],
    projectType: ProjectType.MAINTENANCE,
  },
  {
    _id: "4",
    title: "Proyecto Delta",
    description: "Servicios asociados al proyecto Delta",
    registrationDate: new Date("2025-04-05T08:45:00Z"),
    user: USERS[1],
    projectType: ProjectType.PRODUCTION,
  },
  {
    _id: "5",
    title: "Proyecto Escondido",
    description: "Nadie debe saberlo",
    registrationDate: new Date("2025-04-05T08:45:00Z"),
    user: USERS[1],
    projectType: ProjectType.TECHNOLOGY,
  },
  {
    _id: "6",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMMERCIAL,
  },
  {
    _id: "7",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMMERCIAL,
  },
  {
    _id: "8",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.COMMERCIAL,
  },
  {
    _id: "9",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.PRODUCTION,
  },
  {
    _id: "10",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.SERVICES,
  },
  {
    _id: "11",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.TECHNOLOGY,
  },
  {
    _id: "12",
    title: "Proyecto Epsilon",
    description: "Nuevo proyecto para el cliente 2",
    registrationDate: new Date("2025-05-12T11:20:00Z"),
    user: USERS[1],
    projectType: ProjectType.MAINTENANCE,
  },
];

class ProjectServiceMock implements IProjectService {
  async getAllProjects(_token: string) {
    void _token; // Evitar warning de variable no usada
    return { success: true, projects: PROJECTS };
  }

  async createProject(_token: string, project: Partial<Project>) {
    const newProject: Project = {
      _id: "20",
      title: project.title ?? "Nuevo Proyecto",
      description: project.description ?? "",
      registrationDate: project.registrationDate ?? new Date(),
      user: project.user ?? USERS[1],
      projectType: project.projectType ?? ProjectType.COMMERCIAL,
    };
    PROJECTS.push(newProject);
    return { success: true, project: newProject };
  }

  async updateProjectById(_token: string, project: Partial<Project>) {
    const idx = PROJECTS.findIndex((p) => p._id === project._id);
    if (idx === -1) return { success: false, message: "Proyecto no encontrado (mock)" };
    PROJECTS[idx] = { ...PROJECTS[idx], ...project };
    return { success: true, project: PROJECTS[idx] };
  }

  async deleteProjectById(_token: string, project: string) {
    const idx = PROJECTS.findIndex((p) => p._id === project);
    if (idx === -1) return { success: false, message: "Proyecto no encontrado (mock)" };
    PROJECTS.splice(idx, 1);
    return { success: true };
  }
}

export const projectServiceMock = new ProjectServiceMock();
