import { apiEndpoints } from "@/api/endpoints";
import type { Subarea } from "@/types/Subarea";
import type { ISubareaService } from "@/services/interfaces/ISubareaService";

class SubareaServiceReal implements ISubareaService {
  async getAllSubareas(
    token: string
  ): Promise<{ success: boolean; message?: string; subareas?: Subarea[] }> {
    try {
      const response = await fetch(apiEndpoints.subareas.GET_ALL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener las subáreas");
      }
      const subareas: Subarea[] = await response.json();
      return {
        success: true,
        subareas: subareas,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las subáreas",
      };
    }
  }
}

export const subareaServiceReal = new SubareaServiceReal();