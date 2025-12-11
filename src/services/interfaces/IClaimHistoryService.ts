import type { ClaimHistory } from "@/types/ClaimHistory";

export interface IClaimHistoryService {
  getClaimHistoryById(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string; claimHistory?: ClaimHistory[] }>;
}