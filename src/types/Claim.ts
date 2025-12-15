import type { Subarea } from "./Subarea";
import type { ClaimStatus } from "./ClaimStatus";
import type { ClaimType } from "./ClaimType";
import type { Criticality } from "./Criticality";
import type { Priority } from "./Priority";
import type { Project } from "./Project";

export interface Attachment {
  _id?: string;        // id en la DB (si ya está guardado)
  name: string;        // nombre del fichero
  url?: string;        // URL pública/preview (si existe)
  mimeType?: string;   // 'image/png' | 'application/pdf' ...
  size?: number;       // bytes (opcional)
}

export interface Claim {
  _id: string;
  claimStatus?: ClaimStatus;
  description: string;
  claimType?: ClaimType;
  criticality: Criticality;
  priority: Priority;
  project?: Partial<Project>;
  subarea?: Partial<Subarea>;
  actions?: string;
  attachments?: Attachment[];
}

export interface CreateClaim {
  description: string;
  claimType: string;
  criticality: string;
  priority: string;
  project: string;
  subarea?: Partial<Subarea>;
  attachments?: Attachment[];
}

export interface UpdateClaim{
  _id: string;
  claimStatus?: ClaimStatus;
  claimType?: ClaimType;
  criticality?: Criticality;
  priority?: Priority;
  subarea?: string;
  actions: string;
}