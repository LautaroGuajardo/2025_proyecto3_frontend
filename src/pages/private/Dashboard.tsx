import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { projectService } from "@/services/factories/projectServiceFactory";
import { userService } from "@/services/factories/userServiceFactory";
import { areaService } from "@/services/factories/areaServiceFactory";
import { getDashboardReports, type DashboardResponse } from "@/services/dashboardService";
import type { Project } from "@/types/Project";
import type { UserFormData } from "@/types/User";
import type { Area } from "@/types/Area";
import { ClaimStatus } from "@/types/ClaimStatus";
import { Role } from "@/types/Role";
import DashboardCharts from "./components/DashboardCharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProjectType } from "@/types/ProjectType";

export default function Dashboard() {
  const { getAccessToken, logout, role } = useAuth();
  const token = getAccessToken();

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserFormData[]>([]);
  const [claimsByMonth, setClaimsByMonth] = useState<{ month: string; count: number }[]>([]);
  const [statusCountsData, setStatusCountsData] = useState<{ name: string; value: number }[]>([]);
  const [avgResolutionByTypeData, setAvgResolutionByTypeData] = useState<{ name: string; value: number }[]>([]);
  const [workloadByAreaData, setWorkloadByAreaData] = useState<{ name: string; value: number }[]>([]);
  const [areasFromApi, setAreasFromApi] = useState<{ id: string; name: string }[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [commonTypesData, setCommonTypesData] = useState<{ name: string; value: number }[]>([]);

  // Filtros
  const [filterProjectType, setFilterProjectType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Eliminado: búsqueda libre en front (no se usa)
  const [projectId, setProjectId] = useState<string>("ALL");
  const [areaId, setAreaId] = useState<string>("ALL");
  const [subareaId, setSubareaId] = useState<string>("ALL");
  const [customerId, setCustomerId] = useState<string>("ALL");
  const [responsibleUserId, setResponsibleUserId] = useState<string>("ALL");

  const esCustomer = role === Role.CUSTOMER;
  const esAuditor = role === Role.ADMIN || role === Role.AUDITOR;
  const avgUnit: 'hours' | 'days' = esAuditor ? 'days' : 'hours';

  useEffect(() => {
    const mapApiToCharts = (data: DashboardResponse) => {
      setClaimsByMonth(data.claimsPerMonth ?? []);
      const sc = data.statusCounts ?? { pending: 0, inProgress: 0, resolved: 0 };
      setStatusCountsData([
        { name: "PENDING", value: sc.pending || 0 },
        { name: "IN_PROGRESS", value: sc.inProgress || 0 },
        { name: "RESOLVED", value: sc.resolved || 0 },
      ]);
      setAvgResolutionByTypeData((data.avgResolutionByType ?? []).map(d => ({ name: d.claimType, value: avgUnit === 'hours' ? (d.avgDays ?? 0) * 24 : d.avgDays })));
      setWorkloadByAreaData((data.workloadByArea ?? []).map(d => ({ name: d.areaName, value: d.count })));
      setCommonTypesData((data.commonClaimTypes ?? []).map(d => ({ name: d.claimType, value: d.count })));
    };
    const load = async () => {
      if (!token) {
        toast.error("Por favor inicia sesión para ver el dashboard");
        logout();
        return;
      }
      try {
        const [projectsRes, usersRes, areasRes] = await Promise.all([
          projectService.getAllProjects(token),
          userService.getAllUsers(token),
          areaService.getAllAreas(token),
        ]);

        if (projectsRes.success && projectsRes.projects)
          setProjects(projectsRes.projects.map((p: Project) => ({ ...p, id: String(p._id) })));

        if (usersRes.success && usersRes.users) setUsers(usersRes.users);

        if (areasRes.success && areasRes.areas) {
          setAreas(areasRes.areas);
          setAreasFromApi(
            areasRes.areas
              .filter(a => a && a._id && a.name)
              .map(a => ({ id: String(a._id), name: a.name }))
          );
        }

        // Dashboard inicial sin filttros
        const { success, data } = await getDashboardReports(token, {});
        if (success && data) mapApiToCharts(data);
      } catch (error) {
        void error;
        toast.error("Error al cargar datos del dashboard. Intenta nuevamente.");
      }
    };
    void load();
  }, [token, logout, avgUnit]);

  // Refetch cuando los filtros cambian
  useEffect(() => {
    const refetch = async () => {
      if (!token) return;
      const filters: Record<string, string> = {};
      if (dateFrom) filters.fromDate = new Date(dateFrom).toISOString();
      if (dateTo) filters.toDate = new Date(dateTo).toISOString();
      if (filterProjectType !== "ALL") filters.projectType = filterProjectType;
      if (filterStatus !== "ALL") filters.status = filterStatus;
      // Sin filtro de búsqueda en el front
      if (projectId !== "ALL") filters.projectId = projectId;
      if (areaId !== "ALL") filters.areaId = areaId;
      if (subareaId !== "ALL") filters.subareaId = subareaId;
      if (esAuditor && customerId !== "ALL") filters.customerId = customerId;
      if (esAuditor && responsibleUserId !== "ALL") filters.responsibleUserId = responsibleUserId;
      const { success, data } = await getDashboardReports(token, filters);
      if (success && data) {
        setClaimsByMonth([]); // prevenir parpadeo con datos obsoletos
        setStatusCountsData([]);
        setAvgResolutionByTypeData([]);
        setWorkloadByAreaData([]);
        
        setCommonTypesData([]);
        const mapApiToCharts = (d: DashboardResponse) => {
          setClaimsByMonth(d.claimsPerMonth ?? []);
          const sc = d.statusCounts ?? { pending: 0, inProgress: 0, resolved: 0 };
          setStatusCountsData([
            { name: "PENDING", value: sc.pending || 0 },
            { name: "IN_PROGRESS", value: sc.inProgress || 0 },
            { name: "RESOLVED", value: sc.resolved || 0 },
          ]);
          setAvgResolutionByTypeData((d.avgResolutionByType ?? []).map(x => ({ name: x.claimType, value: avgUnit === 'hours' ? (x.avgDays ?? 0) * 24 : x.avgDays })));
          setWorkloadByAreaData((d.workloadByArea ?? []).map(x => ({ name: x.areaName, value: x.count })));
          
          setCommonTypesData((d.commonClaimTypes ?? []).map(x => ({ name: x.claimType, value: x.count })));
        };
        mapApiToCharts(data);
      }
    };
    void refetch();
  }, [token, dateFrom, dateTo, filterProjectType, filterStatus, projectId, areaId, subareaId, customerId, responsibleUserId, esAuditor, avgUnit]);



  const claimCounts = useMemo(() => {
    const pending = statusCountsData.find(s => s.name === "PENDING")?.value ?? 0;
    const inProgress = statusCountsData.find(s => s.name === "IN_PROGRESS")?.value ?? 0;
    const resolved = statusCountsData.find(s => s.name === "RESOLVED")?.value ?? 0;
    const total = pending + inProgress + resolved;
    return { total, pending, inProgress, resolved };
  }, [statusCountsData]);

  // Opciones de filtros

  const projectTypeOptions = useMemo(() => Object.values(ProjectType), []);
  const areaOptions = useMemo(() => {
    return [...(areasFromApi.length ? areasFromApi : (areas || []).map(a => ({ id: String(a._id), name: a.name })))].sort((a, b) => a.name.localeCompare(b.name));
  }, [areasFromApi, areas]);

  const subareaOptions = useMemo(() => {
    if (areaId === "ALL") return [];
    const area = (areas || []).find(a => String(a._id) === String(areaId));
    const subs = area?.subareas ?? [];
    return subs.map(s => ({ id: String(s._id), name: s.name }));
  }, [areas, areaId]);

  useEffect(() => {
    // Reset subarea al cambiar de área o si no hay subareas
    // Solo actualizar si el valor actual es distinto para evitar renders en cascada
    if ((areaId === "ALL" || subareaOptions.length === 0) && subareaId !== "ALL") {
      // Ejecutar la actualización de estado de forma asíncrona para evitar setState síncrono dentro del effect
      const t = setTimeout(() => {
        setSubareaId("ALL");
      }, 0);
      return () => clearTimeout(t);
    }
  }, [areaId, subareaOptions.length, subareaId]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Resumen del sistema según métricas del dominio</p>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-4">
          {/* Fila 1 */}
          <div className="flex flex-wrap gap-3">
            {!esCustomer && (
              <div className="min-w-[180px] flex items-center gap-2">
                <div className="text-xs text-black">Cliente:</div>
                <div className="flex-1">
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos</SelectItem>
                      {users
                        .filter(u => u.role === Role.CUSTOMER)
                        .map(u => (
                          <SelectItem key={String(u._id)} value={String(u._id)}>
                            {`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="min-w-[180px] flex items-center gap-2">
              <div className="text-xs text-black">Tipo de proyecto:</div>
              <div className="flex-1">
                <Select value={filterProjectType} onValueChange={setFilterProjectType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    {projectTypeOptions.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
                
            <div className="min-w-[180px] flex items-center gap-2">
              <div className="text-xs text-black">Proyecto:</div>
              <div className="flex-1">
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    {projects.map(p => (
                      <SelectItem key={String(p._id)} value={String(p._id)}>
                        {p.title || `#${p._id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
                
            <div className="min-w-40 flex items-center gap-2">
              <div className="text-xs text-black">Área:</div>
              <div className="flex-1">
                <Select value={areaId} onValueChange={setAreaId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    {areaOptions.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
                
            <div className="min-w-40 flex items-center gap-2">
              <div className="text-xs text-black">Subárea:</div>
              <div className="flex-1">
                <Select value={subareaId} onValueChange={setSubareaId} disabled={areaId === "ALL" || subareaOptions.length === 0}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={areaId === "ALL" ? "Selecciona un área" : (subareaOptions.length ? "Todas" : "Sin subáreas")} />
                  </SelectTrigger>
                  <SelectContent>
                    {subareaOptions.length ? (
                      <>
                        <SelectItem value="ALL">Todas</SelectItem>
                        {subareaOptions.map(sa => (
                          <SelectItem key={sa.id} value={sa.id}>{sa.name}</SelectItem>
                        ))}
                      </>
                    ) : (
                      <div className="px-2 py-1 text-xs text-muted-foreground">{areaId === "ALL" ? "Selecciona un área" : "No hay subáreas disponibles"}</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
                
            <div className="min-w-40 flex items-center gap-2">
              <div className="text-xs text-black">Estado:</div>
              <div className="flex-1">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    {Object.values(ClaimStatus).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
                
            {esAuditor && (
              <div className="min-w-[180px] flex items-center gap-2">
                <div className="text-xs text-black">Responsable:</div>
                <div className="flex-1">
                  <Select value={responsibleUserId} onValueChange={setResponsibleUserId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos</SelectItem>
                      {users
                        .filter(u => u.role === Role.USER)
                        .map(u => (
                          <SelectItem key={String(u._id)} value={String(u._id)}>
                            {`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          
          {/* Fila 2 (solo fechas) */}
          <div className="flex gap-3">
            <div className="min-w-40 flex items-center gap-2">
              <div className="text-xs text-black">Desde:</div>
              <div className="flex-1">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                />
              </div>
            </div>

            <div className="min-w-40 flex items-center gap-2">
              <div className="text-xs text-black">Hasta:</div>
              <div className="flex-1">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-row flex-wrap gap-4 items-stretch">
        <Card className="flex-1 min-w-[220px]">
          <CardContent>
            <div className="text-sm text-muted-foreground">Reclamos</div>
            <div className="text-2xl font-semibold mt-2">{claimCounts.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Pendientes: {claimCounts.pending} • En progreso: {claimCounts.inProgress} • Resueltos: {claimCounts.resolved}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[220px]">
          <CardContent>
            <div className="text-sm text-muted-foreground">Proyectos</div>
            <div className="text-2xl font-semibold mt-2">{projects.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Proyectos activos</div>
          </CardContent>
        </Card>

        {!esCustomer && <Card className="flex-1 min-w-[220px]">
          <CardContent>
            <div className="text-sm text-muted-foreground">Usuarios</div>
            <div className="text-2xl font-semibold mt-2">{users.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Usuarios registrados</div>
          </CardContent>
        </Card>}
      </div>

      <DashboardCharts
        claimsByMonth={claimsByMonth}
        statusCounts={statusCountsData}
        avgResolutionByType={avgResolutionByTypeData}
        workloadByArea={workloadByAreaData}
        commonTypes={commonTypesData}
        avgUnit={avgUnit}
      />
    </div>
  );
}
