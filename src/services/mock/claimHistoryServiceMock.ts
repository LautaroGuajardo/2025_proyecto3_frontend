import type { IClaimHistoryService } from "../interfaces/IClaimHistoryService";
import type { ClaimHistory } from "@/types/ClaimHistory";
import { ClaimStatus } from "@/types/ClaimStatus";
import { USERS } from "./userServiceMock";
import { Priority } from "@/types/Priority";
import { Criticality } from "@/types/Criticality";

const CLAIM_HISTORY: ClaimHistory[] = [
  {
    _id: "1",
    claim: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.PENDING,
    action: "",
    user: USERS[2],
    subarea:{
      _id: "1",
      name: "Redes",
      area: {
        _id: "1",
        name: "Infraestructura"
      }
    },
    startDate: new Date(2025,1,11,14,42,0),
    endDate: new Date(2025,2,12,10,55,15)
  },
  {
    _id: "2",
    claim: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.IN_PROGRESS,
    action: "",
    subarea:{
      _id: "1",
      name: "Redes",
      area: {
        _id: "1",
        name: "Infraestructura"
      }
    },
    user: USERS[2],
    startDate: new Date(2025,2,12,10,55,15),
    endDate: new Date(2025,3,13,12,30,15)
  },
  {
    _id: "3",
    claim: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.IN_PROGRESS,
    action: "",
    subarea:{
      _id: "1",
      name: "Redes",
      area: {
        _id: "1",
        name: "Infraestructura"
      }
    },
    user: USERS[2],
    startDate: new Date(2025,3,13,12,30,15),
    endDate: new Date(2025,4,14,18,40,15)
  },
  {
    _id: "4",
    claim: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.IN_PROGRESS,
    action: "",
    subarea:{
      _id: "1",
      name: "Redes",
      area: {
        _id: "1",
        name: "Infraestructura"
      }
    },
    user: USERS[2],
    startDate: new Date(2025,4,14,18,40,15),
    endDate: new Date(2025,5,15,20,50,15)
  },
  {
    _id: "5",
    claim: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.PENDING,
    action: "",
    subarea:{
      _id: "1",
      name: "Redes",
      area: {
        _id: "1",
        name: "Infraestructura"
      }
    },
    user: USERS[2],
    startDate: new Date(2025,5,15,20,50,15),
    endDate: new Date(2025,6,16,22,0,15)
  },
  {
    _id: "6",
    claim: "1",
    priority: Priority.HIGH,
    criticality: Criticality.MAJOR,
    claimStatus: ClaimStatus.PENDING,
    action: "",
    subarea:{
      _id: "1",
      name: "Redes",
      area: {
        _id: "1",
        name: "Infraestructura"
      }
    },
    user: USERS[2],
    startDate: new Date(2025,6,16,22,0,15),
    endDate: undefined,
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
      const candidateId = c.claim;
      return String(candidateId) === String(claimId);
    });
    return { success: true, claimHistory };
  }
}

export const claimHistoryServiceMock = new ClaimHistoryServiceMock();