export const ClaimType = {
  TECNICO: "TECNICO",
  FACTURACION: "FACTURACION",
  ATENCION_CLIENTE: "ATENCION_CLIENTE",
  OTRO: "OTRO",
} as const;

export type ClaimType = (typeof ClaimType)[keyof typeof ClaimType];

export const isValidClaimType = (status: string): status is ClaimType => {
  return Object.values(ClaimType).includes(status as ClaimType);
};