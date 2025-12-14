import { apiEndpoints } from "@/api/endpoints";
import { type ClaimHistory } from "@/types/ClaimHistory";
import type { IClaimHistoryService } from "@/services/interfaces/IClaimHistoryService";

class ClaimHistoryServiceReal implements IClaimHistoryService {
  async getClaimHistoryById(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string; claimHistory?: ClaimHistory[] }> {
    try {
      const response = await fetch(`${apiEndpoints.claims.GET_CLAIM_HISTORY(claimId)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Fallo al obtener el historial de reclamos");
      }
      const claimHistory: ClaimHistory[] = await response.json();
      return { success: true, claimHistory };
    } catch (error) {
      return { 
        success: false, 
        message:
          error instanceof Error ? error.message : "Error al obtener el historial de reclamos"
      };
    }
  }
}

export const claimHistoryServiceReal = new ClaimHistoryServiceReal();