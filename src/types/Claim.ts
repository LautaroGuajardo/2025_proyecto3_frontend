import type { ClaimStatus } from "./ClaimStatus";
import type { ClaimType } from "./ClaimType";
import type { Criticality } from "./Criticality";
import type { Priority } from "./Priority";
import type { Project } from "./Project";

export interface Claim {
  id: string;
  claimCode: string;
  claimStatus?: ClaimStatus;
  description: string;
  claimType: ClaimType;
  criticality: Criticality;
  priority: Priority;
  project: Project;
  subarea?: string;
  area?: string;
  actions?: string;
}