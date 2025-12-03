export const ProjectType = {
  COMERCIAL: "COMERCIAL",
  MANTENIMIENTO: "MANTENIMIENTO",
  PRODUCCION: "PRODUCCION",
  SERVICIOS: "SERVICIOS",
  CONSTRUCCION: "CONSTRUCCION",
  TECNOLOGIA: "TECNOLOGIA",
} as const;

export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];

export const isValidProjectType = (projectType: string): projectType is ProjectType => {
  return Object.values(ProjectType).includes(projectType as ProjectType);
};