export const ProjectType = {
  COMERCIAL: "COMERCIAL",
  MANTENIMIENTO: "MANTENIMIENTO",
  PRODUCCION: "PRODUCCION",
  SERVICIOS: "SERVICIOS",
  CONSTRUCCION: "CONSTRUCCION",
  TECNOLOGIA: "TECNOLOGIA",
} as const;

export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];

export const isValidProjectType = (status: string): status is ProjectType => {
  return Object.values(ProjectType).includes(status as ProjectType);
};