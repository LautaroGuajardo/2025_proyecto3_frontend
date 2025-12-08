import type { Area } from "./Area";

export interface Subarea {
  id: string;
  name: string;
  area: Area;
}

export interface SubareaFormData {
  name: string;
  area: Area;
}