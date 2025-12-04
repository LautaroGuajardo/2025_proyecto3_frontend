import { AREA } from "./areaServiceMock";
import type { ISubareaService } from "@/services/interfaces/ISubareaService";

const SUBAREA = {
  INFRAESTRUCTURA: {id: "1", area: AREA.TECNICA, name: "INFRAESTRUCTURA"},
  APLICACIONES: {id: "1", area: AREA.TECNICA, name: "APLICACIONES"},
  RED: {id: "1", area: AREA.TECNICA, name: "RED"},
  SEGURIDAD: {id: "1", area: AREA.TECNICA, name: "SEGURIDAD"},
  COBRANZAS: {id: "2", area: AREA.FACTURACION, name: "COBRANZAS"},
  ADMINISTRACION: {id: "2", area: AREA.FACTURACION, name: "ADMINISTRACION"},
  POSTVENTA: {id: "3", area: AREA.VENTAS, name: "POSTVENTA"},
  COMERCIAL: {id: "3", area: AREA.VENTAS, name: "COMERCIAL"},
}

class SubareaServiceMock implements ISubareaService {
  async getAllSubareas(_token: string) {
    void _token; // Evitar warning de variable no usada
    return { success: true, areas: Object.values(SUBAREA) };
  }
}

export { SUBAREA };
export const subareaServiceMock = new SubareaServiceMock();