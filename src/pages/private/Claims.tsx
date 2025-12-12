import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Claim } from "@/types/Claim";
import EditButton from "@/components/common/EditButton";
import FetchingSpinner from "@/components/common/FetchingSpinner";
import useAuth from "@/hooks/useAuth";
import { Role } from "@/types/Role";
import { ClaimStatus } from "@/types/ClaimStatus";

import { claimService } from "@/services/factories/claimServiceFactory";
import { Priority } from "@/types/Priority";

import EditClaimModal from "@/pages/private/components/EditClaimModal";
import MoreDetailsButton from "@/components/common/MoreDetailsButton";
import { useNavigate } from "react-router-dom";
import MessageModal from "@/pages/private/components/MessageModal";

export default function Claims() {
  const { logout, getAccessToken, role } = useAuth();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const claimsPerPage = 10;

  const token = getAccessToken();
  const navigate = useNavigate();
  const isCustomer = role === Role.CUSTOMER;

  const fetchClaims = async () => {
    if (!token) {
      toast.error("Por favor, inicia sesión para acceder a esta sección.");
      logout();
      return;
    }

    setLoading(true);
    const { success, claims } = await claimService.getAllClaims(token);
    setLoading(false);

    if (!success) {
      toast.error("Error al cargar los reclamos. Intenta nuevamente.");
      return;
    }

    if (!claims || claims.length === 0) {
      toast.info("No hay reclamos registrados.");
      setClaims([]);
      return;
    }

    setClaims([...claims]);
  };

  const getLabel = (item: any) => {
    if (!item && item !== 0) return "";
    if (typeof item === "string") return item;
    if (typeof item === "number") return String(item);
    if (item.name) return item.name;
    if (item.title) return item.title;
    if (item.label) return item.label;
    return String(item);
  };

  const getPriorityValue = (p: any) => {
    if (!p && p !== 0) return "";
    if (typeof p === "string") return p;
    if (p.name) return p.name;
    if (p.value) return p.value;
    return String(p);
  };

  useEffect(() => {
    void fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return claims.filter((c) => {
      // apply status filter first
      if (statusFilter !== "all") {
        const statusLabel = String(getLabel(c.claimStatus)).toLowerCase();
        if (statusLabel !== String(statusFilter).toLowerCase()) return false;
      }

      if (!q) return true;
      return (
        (c.claimCode || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.claimType || "").toLowerCase().includes(q) ||
        (c.area || "").toLowerCase().includes(q)
      );
    });
  }, [claims, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / claimsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visibleCols = isCustomer ? 7 : 8;

  useEffect(() => setCurrentPage(1), [search]);
  const paginated = useMemo(
    () =>
      filtered.slice((currentPage - 1) * claimsPerPage, currentPage * claimsPerPage),
    [filtered, currentPage]
  );

  return (
    <>
      <div className="p-6 space-y-6">
        <h1 className="text-4xl font-bold">Reclamos</h1>
        <p className="text-muted-foreground">Listado de reclamos registrados.</p>
        <Card className="mb-6 border-0 rounded-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="text-start">
                <h3 className="text-2xl font-semibold">Todos los reclamos</h3>
                <p className="text-md text-green-500">Reclamos: {claims.length}</p>
              </div>
              <div className="relative w-full max-w-60 md:w-1/3 ml-auto bg-gray-50">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </span>
                <Input
                  aria-label="Buscar reclamos"
                  placeholder="Buscar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 border-none"
                />
              </div>
              <div className="w-full md:w-auto">
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-50 bg-gray-50 border-none font-semibold">
                    <span className="font-normal">Estado</span>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {Object.values(ClaimStatus).map((s) => (
                      <SelectItem key={String(s)} value={String(s)}>{String(s)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-400">Código</TableHead>
                    <TableHead className="text-gray-400">Descripción</TableHead>
                    <TableHead className="text-gray-400">Tipo</TableHead>
                    <TableHead className="text-gray-400">Criticidad</TableHead>
                    <TableHead className="text-gray-400">Prioridad</TableHead>
                    <TableHead className="text-gray-400">Estado</TableHead>
                    {!isCustomer && <TableHead className="text-gray-400">Subarea</TableHead>}
                    <TableHead className="text-gray-400">Area</TableHead>
                    <TableHead className="text-gray-400 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-start">
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={visibleCols} className="text-center py-6">
                        <FetchingSpinner />
                      </TableCell>
                    </TableRow>
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={visibleCols} className="text-center py-6">
                        No hay resultados
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((claim: Claim) => (
                      <TableRow key={claim.id}>
                        <TableCell>{claim.claimCode}</TableCell>
                        <TableCell>{claim.description}</TableCell>
                        <TableCell>{getLabel(claim.claimType)}</TableCell>
                        <TableCell>{getLabel(claim.criticality)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                              getPriorityValue(claim.priority) === Priority.BAJA
                                ? "bg-yellow-100 text-yellow-800"
                                : getPriorityValue(claim.priority) === Priority.MEDIA
                                ? "bg-orange-100 text-orange-800"
                                : getPriorityValue(claim.priority) === Priority.ALTA
                                ? "bg-red-100 text-red-800"
                                : getPriorityValue(claim.priority) === Priority.URGENTE
                                ? "bg-rose-800 text-white"
                                : "bg-gray-100 text-gray-800"
                            }
                          `}
                          >
                            {getLabel(claim.priority)}
                          </span>
                        </TableCell>
                        <TableCell>{getLabel(claim.claimStatus)}</TableCell>
                        {!isCustomer && <TableCell>{claim.subarea ?? "-"}</TableCell>}
                        <TableCell>{claim.area}</TableCell>
                        <TableCell className="text-center space-x-2">
                          <MoreDetailsButton
                            handleViewDetails={() => {
                              if (claim && claim.id) {
                                navigate(`/claims/${claim.id}`);
                              }
                            }}
                          />
                          {role !== Role.CUSTOMER && (
                            <EditButton
                              handleEdit={() => {
                                setSelectedClaim(claim);
                                setModalOpen(true);
                              }}
                            />
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedClaim(claim);
                              setMessageModalOpen(true);
                            }}
                          >
                            Mensajes
                          </Button>
                        </TableCell>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>

                  {pages.map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
        </Card>
      </div>

      {modalOpen && (
        <EditClaimModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          claim={selectedClaim}
          onSaved={async () => {
            void fetchClaims();
          }}
        />
      )}

      {messageModalOpen && (
        <MessageModal
          open={messageModalOpen}
          onOpenChange={setMessageModalOpen}
          claimId={selectedClaim ? String(selectedClaim.id) : null}
        />
      )}
    </>
  );
}
