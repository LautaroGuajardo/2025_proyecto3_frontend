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
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    }
  },
  {
    _id: "2",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "3",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "4",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "5",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "6",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "7",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "8",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "9",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "10",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
  },
  {
    _id: "11",
    description: "Problema de facturación en el módulo X",
    claimType: ClaimType.BILLING,
    claimStatus: ClaimStatus.PENDING,
    criticality: Criticality.BLOCKER,
    priority: Priority.URGENT,
    project: PROJECTS[0],
    subarea: {
      _id: "1",
      name:"Red",
      area: {
        _id: "1",
        name: "Soporte",
      }
    },
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
              claim: newClaim._id,
              claimStatus: ClaimStatus.PENDING,
              priority: newClaim.priority,
              criticality: newClaim.criticality,
              action: "Creación de reclamo",
              user: undefined,
              subarea: (newClaim.subarea) as ClaimHistory['subarea'],
              startDate: new Date(),
              endDate: undefined,
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
          _id: String(Date.now()),
          claim: updated._id,
          claimStatus: updated.claimStatus ?? previous.claimStatus ?? ClaimStatus.PENDING,
          priority: updated.priority,
          criticality: updated.criticality,
          action: "Actualización de reclamo",
          user: USERS[0],
          subarea: (updated.subarea ?? previous.subarea) as ClaimHistory['subarea'],
          startDate: new Date(),
          endDate: undefined,
        };
        appendClaimHistoryMock(historyEntry);
    return { success: true, claim: CLAIMS[idx] };
  } 
}

export const claimServiceMock = new ClaimServiceMock();