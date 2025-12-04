import type { ClaimStatus } from "./ClaimStatus";
import type { ClaimType } from "./ClaimType";
import type { Criticality } from "./Criticality";
import type { Priority } from "./Priority";
import type { Project } from "./Project";
import type { Subarea } from "./Subarea";

export interface Claim {
  id: string;
  claimCode: string;
  description: string;
  claimType: ClaimType;
  claimStatus: ClaimStatus;
  criticality: Criticality;
  priority: Priority;
  project: Project;
  subarea: Subarea;
}