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
    id: "1",
    claimCode: "RC-0001",
    description: "Falla en autenticación",
    claimType: ClaimType.TECNICO,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.ALTA,
    priority: Priority.URGENTE,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "2",
    claimCode: "RC-0002",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "3",
    claimCode: "RC-0003",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "4",
    claimCode: "RC-0004",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "5",
    claimCode: "RC-0005",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "6",
    claimCode: "RC-0006",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "7",
    claimCode: "RC-0007",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "8",
    claimCode: "RC-0008",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.RESUELTO,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "9",
    claimCode: "RC-0009",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.RESUELTO,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "10",
    claimCode: "RC-0010",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
    project: PROJECTS[0],
    area: "Soporte",
    subarea: "Red",
  },
  {
    id: "11",
    claimCode: "RC-0011",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.FACTURACION,
    claimStatus: ClaimStatus.PENDIENTE,
    criticality: Criticality.MEDIA,
    priority: Priority.ALTA,
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
      id: (CLAIMS.length + 1).toString(),
      claimCode: claim.claimCode ?? `RC-00${CLAIMS.length + 1}`,
      description: claim.description ?? "",
      claimType: claim.claimType ?? ClaimType.OTRO,
      claimStatus: ClaimStatus.PENDIENTE ?? undefined,
      criticality: claim.criticality ?? Criticality.BAJA,
      priority: claim.priority ?? Priority.BAJA,
      project: claim.project ?? PROJECTS[0],
      subarea: claim.subarea ?? undefined,
    };
    CLAIMS.push(newClaim);
    // ESTO AGREGA LA PRIMER ENTRADA AL HISTORIAL
    const historyEntry: ClaimHistory = {
      id: String(Date.now()),
      claimId: newClaim.id,
      claimStatus: ClaimStatus.PENDIENTE,
      claimType: newClaim.claimType,
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
    const idx = CLAIMS.findIndex((c) => c.id === claim.id);
    if (idx === -1) return { success: false, message: "Reclamo no encontrado (mock)" };
    const previous = CLAIMS[idx];
    const updated = { ...previous, ...claim } as Claim;
    CLAIMS[idx] = updated;

    // ESTO AGREGA EL CAMBIO AL HISTORIAL
    const historyEntry: ClaimHistory = {
      id: String(Date.now()),
      claimId: updated.id,
      claimStatus: updated.claimStatus,
      claimType: updated.claimType,
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