import type { Area } from "./Area";

export interface Subarea {
  id: string;
  name: string;
  description?: string;
  area: Area;
}

export interface SubareaFormData {
  name: string;
  description?: string;
  area: Area;
}