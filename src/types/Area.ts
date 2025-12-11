import type { Subarea } from "./Subarea";

export interface Area {
  id: string;
  name: string;
  subareas?: Subarea[];
}

export interface AreaFormData {
  name: string;
  subareas?: Subarea[];
}