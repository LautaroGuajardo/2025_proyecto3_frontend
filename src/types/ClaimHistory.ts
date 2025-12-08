import type { ClaimStatus } from "./ClaimStatus";
import type { Claim } from "./Claim";
import type { UserFormData } from "./User";

export interface ClaimHistory {
  id: string;
  claim: Claim;
  claimStatus: ClaimStatus;
  action: string;
  user: UserFormData;
  area: string;
  subarea: string;
  startDateHour: Date;
  endDateHour?: Date;
}