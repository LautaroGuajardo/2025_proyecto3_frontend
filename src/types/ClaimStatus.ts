export const ClaimStatus = {
  PENDIENTE: "PENDIENTE",
  PROGRESO: "PROGRESO",
  RESUELTO: "RESUELTO",
} as const;

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];

export const isValidClaimStatus = (status: string): status is ClaimStatus => {
  return Object.values(ClaimStatus).includes(status as ClaimStatus);
};
