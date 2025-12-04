import { apiEndpoints } from "@/api/endpoints";
import type { Area } from "@/types/Area";
import type { IAreaService } from "@/services/interfaces/IAreaService";

class AreaServiceReal implements IAreaService {
  async getAllAreas(
    token: string
  ): Promise<{ success: boolean; message?: string; areas?: Area[] }> {
    try {
      const response = await fetch(apiEndpoints.areas.GET_ALL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener las areas");
      }
      const areas: Area[] = await response.json();
      return {
        success: true,
        areas: areas,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las areas",
      };
    }
  }
}

export const areaServiceReal = new AreaServiceReal();