import type { Claim } from "@/types/Claim";
import type { IClaimService } from "@/services/interfaces/IClaimService";
import { Criticality } from "@/types/Criticality";
import { ClaimType } from "@/types/ClaimType";
import { Priority } from "@/types/Priority";
import { ClaimStatus } from "@/types/ClaimStatus";
import { PROJECTS } from "./projectServiceMock";
import { appendClaimHistoryMock } from "./claimHistoryServiceMock";
import type { ClaimHistory } from "@/types/ClaimHistory";
import { USERS } from "./userServiceMock";

export const CLAIMS: Claim[] = [
  {
    _id: "1",
    description: "Falla en autenticación",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "2",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "3",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "4",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "5",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "6",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "7",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "8",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "9",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "10",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    _id: "11",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
];

class ClaimServiceMock implements IClaimService {
  async getAllClaims(_token: string) {
    void _token; // Evitar warning de variable no usada
    return { success: true, claims: CLAIMS };
  }  
  async createClaim(_token: string, claim: Partial<Claim>) {
    const newClaim: Claim = {
      _id: (CLAIMS.length + 1).toString(),
      description: claim.description ?? "",
      claimType: claim.claimType ?? ClaimType.OTHER,
      claimStatus: ClaimStatus.PENDING ?? undefined,
      criticality: claim.criticality ?? Criticality.MINOR,
      priority: claim.priority ?? Priority.LOW,
      project: claim.project ?? PROJECTS[0],
      subarea: claim.subarea ?? undefined,
    };
    CLAIMS.push(newClaim);
    // ESTO AGREGA LA PRIMER ENTRADA AL HISTORIAL
    const historyEntry: ClaimHistory = {
      _id: String(Date.now()),
      claimId: newClaim._id,
      claimStatus: ClaimStatus.PENDING,
      priority: newClaim.priority,
      criticality: newClaim.criticality,
      action: "Creación de reclamo",
      area: newClaim.area ?? "",
      subarea: newClaim.subarea ?? "",
      startDateHour: new Date(),
      endDateHour: undefined,
    };
    appendClaimHistoryMock(historyEntry);

    return { success: true, claim: newClaim };
  }
    
  async updateClaimById(_token: string, claim: Partial<Claim>) {
    const idx = CLAIMS.findIndex((c) => c._id === claim._id);
    if (idx === -1) return { success: false, message: "Reclamo no encontrado (mock)" };
    const previous = CLAIMS[idx];
    const updated = { ...previous, ...claim } as Claim;
    CLAIMS[idx] = updated;

    // ESTO AGREGA EL CAMBIO AL HISTORIAL
    const historyEntry: ClaimHistory = {
      id: String(Date.now()),
      claimId: updated._id,
      claimStatus: updated.claimStatus,
      priority: updated.priority,
      criticality: updated.criticality,
      action: updated.actions,
      user: USERS[0],
      area: updated.area ?? previous.area ?? "",
      subarea: updated.subarea ?? previous.subarea ?? "",
      startDateHour: new Date(),
      endDateHour: undefined,
    };
    appendClaimHistoryMock(historyEntry);
    return { success: true, claim: CLAIMS[idx] };
  } 
}

export const claimServiceMock = new ClaimServiceMock();