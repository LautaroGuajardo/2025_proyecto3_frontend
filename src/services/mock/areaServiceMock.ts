import type { IAreaService } from "@/services/interfaces/IAreaService";

export const AREAS = [
  {
    id: "0",
    name: "---",
    subareas: [
      { id: "0", name: "---" }
    ]
  },
  {
    id: "1",
    name: "Soporte Técnico",
    subareas: [
      { id: "1", name: "Atención al Cliente" },
      { id: "2", name: "Mantenimiento de Sistemas" },
      { id: "3", name: "Infraestructura" }
    ]
  },
  {
    id: "2",
    name: "Ventas",
    subareas: [
      { id: "4", name: "Ventas Minoristas" },
      { id: "5", name: "Ventas Mayoristas" },
      { id: "6", name: "E-commerce" }
    ]
  },
  {
    id: "3",
    name: "Facturación",
    subareas: [
      { id: "7", name: "Facturación Electrónica" },
      { id: "8", name: "Control de Cobros" },
      { id: "9", name: "Gestión de Impuestos" }
    ]
  },
  {
    id: "4",
    name: "Recursos Humanos",
    subareas: [
      { id: "10", name: "Selección de Personal" },
      { id: "11", name: "Capacitación y Desarrollo" },
      { id: "12", name: "Bienestar y Relaciones Laborales" }
    ]
  }
]

class AreaServiceMock implements IAreaService {
  async getAllAreas(_token: string) {
    void _token; // Evitar warning de variable no usada
    return { success: true, areas: AREAS };
  }
}

export const areaServiceMock = new AreaServiceMock();