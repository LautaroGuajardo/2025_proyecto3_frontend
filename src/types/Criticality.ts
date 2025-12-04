export const Criticality = {
  BLOQUEANTE: "BLOQUEANTE",
  CRITICA: "CRITICA",
  ALTA: "ALTA",
  MEDIA: "MEDIA",
  BAJA: "BAJA",
} as const;

export type Criticality = (typeof Criticality)[keyof typeof Criticality];

export const isValidCriticality = (status: string): status is Criticality => {
  return Object.values(Criticality).includes(status as Criticality);
};
