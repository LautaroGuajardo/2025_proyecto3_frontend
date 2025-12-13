import type { ClaimStatus } from "./ClaimStatus";
import type { Criticality } from "./Criticality";
import type { Priority } from "./Priority";
import type { UserFormData } from "./User";

export interface ClaimHistory {
  id: string;
  claimId: string;
  claimStatus: ClaimStatus;
  criticality: Criticality;
  priority: Priority;
  action?: string;
  user?: UserFormData;
  area?: string;
  subarea?: string;
  startDateHour: Date;
  endDateHour?: Date;
}