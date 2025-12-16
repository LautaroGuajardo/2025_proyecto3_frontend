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
};

export default function DashboardCharts({
  claimsByMonth,
  statusCounts,
  avgResolutionByType,
  workloadByArea,
  commonTypes,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Reclamos por mes</CardTitle>
            <CardDescription>Acumulado histórico</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportDataset("reclamos_por_mes", claimsByMonth)}>
              Exportar CSV/XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadChartPNG(barRef1.current?.canvas ?? null, "reclamos_por_mes.png")}>
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
            options={{ responsive: true, plugins: { legend: { position: "top" } } }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Estados</CardTitle>
            <CardDescription>Pendiente, Progreso, Resuelto</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportDataset("estados", statusCounts)}>
              Exportar CSV/XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadChartPNG(doughnutRef.current?.canvas ?? null, "estados.png")}>
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
                  label: "Cantidad",
                  data: statusCounts.map(d => d.value),
                  backgroundColor: statusCounts.map((_, i) => colors[i % colors.length]),
                },
              ],
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tiempo promedio por tipo</CardTitle>
            <CardDescription>Días desde Progreso a Resuelto</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportDataset("promedio_por_tipo", avgResolutionByType)}>
              Exportar CSV/XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadChartPNG(barRef2.current?.canvas ?? null, "promedio_por_tipo.png")}>
              Descargar PNG
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Bar
            ref={barRef2}
            data={{
              labels: avgResolutionByType.map(d => d.name),
              datasets: [
                {
                  label: "Promedio (días)",
                  data: avgResolutionByType.map(d => d.value),
                  backgroundColor: "#34d399",
                },
              ],
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Carga por área</CardTitle>
            <CardDescription>Reclamos por área</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportDataset("carga_por_area", workloadByArea)}>
              Exportar CSV/XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadChartPNG(barRef3.current?.canvas ?? null, "carga_por_area.png")}>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tipos más comunes</CardTitle>
            <CardDescription>Distribución de tipos</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportDataset("tipos_comunes", commonTypes)}>
              Exportar CSV/XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadChartPNG(lineRef.current?.canvas ?? null, "tipos_comunes.png")}>
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
                  borderColor: "#a78bfa",
                  backgroundColor: "#a78bfa33",
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}