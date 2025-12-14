import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import type { ClaimHistory } from "@/types/ClaimHistory";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FetchingSpinner from "@/components/common/FetchingSpinner";
import { claimHistoryService } from "@/services/factories/claimHistoryServiceFactory";
import { useParams } from "react-router-dom";
import { Role } from "@/types/Role";

export default function ClaimHistory() {
  const { getAccessToken, logout, role } = useAuth();
  const isCustomer = role === Role.CUSTOMER;
  const token = getAccessToken();

  const [loading, setLoading] = useState(true);
  const [histories, setHistories] = useState<ClaimHistory[]>([]);
  
  const [orderBy, setOrderBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const { id: claimId } = useParams<{ id?: string }>();

  const fetchClaimHistory = async (claimIdParam?: string) => {
    const cid = claimIdParam ?? claimId;
    if (!cid) return;
    if (!token) {
      toast.error("Por favor, inicia sesión para acceder a esta sección.");
      logout();
      return;
    }

    setLoading(true);
    try {
      const { success, claimHistory } = await claimHistoryService.getClaimHistoryById(token, cid);
      if (!success) {
        toast.error("Error al cargar el historial del reclamo. Intenta nuevamente.");
        setHistories([]);
        return;
      }

      setHistories(claimHistory ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar el historial del reclamo");
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = histories;

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (orderBy) {
      case "startAsc":
        return list.sort((a, b) => (new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime()));
      case "startDesc":
        return list.sort((a, b) => (new Date(b.startTime || 0).getTime() - new Date(a.startTime || 0).getTime()));
      case "latest":
      default:
        return list;
    }
  }, [filtered, orderBy]);

  const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [orderBy]);

  useEffect(() => {
    void fetchClaimHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId, token]);

  const fmt = (d?: string | Date) => {
    if (!d) return "-";
    const date = typeof d === "string" ? new Date(d) : d;
    return isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold">Historial del Reclamo</h1>
      <p className="text-muted-foreground">Listado de eventos del reclamo con id {claimId}.</p>

      <Card className="mb-6 border-0 rounded-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="text-start">
              <h3 className="text-2xl font-semibold">Historial</h3>
            </div>
            
            <Select value={orderBy} onValueChange={(v) => setOrderBy(v)}>
              <SelectTrigger className="ml-auto w-full lg:w-1/4 max-w-60 bg-gray-50 border-none font-semibold">
                <span className="font-normal">Ordenar por:</span>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDesc">Más reciente</SelectItem>
                <SelectItem value="startAsc">Más antiguo</SelectItem>
              </SelectContent>
            </Select>
            
          </div>
        </CardContent>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-400">Reclamo</TableHead>
                  <TableHead className="text-gray-400">Empleado</TableHead>
                  <TableHead className="text-gray-400">Acción</TableHead>
                  <TableHead className="text-gray-400">Prioridad</TableHead>
                  <TableHead className="text-gray-400">Criticidad</TableHead>
                  <TableHead className="text-gray-400">Área</TableHead>
                  {!isCustomer && <TableHead className="text-gray-400">Subárea</TableHead>}
                  <TableHead className="text-gray-400">Estado</TableHead>
                  <TableHead className="text-gray-400">Inicio</TableHead>
                  <TableHead className="text-gray-400">Fin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-start">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      <FetchingSpinner />
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No hay historial disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((h) => (
                    <TableRow key={h._id}>
                      <TableCell>{h.claim}</TableCell>
                      <TableCell>{`${h.user?.firstName || ""} ${h.user?.lastName || ""}`}</TableCell>
                      <TableCell>{h.action || "-"}</TableCell>
                      <TableCell>{h.priority}</TableCell>
                      <TableCell>{h.criticality}</TableCell>
                      <TableCell>{h.area?.name ?? (h.area?.name ?? "-")}</TableCell>
                      {!isCustomer && <TableCell>{h.area?.subarea?.name ?? (h.area?.subarea?.name ?? "-")}</TableCell>}
                      <TableCell>{h.claimStatus ?? "-"}</TableCell>
                      <TableCell>{fmt(h.startTime)}</TableCell>
                      <TableCell>{fmt(h.endTime)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <div className="flex justify-end pr-25">
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Anterior
              </Button>

              {pages.map((page) => (
                <Button key={page} size="sm" variant={page === currentPage ? "default" : "outline"} onClick={() => setCurrentPage(page)}>
                  {page}
                </Button>
              ))}

              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
