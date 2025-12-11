import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { claimService } from "@/services/factories/claimServiceFactory";
import { projectService } from "@/services/factories/projectServiceFactory";
import { userService } from "@/services/factories/userServiceFactory";
import { claimHistoryService } from "@/services/factories/claimHistoryServiceFactory";
import type { Claim } from "@/types/Claim";
import type { Project } from "@/types/Project";
import type { User } from "@/types/User";
import type { ClaimHistory } from "@/types/ClaimHistory";
import { ClaimStatus } from "@/types/ClaimStatus";
import { ClaimType } from "@/types/ClaimType";
import DashboardCharts from "./components/DashboardCharts";

export default function Dashboard() {
  const { getAccessToken, logout } = useAuth();
  const token = getAccessToken();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [histories, setHistories] = useState<ClaimHistory[]>([]);

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
          const normalized = claimsRes.claims.map((c: any) => ({ ...c, id: String(c.id) }));
          setClaims(normalized);

          const allHistories: ClaimHistory[] = [];
          for (const claim of normalized) {
            const h = await claimHistoryService.getClaimHistoryById(token, claim.id);
            if (h.success && h.history) allHistories.push(...h.history);
          }
          setHistories(allHistories);
        }

        if (projectsRes.success && projectsRes.projects)
          setProjects(projectsRes.projects.map((p: any) => ({ ...p, id: String(p.id) })));

        if (usersRes.success && usersRes.users) setUsers(usersRes.users);
      } catch (error) {
        toast.error("Error cargando datos del dashboard");
      }
    };
    void load();
  }, [token]);

  const claimCounts = useMemo(() => {
    const total = claims.length;
    const pendiente = claims.filter((c) => c.claimStatus === ClaimStatus.PENDIENTE).length;
    const progreso = claims.filter((c) => c.claimStatus === ClaimStatus.PROGRESO).length;
    const resuelto = claims.filter((c) => c.claimStatus === ClaimStatus.RESUELTO).length;
    return { total, pendiente, progreso, resuelto };
  }, [claims]);

  const monthlyClaims = useMemo(() => {
    const counts: Record<string, number> = {};
    histories.forEach((h) => {
      if (!h.startDateHour) return;
      const date = new Date(h.startDateHour);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    // convert to sorted array
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count }));
  }, [histories]);

  const avgResolutionByType = useMemo(() => {
    const aggregates: Record<string, { totalMs: number; count: number }> = {};

    histories.forEach((h) => {
      if (!h.endDateHour || !h.startDateHour) return;
      const start = new Date(h.startDateHour).getTime();
      const end = new Date(h.endDateHour).getTime();
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
  }, [histories]);

  const workloadByArea = useMemo(() => {
    const load: Record<string, number> = {};
    histories.forEach((h) => {
      const area = h.area || "Sin área";
      load[area] = (load[area] || 0) + 1;
    });
    return Object.entries(load).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [histories]);

  const commonTypes = useMemo(() => {
    const map = new Map<string, number>();
    claims.forEach((c) => {
      const key = String(c.claimType ?? "Desconocido");
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [claims]);

  const statusCounts = useMemo(() => {
    return [
      { name: "Pendiente", value: claims.filter((c) => c.claimStatus === ClaimStatus.PENDIENTE).length },
      { name: "Progreso", value: claims.filter((c) => c.claimStatus === ClaimStatus.PROGRESO).length },
      { name: "Resuelto", value: claims.filter((c) => c.claimStatus === ClaimStatus.RESUELTO).length },
    ];
  }, [claims]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Resumen del sistema según métricas del dominio</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Reclamos</div>
            <div className="text-2xl font-semibold mt-2">{claimCounts.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Pendientes: {claimCounts.pendiente} • En progreso: {claimCounts.progreso} • Resueltos: {claimCounts.resuelto}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Proyectos</div>
            <div className="text-2xl font-semibold mt-2">{projects.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Proyectos activos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Usuarios</div>
            <div className="text-2xl font-semibold mt-2">{users.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Usuarios registrados</div>
          </CardContent>
        </Card>
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
