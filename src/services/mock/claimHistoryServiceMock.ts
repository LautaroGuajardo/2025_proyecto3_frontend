import type { IClaimHistoryService } from "../interfaces/IClaimHistoryService";
import type { ClaimHistory } from "@/types/ClaimHistory";
import { ClaimStatus } from "@/types/ClaimStatus";
import { USERS } from "./userServiceMock";
import { Priority } from "@/types/Priority";
import { Criticality } from "@/types/Criticality";

const CLAIM_HISTORY: ClaimHistory[] = [
  {
    _id: "1",
    claimId: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.PENDING,
    action: "",
    user: USERS[2],
    area: "Infraestructura",
    subarea: "Redes",
    startDateHour: new Date(2025,1,11,14,42,0),
    endDateHour: new Date(2025,2,12,10,55,15)
  },
  {
    _id: "2",
    claimId: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.IN_PROGRESS,
    action: "",
    area: "Infraestructura",
    subarea: "Redes",
    user: USERS[2],
    startDateHour: new Date(2025,2,12,10,55,15),
    endDateHour: new Date(2025,3,13,12,30,15)
  },
  {
    _id: "3",
    claimId: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.IN_PROGRESS,
    action: "",
    area: "Infraestructura",
    subarea: "Redes",
    user: USERS[2],
    startDateHour: new Date(2025,3,13,12,30,15),
    endDateHour: new Date(2025,4,14,18,40,15)
  },
  {
    _id: "4",
    claimId: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.IN_PROGRESS,
    action: "",
    area: "Infraestructura",
    subarea: "Redes",
    user: USERS[2],
    startDateHour: new Date(2025,4,14,18,40,15),
    endDateHour: new Date(2025,5,15,20,50,15)
  },
  {
    _id: "5",
    claimId: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.PENDING,
    action: "",
    area: "Infraestructura",
    subarea: "Redes",
    user: USERS[2],
    startDateHour: new Date(2025,5,15,20,50,15),
    endDateHour: new Date(2025,6,16,22,0,15)
  },
  {
    _id: "6",
    claimId: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.PENDING,
    action: "",
    area: "Infraestructura",
    subarea: "Redes",
    user: USERS[2],
    startDateHour: new Date(2025,6,16,22,0,15),
    endDateHour: undefined,
  },
]

export const appendClaimHistoryMock = (entry: ClaimHistory) => {
  CLAIM_HISTORY.push(entry);
  console.log("Mock appendClaimHistory:", entry);
};

class ClaimHistoryServiceMock implements IClaimHistoryService {
  async getClaimHistoryById(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string; claimHistory?: ClaimHistory[] }> {
    void token;
    const claimHistory = CLAIM_HISTORY.filter((c) => {
      const candidateId = c.claimId;
      return String(candidateId) === String(claimId);
    });
    return { success: true, claimHistory };
  }
}

export const claimHistoryServiceMock = new ClaimHistoryServiceMock();