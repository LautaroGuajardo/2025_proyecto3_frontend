import type { Area } from "@/types/Area";

export interface IAreaService {
  getAllAreas(
    token: string
  ): Promise<{ success: boolean; message?: string; areas?: Area[] }>;
}