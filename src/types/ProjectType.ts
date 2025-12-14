export const ProjectType = {
  COMMERCIAL: 'COMMERCIAL',
  MAINTENANCE: 'MAINTENANCE',
  PRODUCTION: 'PRODUCTION',
  SERVICES: 'SERVICES',
  CONSTRUCTION: 'CONSTRUCTION',
  TECHNOLOGY: 'TECHNOLOGY',
} as const;

export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];

export const isValidProjectType = (status: string): status is ProjectType => {
  return Object.values(ProjectType).includes(status as ProjectType);
};