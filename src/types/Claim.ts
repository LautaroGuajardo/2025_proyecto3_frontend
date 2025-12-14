import type { Area } from "recharts";
import type { ClaimStatus } from "./ClaimStatus";
import type { ClaimType } from "./ClaimType";
import type { Criticality } from "./Criticality";
import type { Priority } from "./Priority";
import type { Project } from "./Project";

export interface Claim {
  _id: string;
  claimStatus?: ClaimStatus;
  description: string;
  claimType: ClaimType;
  criticality: Criticality;
  priority: Priority;
  project: Project;
  //subarea?: string;
  area?: Area;
  actions?: string;
}