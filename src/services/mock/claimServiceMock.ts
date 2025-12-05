import type { Claim } from "@/types/Claim";
import type { IClaimService } from "@/services/interfaces/IClaimService";
import { Role } from "@/types/Role";
import { ClaimStatus } from "@/types/ClaimStatus";
import { Criticality } from "@/types/Criticality";
import { ClaimType } from "@/types/ClaimType";
import { Priority } from "@/types/Priority";
import { ProjectType } from "@/types/ProjectType";
import { SUBAREA } from "./subareaServiceMock";

const CUSTOMER_USER = {
  id: "2",
  email: "customer1@example.com",
  firstName: "Jane",
  lastName: "Smith",
  active: true,
  role: Role.CUSTOMER,
  phone: "5559876543",
  password: "customer1pass",
};

const SAMPLE_PROJECT = {
  id: "1",
  title: "Proyecto Alpha",
  description: "Proyecto de ejemplo para reclamos",
  registrationDate: new Date("2025-01-10T09:00:00Z"),
  user: CUSTOMER_USER,
  projectType: ProjectType.TECNOLOGIA,
};

const CLAIMS: Claim[] = [
  {
  	id: "1",
  	claimCode: "RC-0001",
  	description: "Falla en autenticación",
  	claimType: ClaimType.TECNICO,
  	claimStatus: ClaimStatus.PENDIENTE,
  	criticality: Criticality.ALTA,
  	priority: Priority.URGENTE,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.INFRAESTRUCTURA,
  },
  {
  	id: "2",
  	claimCode: "RC-0002",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "3",
  	claimCode: "RC-0003",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "4",
  	claimCode: "RC-0004",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "5",
  	claimCode: "RC-0005",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "6",
  	claimCode: "RC-0006",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "7",
  	claimCode: "RC-0007",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "8",
  	claimCode: "RC-0008",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "9",
  	claimCode: "RC-0009",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "10",
  	claimCode: "RC-0010",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
  {
  	id: "11",
  	claimCode: "RC-0011",
  	description: "Problema de facturación en el módulo X",
  	claimType: ClaimType.FACTURACION,
  	claimStatus: ClaimStatus.PROGRESO,
  	criticality: Criticality.MEDIA,
  	priority: Priority.ALTA,
  	project: SAMPLE_PROJECT,
  	subarea: SUBAREA.COBRANZAS,
  },
];

class ClaimServiceMock implements IClaimService {
  async getAllClaims(_token: string) {
    void _token; // Evitar warning de variable no usada
    return { success: true, claims: CLAIMS };
  }  
  async getClaimById(_token: string, claimId: string) {
  	const claim = CLAIMS.find((c) => c.id === claimId);
  	if (!claim) return { success: false, message: "Reclamo no encontrado (mock)" };
  	return { success: true, claim };
  }  
  async createClaim(_token: string, claim: Partial<Claim>) {
  	const newClaim: Claim = {
      id: (CLAIMS.length + 1).toString(),
  	  claimCode: claim.claimCode ?? `RC-00${CLAIMS.length + 1}`,
  	  description: claim.description ?? "",
  	  claimType: claim.claimType ?? ClaimType.OTRO,
  	  claimStatus: ClaimStatus.PENDIENTE,
  	  criticality: claim.criticality ?? Criticality.BAJA,
  	  priority: claim.priority ?? Priority.BAJA,
  	  project: claim.project ?? SAMPLE_PROJECT,
  	  subarea: claim.subarea ?? SUBAREA.ADMINISTRACION,
  	};
  	CLAIMS.push(newClaim);
  	return { success: true, claim: newClaim };
  }  
  async updateClaimById(_token: string, claimId: string, claim: Partial<Claim>) {
  	const idx = CLAIMS.findIndex((c) => c.id === claimId);
  	if (idx === -1) return { success: false, message: "Reclamo no encontrado (mock)" };
  	CLAIMS[idx] = { ...CLAIMS[idx], ...claim } as Claim;
  	return { success: true, claim: CLAIMS[idx] };
  }  
  async deleteClaimById(_token: string, claimId: string) {
  	const idx = CLAIMS.findIndex((c) => c.id === claimId);
  	if (idx === -1) return { success: false, message: "Reclamo no encontrado (mock)" };
  	CLAIMS.splice(idx, 1);
  	return { success: true };
  }
}

export const claimServiceMock = new ClaimServiceMock();