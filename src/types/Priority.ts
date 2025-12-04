export const Priority = {
  URGENTE: "URGENTE",
  ALTA: "ALTA",
  MEDIA: "MEDIA",
  BAJA: "BAJA",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const isValidPriority = (status: string): status is Priority => {
  return Object.values(Priority).includes(status as Priority);
};