import type { Area } from "recharts";
import type { ClaimStatus } from "./ClaimStatus";
import type { Criticality } from "./Criticality";
import type { Priority } from "./Priority";
import type { UserFormData } from "./User";

export interface ClaimHistory {
  _id: string;
  claim: string;
  claimStatus: ClaimStatus;
  criticality: Criticality;
  priority: Priority;
  action?: string;
  user?: UserFormData;
  area?: Area;
  //subarea?: string;
  startTime: Date;
  endTime?: Date;
}