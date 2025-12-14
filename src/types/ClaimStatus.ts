export const ClaimStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
} as const;

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];

export const isValidClaimStatus = (status: string): status is ClaimStatus => {
  return Object.values(ClaimStatus).includes(status as ClaimStatus);
};
