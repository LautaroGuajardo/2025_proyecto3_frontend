import type { IAreaService } from "@/services/interfaces/IAreaService";
import type { Area } from "@/types/Area";

export const AREAS = [
  {
    _id: "0",
    name: "---",
    subareas: [
      { _id: "0", name: "---" }
    ]
  },
  {
    _id: "1",
    name: "Soporte Técnico",
    subareas: [
      { _id: "1", name: "Atención al Cliente" },
      { _id: "2", name: "Mantenimiento de Sistemas" },
      { _id: "3", name: "Infraestructura" }
    ]
  },
  {
    _id: "2",
    name: "Ventas",
    subareas: [
      { _id: "4", name: "Ventas Minoristas" },
      { _id: "5", name: "Ventas Mayoristas" },
      { _id: "6", name: "E-commerce" }
    ]
  },
  {
    _id: "3",
    name: "Facturación",
    subareas: [
      { _id: "7", name: "Facturación Electrónica" },
      { _id: "8", name: "Control de Cobros" },
      { _id: "9", name: "Gestión de Impuestos" }
    ]
  },
  {
    _id: "4",
    name: "Recursos Humanos",
    subareas: [
      { _id: "10", name: "Selección de Personal" },
      { _id: "11", name: "Capacitación y Desarrollo" },
      { _id: "12", name: "Bienestar y Relaciones Laborales" }
    ]
  }
]

class AreaServiceMock implements IAreaService {
  async getAllAreas(_token: string): Promise<{ success: boolean; message?: string; areas?: Area[] }> {
    void _token; // Evitar warning de variable no usada
    return { success: true, areas: AREAS as unknown as Area[] };
  }
}

export const areaServiceMock = new AreaServiceMock();