import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { claimService } from "@/services/factories/claimServiceFactory";
import { projectService } from "@/services/factories/projectServiceFactory";
import { userService } from "@/services/factories/userServiceFactory";
import { claimHistoryService } from "@/services/factories/claimHistoryServiceFactory";
import type { Claim } from "@/types/Claim";
import type { Project } from "@/types/Project";
import type { UserFormData } from "@/types/User";
import type { ClaimHistory } from "@/types/ClaimHistory";
import { ClaimStatus } from "@/types/ClaimStatus";
import { Role } from "@/types/Role";
import DashboardCharts from "./components/DashboardCharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProjectType } from "@/types/ProjectType";

export default function Dashboard() {
  const { getAccessToken, logout, role } = useAuth();
  const token = getAccessToken();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserFormData[]>([]);
  const [histories, setHistories] = useState<ClaimHistory[]>([]);

  // Filtros
  const [filterClientId, setFilterClientId] = useState<string>("ALL");
  const [filterProjectType, setFilterProjectType] = useState<string>("ALL");
  const [filterArea, setFilterArea] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const isCustomer = role === Role.CUSTOMER;

  useEffect(() => {
    const load = async () => {
      if (!token) {
        toast.error("Por favor inicia sesión para ver el dashboard");
        logout();
        return;
      }
      try {
        const [claimsRes, projectsRes, usersRes] = await Promise.all([
          claimService.getAllClaims(token),
          projectService.getAllProjects(token),
          userService.getAllUsers(token),
        ]);

        if (claimsRes.success && claimsRes.claims) {
          const normalized = claimsRes.claims.map((c: Claim) => ({ ...c, id: String(c._id) }));
          setClaims(normalized);

          const allHistories: ClaimHistory[] = [];
          for (const claim of normalized) {
            const h = await claimHistoryService.getClaimHistoryById(token, claim.id);
            if (h.success && h.claimHistory) allHistories.push(...h.claimHistory);
          }
          setHistories(allHistories);
        }

        if (projectsRes.success && projectsRes.projects)
          setProjects(projectsRes.projects.map((p: Project) => ({ ...p, id: String(p._id) })));

        if (usersRes.success && usersRes.users) setUsers(usersRes.users);
      } catch (error) {
        void error;
        toast.error("Error al cargar datos del dashboard. Intenta nuevamente.");
      }
    };
    void load();
  }, [token, logout]);

  // Helpers de filtros
  const projectById = useMemo(() => {
    const map = new Map<string, Project>();
    projects.forEach((p) => map.set(p._id, p));
    return map;
  }, [projects]);

  const filterClaim = (c: Claim): boolean => {
    if (filterStatus !== "ALL" && String(c.claimStatus) !== filterStatus) return false;
    if (filterArea !== "ALL" && String(c.subarea?.area?.name ?? "") !== filterArea) return false;
    if (filterClientId !== "ALL" || filterProjectType !== "ALL") {
      const pid = c.project?._id ?? "";
      const p = pid ? projectById.get(pid) : undefined;
      if (filterClientId !== "ALL" && (!p || p.user?._id !== filterClientId)) return false;
      if (filterProjectType !== "ALL" && (!p || p.projectType !== filterProjectType)) return false;
    }
    return true;
  };

  const filterHistory = (h: ClaimHistory): boolean => {
    // Fecha
    if (dateFrom) {
      const fromMs = new Date(dateFrom).getTime();
      const hMs = new Date(h.startDate).getTime();
      if (hMs < fromMs) return false;
    }
    if (dateTo) {
      const toMs = new Date(dateTo).getTime();
      const hMs = new Date(h.startDate).getTime();
      if (hMs > toMs) return false;
    }
    // Área
    if (filterArea !== "ALL" && String(h.subarea?.area.name ?? "") !== filterArea) return false;
    // Cliente y tipo proyecto por claim -> project
    if (filterClientId !== "ALL" || filterProjectType !== "ALL") {
      const claim = claims.find(c => c._id === h.claim);
      const pid = claim?.project?._id ?? "";
      const p = pid ? projectById.get(pid) : undefined;
      if (filterClientId !== "ALL" && (!p || p.user?._id !== filterClientId)) return false;
      if (filterProjectType !== "ALL" && (!p || p.projectType !== filterProjectType)) return false;
    }
    // Estado
    if (filterStatus !== "ALL") {
      const claim = claims.find(c => c._id === h.claim);
      if (claim && String(claim.claimStatus) !== filterStatus) return false;
    }
    return true;
  };

  const filteredClaims = useMemo(() => claims.filter(filterClaim), [claims, filterStatus, filterArea, filterClientId, filterProjectType, projectById]);
  const filteredHistories = useMemo(() => histories.filter(filterHistory), [histories, dateFrom, dateTo, filterArea, filterClientId, filterProjectType, filterStatus, claims, projectById]);

  const claimCounts = useMemo(() => {
    const total = filteredClaims.length;
    const pending = filteredClaims.filter((c) => c.claimStatus === ClaimStatus.PENDING).length;
    const inProgress = filteredClaims.filter((c) => c.claimStatus === ClaimStatus.IN_PROGRESS).length;
    const resolved = filteredClaims.filter((c) => c.claimStatus === ClaimStatus.RESOLVED).length;
    return { total, pending, inProgress, resolved };
  }, [filteredClaims]);

  const monthlyClaims = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredHistories.forEach((h) => {
      const date = new Date(h.startDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count }));
  }, [filteredHistories]);

  const avgResolutionByType = useMemo(() => {
    const aggregates: Record<string, { totalMs: number; count: number }> = {};

    filteredHistories.forEach((h) => {
      if (!h.endDate || !h.startDate) return;
      const start = new Date(h.startDate).getTime();
      const end = new Date(h.endDate).getTime();
      if (isNaN(start) || isNaN(end) || end < start) return;
      const diffMs = end - start;
      const key = String(h.claimType ?? "Desconocido");
      if (!aggregates[key]) aggregates[key] = { totalMs: 0, count: 0 };
      aggregates[key].totalMs += diffMs;
      aggregates[key].count += 1;
    });

    return Object.entries(aggregates)
      .map(([name, { totalMs, count }]) => ({ name, value: totalMs / count / (1000 * 60 * 60 * 24) })) // days
      .sort((a, b) => b.value - a.value);
  }, [filteredHistories]);

  const workloadByArea = useMemo(() => {
    const load: Record<string, number> = {};
    filteredHistories.forEach((h) => {
      const area = h.subarea?.area.name || "Sin área";
      load[area] = (load[area] || 0) + 1;
    });
    return Object.entries(load).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredHistories]);

  const commonTypes = useMemo(() => {
    const map = new Map<string, number>();
    filteredClaims.forEach((c) => {
      const key = String(c.claimType ?? "Desconocido");
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredClaims]);

  // Opciones de filtros
  const clientsOptions = useMemo(() => {
    const opts: { id: string; name: string }[] = [];
    projects.forEach(p => {
      if (p.user?._id) {
        const name = `${p.user.firstName ?? ''} ${p.user.lastName ?? ''}`.trim() || p.user.email;
        if (!opts.find(o => o.id === p.user?._id)) opts.push({ id: p.user._id, name });
      }
    });
    return opts.sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  const projectTypeOptions = useMemo(() => Object.values(ProjectType), []);
  const areaOptions = useMemo(() => {
    const set = new Set<string>();
    histories.forEach(h => { const n = h.subarea?.area.name; if (n) set.add(n); });
    return Array.from(set.values()).sort();
  }, [histories]);

  const statusCounts = useMemo(() => {
    return [
      { name: "PENDING", value: filteredClaims.filter((c) => c.claimStatus === ClaimStatus.PENDING).length },
      { name: "IN_PROGRESS", value: filteredClaims.filter((c) => c.claimStatus === ClaimStatus.IN_PROGRESS).length },
      { name: "RESOLVED", value: filteredClaims.filter((c) => c.claimStatus === ClaimStatus.RESOLVED).length },
    ];
  }, [filteredClaims]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Resumen del sistema según métricas del dominio</p>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Cliente</div>
            <Select value={filterClientId} onValueChange={setFilterClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {clientsOptions.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Tipo de proyecto</div>
            <Select value={filterProjectType} onValueChange={setFilterProjectType}>
              <SelectTrigger>
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
          <div>
            <div className="text-xs text-muted-foreground mb-1">Área</div>
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                {areaOptions.map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Estado</div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
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
          <div>
            <div className="text-xs text-muted-foreground mb-1">Desde</div>
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Hasta</div>
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
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

        {!isCustomer && <Card className="flex-1 min-w-[220px]">
          <CardContent>
            <div className="text-sm text-muted-foreground">Usuarios</div>
            <div className="text-2xl font-semibold mt-2">{users.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Usuarios registrados</div>
          </CardContent>
        </Card>}
      </div>

      <DashboardCharts
        claimsByMonth={monthlyClaims}
        statusCounts={statusCounts}
        avgResolutionByType={avgResolutionByType}
        workloadByArea={workloadByArea}
        commonTypes={commonTypes}
      />
    </div>
  );
}
