export const ClaimType = {
  TECHNICAL: 'TECHNICAL',
  BILLING: 'BILLING',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE',
  OTHER: 'OTHER',
} as const;

export type ClaimType = (typeof ClaimType)[keyof typeof ClaimType];

export const isValidClaimType = (status: string): status is ClaimType => {
  return Object.values(ClaimType).includes(status as ClaimType);
};