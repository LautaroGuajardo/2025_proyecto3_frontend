import type { Subarea } from "@/types/Subarea";

export interface ISubareaService {
  getAllSubareas(
    token: string
  ): Promise<{ success: boolean; message?: string; subareas?: Subarea[] }>;
}