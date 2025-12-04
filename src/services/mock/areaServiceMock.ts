import type { IAreaService } from "@/services/interfaces/IAreaService";

const AREA = {
  TECNICA: {id: "1", name: "TECNICA"},
  FACTURACION: {id: "2", name: "FACTURACION"},
  VENTAS: {id: "3", name: "VENTAS"},
}

class AreaServiceMock implements IAreaService {
  async getAllAreas(_token: string) {
    void _token; // Evitar warning de variable no usada
    return { success: true, areas: Object.values(AREA) };
  }
}

export { AREA };
export const areaServiceMock = new AreaServiceMock();