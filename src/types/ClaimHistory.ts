import type { ClaimStatus } from "./ClaimStatus";
import type { ClaimType } from "./ClaimType";
import type { UserFormData } from "./User";

export interface ClaimHistory {
  id: string;
  claimId: string;
  claimStatus: ClaimStatus;
  claimType: ClaimType;
  action: string;
  user?: UserFormData;
  area: string;
  subarea: string;
  startDateHour: Date;
  endDateHour?: Date;
}