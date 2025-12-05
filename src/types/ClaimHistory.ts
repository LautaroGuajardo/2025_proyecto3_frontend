import type { ClaimStatus } from "./ClaimStatus";
import type { Claim } from "./Claim";
import type { UserFormData } from "./User";

export interface ClaimHistory {
  id: string;
  claim: Claim;
  claimStatus: ClaimStatus;
  accion: string;
  user: UserFormData;
  startDateHour: Date;
  endDateHour?: Date;
}