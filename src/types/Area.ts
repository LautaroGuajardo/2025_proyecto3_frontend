import type { Subarea } from "./Subarea";

export interface Area {
  _id: string;
  name: string;
  subareas?: Subarea[];
}
