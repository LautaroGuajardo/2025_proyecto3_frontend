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
  claimStatus?: Partial<ClaimStatus>;
  description: string;
  claimType?: ClaimType;
  criticality: Criticality;
  priority: Priority;
  project: Partial<Project>;
  subarea?: Partial<Subarea>;
  actions?: string;
  attachments?: Attachment[];
}