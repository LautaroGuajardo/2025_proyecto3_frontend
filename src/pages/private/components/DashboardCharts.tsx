import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { downloadCSV, downloadChartPNG, downloadXLSX } from "@/utils/export";
import type { CsvRow } from "@/utils/export";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
);

type Props = {
  claimsByMonth: { month: string; count: number }[];
  statusCounts: { name: string; value: number }[];
  avgResolutionByType: { name: string; value: number }[];
  workloadByArea: { name: string; value: number }[];
  commonTypes: { name: string; value: number }[];
  avgUnit: 'hours' | 'days';
};

export default function DashboardCharts({
  claimsByMonth,
  statusCounts,
  avgResolutionByType,
  workloadByArea,
  commonTypes,
  avgUnit,
}: Props) {
  const colors = ["#60a5fa", "#34d399", "#f97316", "#a78bfa", "#f472b6", "#22d3ee", "#f59e0b"];

  const barRef1 = useRef<ChartJS<"bar">>(null);
  const doughnutRef = useRef<ChartJS<"doughnut">>(null);
  const barRef2 = useRef<ChartJS<"bar">>(null);
  const barRef3 = useRef<ChartJS<"bar">>(null);
  const lineRef = useRef<ChartJS<"line">>(null);

  const exportDataset = (name: string, rows: CsvRow[]) => {
    downloadCSV(`${name}.csv`, rows);
    downloadXLSX(`${name}.xlsx`, [{ name, rows }]);
  };

  const exportAll = () => {
    const allSheets: { name: string; rows: CsvRow[] }[] = [
      { name: "reclamos_por_mes", rows: claimsByMonth.map(d => ({ month: d.month, count: d.count })) },
      { name: "estados", rows: statusCounts.map(d => ({ name: d.name, value: d.value })) },
      { name: "promedio_por_tipo", rows: avgResolutionByType.map(d => ({ type: d.name, value: d.value, unit: avgUnit })) },
      { name: "carga_por_area", rows: workloadByArea.map(d => ({ area: d.name, count: d.value })) },
      { name: "tipos_comunes", rows: commonTypes.map(d => ({ type: d.name, count: d.value })) },
    ];
    // CSV combinado como una sola tabla con columna 'section'
    const combinedCsvRows: CsvRow[] = [
      ...claimsByMonth.map(d => ({ section: "reclamos_por_mes", label: d.month, value: d.count, unit: "" })),
      ...statusCounts.map(d => ({ section: "estados", label: d.name, value: d.value, unit: "" })),
      ...avgResolutionByType.map(d => ({ section: "promedio_por_tipo", label: d.name, value: d.value, unit: avgUnit })),
      ...workloadByArea.map(d => ({ section: "carga_por_area", label: d.name, value: d.value, unit: "" })),
      ...commonTypes.map(d => ({ section: "tipos_comunes", label: d.name, value: d.value, unit: "" })),
    ];
    downloadCSV("dashboard_todo.csv", combinedCsvRows, ["section", "label", "value", "unit"]);
    // XLSX con múltiples hojas
    downloadXLSX("dashboard_todo.xlsx", allSheets);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Botón principal */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          className="px-8"
          onClick={exportAll}
        >
          Exportar todo (CSV/XLSX)
        </Button>
      </div>
    
      {/* Fila 1 */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Tiempo promedio por tipo */}
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tiempo promedio por tipo</CardTitle>
              <CardDescription>
                {avgUnit === "days"
                  ? "Días desde inicio hasta cierre"
                  : "Horas desde inicio hasta cierre"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportDataset(
                    "promedio_por_tipo",
                    avgResolutionByType.map(d => ({
                      name: d.name,
                      value: d.value,
                      unit: avgUnit,
                    }))
                  )
                }
              >
                Exportar CSV/XLSX
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadChartPNG(
                    barRef2.current?.canvas ?? null,
                    "promedio_por_tipo.png"
                  )
                }
              >
                Descargar PNG
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {avgResolutionByType.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Sin datos para el período/criterios seleccionados
              </div>
            ) : (
              <Bar
                ref={barRef2}
                data={{
                  labels: avgResolutionByType.map(d => d.name),
                  datasets: [
                    {
                      label:
                        avgUnit === "days"
                          ? "Promedio (días)"
                          : "Promedio (horas)",
                      data: avgResolutionByType.map(d => d.value),
                      backgroundColor: "#34d399",
                    },
                  ],
                }}
              />
            )}
          </CardContent>
        </Card>
          
        {/* Carga por área */}
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Carga por área</CardTitle>
              <CardDescription>Reclamos por área</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportDataset("carga_por_area", workloadByArea)
                }
              >
                Exportar CSV/XLSX
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadChartPNG(
                    barRef3.current?.canvas ?? null,
                    "carga_por_area.png"
                  )
                }
              >
                Descargar PNG
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Bar
              ref={barRef3}
              data={{
                labels: workloadByArea.map(d => d.name),
                datasets: [
                  {
                    label: "Reclamos",
                    data: workloadByArea.map(d => d.value),
                    backgroundColor: "#f97316",
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
      </div>
            
      {/* Fila 2 */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Reclamos por mes */}
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Reclamos por mes</CardTitle>
              <CardDescription>Acumulado histórico</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportDataset("reclamos_por_mes", claimsByMonth)
                }
              >
                Exportar CSV/XLSX
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadChartPNG(
                    barRef1.current?.canvas ?? null,
                    "reclamos_por_mes.png"
                  )
                }
              >
                Descargar PNG
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Bar
              ref={barRef1}
              data={{
                labels: claimsByMonth.map(d => d.month),
                datasets: [
                  {
                    label: "Reclamos",
                    data: claimsByMonth.map(d => d.count),
                    backgroundColor: "#2563eb",
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
            
        {/* Tipos más comunes */}
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tipos más comunes</CardTitle>
              <CardDescription>Distribución de tipos</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportDataset("tipos_comunes", commonTypes)
                }
              >
                Exportar CSV/XLSX
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadChartPNG(
                    lineRef.current?.canvas ?? null,
                    "tipos_comunes.png"
                  )
                }
              >
                Descargar PNG
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Line
              ref={lineRef}
              data={{
                labels: commonTypes.map(d => d.name),
                datasets: [
                  {
                    label: "Reclamos",
                    data: commonTypes.map(d => d.value),
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
      </div>
            
      {/* Fila 3 */}
      <div className="flex justify-center w-full">
        <Card className="w-full lg:w-1/2">
          <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Estados</CardTitle>
            <CardDescription>Pendiente, Progreso, Resuelto</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportDataset("estados", statusCounts)}
            >
              Exportar CSV/XLSX
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadChartPNG(
                  doughnutRef.current?.canvas ?? null,
                  "estados.png"
                )
              }
            >
              Descargar PNG
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Doughnut
            ref={doughnutRef}
            data={{
              labels: statusCounts.map(d => d.name),
              datasets: [
                {
                  data: statusCounts.map(d => d.value),
                  backgroundColor: statusCounts.map(
                    (_, i) => colors[i % colors.length]
                  ),
                },
              ],
            }}
          />
        </CardContent>
        </Card>
      </div>
    </div>
  );

}