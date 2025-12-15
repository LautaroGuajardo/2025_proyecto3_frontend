import type { Subarea } from "./Subarea";
import type { ClaimStatus } from "./ClaimStatus";
import type { Criticality } from "./Criticality";
import type { Priority } from "./Priority";
import type { UserFormData } from "./User";
import type { ClaimType } from "./ClaimType";

export interface ClaimHistory {
  _id: string;
  claim: string;
  claimStatus: ClaimStatus;
  criticality: Criticality;
  priority: Priority;
  claimType?: ClaimType;
  action?: string;
  user?: UserFormData;
  subarea?: Subarea;
  startDate: Date;
  endDate?: Date;
}