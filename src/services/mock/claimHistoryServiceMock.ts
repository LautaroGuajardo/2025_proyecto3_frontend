import type { IClaimHistoryService } from "../interfaces/IClaimHistoryService";
import type { ClaimHistory } from "@/types/ClaimHistory";
import { ClaimStatus } from "@/types/ClaimStatus";
import { CLAIMS } from "./claimServiceMock"
import { USERS } from "./userServiceMock";

const CLAIM_HISTORY: ClaimHistory[] = [
  {
    id: "1",
    claim: CLAIMS[0],
    claimStatus: ClaimStatus.PENDIENTE,
    accion: "",
    user: USERS[2],
    startDateHour: new Date(2025,1,11,14,42,0),
    endDateHour: new Date(2025,2,12,10,55,15)
  },
  {
    id: "2",
    claim: CLAIMS[0],
    claimStatus: ClaimStatus.PROGRESO,
    accion: "",
    user: USERS[2],
    startDateHour: new Date(2025,2,12,10,55,15),
    endDateHour: new Date(2025,3,13,12,30,15)
  },
  {
    id: "3",
    claim: CLAIMS[0],
    claimStatus: ClaimStatus.PROGRESO,
    accion: "",
    user: USERS[2],
    startDateHour: new Date(2025,3,13,12,30,15),
    endDateHour: new Date(2025,4,14,18,40,15)
  },
  {
    id: "4",
    claim: CLAIMS[0],
    claimStatus: ClaimStatus.PROGRESO,
    accion: "",
    user: USERS[2],
    startDateHour: new Date(2025,4,14,18,40,15),
    endDateHour: new Date(2025,5,15,20,50,15)
  },
  {
    id: "5",
    claim: CLAIMS[0],
    claimStatus: ClaimStatus.PENDIENTE,
    accion: "",
    user: USERS[2],
    startDateHour: new Date(2025,5,15,20,50,15),
    endDateHour: new Date(2025,6,16,22,0,15)
  },
  {
    id: "6",
    claim: CLAIMS[0],
    claimStatus: ClaimStatus.PENDIENTE,
    accion: "",
    user: USERS[2],
    startDateHour: new Date(2025,6,16,22,0,15),
    endDateHour: undefined,
  },
]

class ClaimHistoryServiceMock implements IClaimHistoryService {
  async getClaimHistoryById(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string; claimHistory?: ClaimHistory[] }> {
    void token;
    const claimHistory = CLAIM_HISTORY.filter((c) => {
      const candidateId = c.claim && typeof c.claim === "object" ? c.claim.id : c.claim;
      return String(candidateId) === String(claimId);
    });
    return { success: true, claimHistory };
  }
}

export const claimHistoryServiceMock = new ClaimHistoryServiceMock();