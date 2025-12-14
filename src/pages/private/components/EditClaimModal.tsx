import React, { useEffect, useState, useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MessageCircleWarning, Edit } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { z } from "zod";

import type { Claim } from "@/types/Claim";
import type { Project } from "@/types/Project";
import type { Area } from "@/types/Area";
import { Role } from "@/types/Role";
import { ClaimType } from "@/types/ClaimType";
import { Criticality } from "@/types/Criticality";
import { Priority } from "@/types/Priority";
import { ClaimStatus } from "@/types/ClaimStatus";
import useAuth from "@/hooks/useAuth";
import { claimService } from "@/services/factories/claimServiceFactory";
import { projectService } from "@/services/factories/projectServiceFactory";
import { areaService } from "@/services/factories/areaServiceFactory";
import type { Subarea } from "@/types/Subarea";

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  claim: Claim | null;
  onSaved?: () => void;
};

export default function EditClaimModal({ open, onOpenChange, claim, onSaved }: Props) {
  const isEdit = Boolean(claim && claim._id);
  const { getAccessToken, role } = useAuth();
  const token = getAccessToken();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [claimId, setClaimId] = useState("");
  const [description, setDescription] = useState("");
  const [claimTypeId, setClaimTypeId] = useState("");
  const [criticalityId, setCriticalityId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [project, setProject] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [subareaName, setSubareaName] = useState("");
  const [selectedSubareaId, setSelectedSubareaId] = useState("");
  const [actions, setActions] = useState("");
  const isCustomer = role === Role.CUSTOMER;

  const claimTypes = Object.values(ClaimType) as string[];
  const criticalities = Object.values(Criticality) as string[];
  const priorities = Object.values(Priority) as string[];
  const statuses = Object.values(ClaimStatus) as string[];
  const [projects, setProjects] = useState<Project[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url?: string; name: string; type: string }[]>([]);

  const claimSchema = z.object({
    id: z.string().optional(),
    description: z.string().optional(),
    claimType: z.string().min(1, "El tipo es obligatorio"),
    criticality: z.string().min(1, "La criticidad es obligatoria"),
    priority: z.string().min(1, "La prioridad es obligatoria"),
    project: z.string().min(1, "El proyecto es obligatorio"),
    area: z.string().optional(),
    subarea: z.string().optional(),
    claimStatus: z.string().optional(),
    actions: z.string().optional(),
  });

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const [projRes, areasRes] = await Promise.all([
        projectService.getAllProjects(token),
        areaService.getAllAreas(token),
      ]);

      if (projRes.success && projRes.projects) setProjects(projRes.projects.map((c)=> ({...c, id: String((c)._id)})));
      if (areasRes.success && areasRes.areas) setAreas(areasRes.areas);
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (claim) {
      const editing = Boolean(claim._id);
      if (editing) {
        setClaimId(claim._id || "");
        setDescription(claim.description || "");
        setClaimTypeId(String((claim.claimType) ?? claim.claimType ?? ""));
        setCriticalityId(String((claim.criticality) ?? claim.criticality ?? ""));
        setPriorityId(String((claim.priority) ?? claim.priority ?? ""));
        setStatusId(String(claim.claimStatus ?? ""));
        setProject(String((claim.project)?._id ?? ""));
        // Siempre dejar el campo 'actions' vacío al abrir el modal,
        // porque debe ser completado cada vez que se haga un cambio.
        setActions("");
        
        // runtime type guards to avoid unsafe casting
        const isObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object";
        const hasName = (v: unknown): v is { name: unknown } => isObject(v) && "name" in v;

        if (typeof claim.area === "string") {
          // si el area viene como string (antiguo) lo tratamos como nombre
          const claimAreaStr = claim.area;
          setAreaName(claimAreaStr);
          const foundArea = areas.find(a => a.name === claimAreaStr);
          if (foundArea) {
            setSelectedAreaId(foundArea._id);
          } else {
            setSelectedAreaId("");
          }
        } else if (isObject(claim.area)) {
          const areaObj = claim.area as Record<string, unknown>;
          // preferimos el _id cuando esté disponible
          if ("_id" in areaObj && areaObj._id) {
            setSelectedAreaId(String(areaObj._id));
          } else {
            setSelectedAreaId("");
          }
          if ("name" in areaObj && typeof areaObj.name === "string") {
            setAreaName(areaObj.name as string);
          } else {
            setAreaName("");
          }

          const sub = areaObj.subarea;
          if (typeof sub === "string") {
            setSubareaName(sub);
            // try to find subarea id by name
            const found = areas
              .find(a => String(a._id) === String(areaObj._id))
              ?.subareas?.find((s: Subarea) => s.name === sub);
            setSelectedSubareaId(found?._id || "");
          } else if (isObject(sub)) {
            const subObj = sub as Record<string, unknown>;
            if ("_id" in subObj && subObj._id) setSelectedSubareaId(String(subObj._id));
            if ("name" in subObj && typeof subObj.name === "string") setSubareaName(subObj.name as string);
          } else {
            setSubareaName("");
            setSelectedSubareaId("");
          }
        } else {
          // no area
          setAreaName("");
          setSubareaName("");
          setSelectedAreaId("");
          setSelectedSubareaId("");
        }
      } else {
        setDescription("");
        setClaimTypeId("");
        setCriticalityId("");
        setPriorityId("");
        setStatusId("");
        setProject(String((claim).project?._id ?? ""));
        setSelectedAreaId("");
        setAreaName("");
        setSubareaName("");
        setActions("");
      }
    } else {
      setDescription("");
      setClaimTypeId("");
      setCriticalityId("");
      setPriorityId("");
      setProject("");
      setSelectedAreaId("");
      setAreaName("");
      setSubareaName("");
      setActions("");
    }
  }, [claim, open, areas]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    const arr = Array.from(list);
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews((p) => [...p, { url: String(reader.result), name: file.name, type: file.type }]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews((p) => [...p, { url: undefined, name: file.name, type: file.type }]);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeFileAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    const selectedArea = areas.find(a => a._id === areaId);
    if (selectedArea) {
      setAreaName(selectedArea.name);
      setSubareaName("");
    }
  };

  const handleSubareaChange = (subareaId: string) => {
    const selectedArea = areas.find(a => a._id === selectedAreaId);
    if (selectedArea) {
      const selectedSubarea = selectedArea.subareas?.find((s: Subarea) => s._id === subareaId);
      if (selectedSubarea) {
        setSubareaName(selectedSubarea.name);
        setSelectedSubareaId(selectedSubarea._id);
      } else {
        setSubareaName("");
        setSelectedSubareaId("");
      }
    } else {
      setSubareaName("");
      setSelectedSubareaId("");
    }
  };

  const filteredSubareas = selectedAreaId
    ? areas.find(a => a._id === selectedAreaId)?.subareas || []
    : [];

  const estadoActual = claim?.claimStatus;
  const allowedStatuses = React.useMemo(() => {
    if (!isEdit) return statuses;
    if (estadoActual === ClaimStatus.RESOLVED) return [ClaimStatus.RESOLVED];
    if (estadoActual === ClaimStatus.IN_PROGRESS) return [ClaimStatus.IN_PROGRESS, ClaimStatus.RESOLVED];
    return statuses;
  }, [estadoActual, isEdit, statuses]);

  const esResuelto = isEdit && estadoActual === ClaimStatus.RESOLVED;

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token) {
    toast.error("Por favor inicia sesión");
    return;
  }
  if (esResuelto) {
    toast.error("No se puede modificar un reclamo resuelto");
    return;
  }
  if (!isCustomer) {
    const extraErrors: Partial<Record<string, string>> = {};
    if (!statusId) extraErrors.status = "El estado es obligatorio";
    if (!actions.trim()) extraErrors.actions = "Las acciones son obligatorias";
    if (Object.keys(extraErrors).length) {
      setErrors((prev) => ({ ...prev, ...extraErrors }));
      return;
    }
  }
  setLoading(true);
  try {
    if (isEdit && claim) {
      const parsed = claimSchema.safeParse({
        id: String(claim._id),
        description: description || undefined,
        claimType: claimTypeId,
        criticality: criticalityId,
        priority: priorityId,
        project,
        area: areaName || undefined,
        subarea: subareaName || undefined,
        claimStatus: statusId || claim.claimStatus,
        actions: actions || undefined,
      });
      if (!parsed.success) {
        const fieldErrors: Partial<Record<string, string>> = {};
        parsed.error.issues.forEach((issue) => {
          fieldErrors[String(issue.path[0])] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
      // remove `id` and `area` from parsed data before sending
      const { id: _dropId, area: _dropArea, ...cleaned } = parsed.data as any;
      const toSave: Partial<Claim> = {
        ...cleaned,
        _id: claim._id,
        // backend expects `project` as id string
        project: project,
        // backend expects `subarea` as id (do NOT send `area`)
        subarea: selectedSubareaId || undefined,
        claimStatus: statusId || claim.claimStatus,
        actions: actions || undefined,
      };
      const { success, message } = await claimService.updateClaimById(
        token,
        toSave
      );
      if (!success) {
        toast.error(message || "Error al actualizar el reclamo");
        return;
      }
      toast.success("Reclamo actualizado");
    }
    else {
      const parsed = claimSchema.safeParse({
        description: description || undefined,
        claimType: claimTypeId,
        criticality: criticalityId,
        priority: priorityId,
        project,
        area: areaName || undefined,
        subarea: subareaName || undefined,
        claimStatus: statusId || ClaimStatus.PENDING,
        actions: actions || undefined,
      });

      if (!parsed.success) {
        const fieldErrors: Partial<Record<string, string>> = {};
        parsed.error.issues.forEach((issue) => {
          fieldErrors[String(issue.path[0])] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // remove `id` and `area` from parsed data before sending
      const { id: _dropId2, area: _dropArea2, ...cleanedCreate } = parsed.data as any;
      const toSave: Partial<Claim> = {
        ...cleanedCreate,
        // backend expects `project` as id string
        project: project,
        // backend expects `subarea` as id (do NOT send `area`)
        subarea: selectedSubareaId || undefined,
        claimStatus: statusId || ClaimStatus.PENDING,
        actions: actions || undefined,
        attachments: files.length ? files : undefined,
      };

      const { success, message } = await claimService.createClaim(
        token,
        toSave
      );

      if (!success) {
        toast.error(message || "Error al crear reclamo");
        return;
      }

      toast.success("Reclamo creado");
    }

    if (typeof onSaved === "function") onSaved();
    onOpenChange(false);

  } catch (err) {
    toast.error(err?.message || "Error inesperado");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <MessageCircleWarning className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-gray-800 text-lg font-semibold">
                {isEdit ? "Editar reclamo" : "Crear nuevo reclamo"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {isEdit ? "Modifica la información del reclamo." : "Completa los datos para crear un nuevo reclamo."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4 w-full">
            <div className="space-y-6">

              <div className="flex w-full">
                <Label className="text-nowrap text-gray-500 w-2/5">
                  Proyecto
                </Label>
                <Select value={project} onValueChange={(v)=>setProject(v)} disabled={isEdit || esResuelto}>
                  <SelectTrigger className="w-3/5">
                    <SelectValue placeholder="Seleccione una opcion"/>
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p)=> (<SelectItem key={p._id} value={String(p._id)}>{p.title || `#${p._id}`}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-3/5 ml-auto">
                {errors.project && (
                  <p className="text-sm text-start text-red-500">{errors.project}</p>
                )}
              </div>

              {isEdit && (
                <div className="flex gap-1 flex-col">
                  <div className="flex w-full">
                    <Label htmlFor="claimId" className="text-nowrap text-gray-500 w-2/5">
                      Código*
                    </Label>
                    <Input
                      id="claimId"
                      name="claimId"
                      value={claimId}
                      onChange={(e) => setClaimId(e.target.value)}
                      disabled={true}
                      className="w-3/5" />
                  </div>
                  <div className="w-3/5 ml-auto">
                    {errors.claimId && (
                      <p className="text-sm text-start text-red-500">{errors.claimId}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-1 flex-col">
                <div className="flex w-full">
                  <Label htmlFor="description" className="text-nowrap text-gray-500 w-2/5">
                    Descripción*
                  </Label>
                  <Input
                    required
                    id="description" 
                    name="description" 
                    value={description} 
                    onChange={(e)=>setDescription(e.target.value)} 
                    disabled={isEdit || esResuelto}
                    className="w-3/5" />
                </div>
                <div className="w-3/5 ml-auto">
                  {errors.description && (
                    <p className="text-sm text-start text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-1">
                <div className="flex w-full">
                  <Label className="text-nowrap text-gray-500 w-2/5">
                    Adjuntos
                  </Label>
                  <div className="w-3/5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleFilesChange}
                      disabled={isEdit || esResuelto}
                      className="hidden"
                    />
                    <div
                      className="border-dashed border-2 border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center gap-3 cursor-pointer"
                      onClick={() => { if (!isEdit && !esResuelto) fileInputRef.current?.click(); }}
                    >
                      <div className="text-sm text-muted-foreground">Sube imágenes (jpg/png) o PDF(s). Opcional.</div>
                      <div className="text-xs text-muted-foreground">Puedes subir varios archivos</div>
                    </div>

                    {previews.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {previews.map((p, i) => (
                          <div key={i} className="border rounded p-2 text-center">
                            {p.url ? (
                              <img src={p.url} alt={p.name} className="h-20 w-full object-cover" />
                            ) : (
                              <div className="text-sm truncate">{p.name}</div>
                            )}
                            <button type="button" className="text-xs text-rose-600 mt-1" onClick={() => removeFileAt(i)} disabled={isEdit || esResuelto}>Eliminar</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 flex-col">
                <div className="flex w-full">
                  <Label className="text-nowrap text-gray-500 w-2/5">
                    Tipo de reclamo*
                  </Label>
                  <Select value={claimTypeId} onValueChange={(v)=>setClaimTypeId(v)} disabled={esResuelto}>
                    <SelectTrigger className="w-3/5">
                      <SelectValue placeholder="Seleccione una opcion" />
                    </SelectTrigger>
                    <SelectContent>
                      {claimTypes.map((ct) => (
                        <SelectItem key={String(ct)} value={String(ct)}>{String(ct)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-3/5 ml-auto">
                  {errors.claimType && (
                    <p className="text-sm text-start text-red-500">{errors.claimType}</p>
                  )}
                </div>
              </div>

              <div className="flex w-full">
                <Label className="text-nowrap text-gray-500 w-2/5">
                  Criticidad*
                </Label>
                <Select value={criticalityId} onValueChange={(v)=>setCriticalityId(v)} disabled={esResuelto}>
                  <SelectTrigger className="w-3/5">
                    <SelectValue placeholder="Seleccione una opcion"/>
                  </SelectTrigger>
                  <SelectContent>
                    {criticalities.map((c)=> (<SelectItem key={String(c)} value={String(c)}>{String(c)}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-3/5 ml-auto">
                {errors.criticality && (
                  <p className="text-sm text-start text-red-500">{errors.criticality}</p>
                )}
              </div>

              <div className="flex w-full">
                <Label className="text-nowrap text-gray-500 w-2/5">
                  Prioridad*
                </Label>
                <Select value={priorityId} onValueChange={(v)=>setPriorityId(v)} disabled={esResuelto}>
                  <SelectTrigger className="w-3/5">
                    <SelectValue placeholder="Seleccione una opcion"/>
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p)=> (<SelectItem key={String(p)} value={String(p)}>{String(p)}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-3/5 ml-auto">
                {errors.priority && (
                  <p className="text-sm text-start text-red-500">{errors.priority}</p>
                )}
              </div>
              

              {!isCustomer && (
                <>
                  <div className="flex w-full">
                    <Label className="text-nowrap text-gray-500 w-2/5">
                      Área
                    </Label>
                    <Select value={selectedAreaId} onValueChange={handleAreaChange} disabled={esResuelto}>
                      <SelectTrigger className="w-3/5">
                        <SelectValue placeholder="Seleccione un área"/>
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area)=> (<SelectItem key={area._id} value={area._id}>{area.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-3/5 ml-auto">
                    {errors.area && (
                      <p className="text-sm text-start text-red-500">{errors.area}</p>
                    )}
                  </div>
    
                  <div className="flex w-full">
                    <Label className="text-nowrap text-gray-500 w-2/5">
                      Subárea
                    </Label>
                    <Select
                      value={selectedSubareaId}
                      onValueChange={handleSubareaChange}
                      disabled={!selectedAreaId || esResuelto}
                    >
                      <SelectTrigger className="w-3/5"><SelectValue placeholder="Seleccione una subárea"/></SelectTrigger>
                      <SelectContent>
                        {filteredSubareas.map((s: Subarea)=> (<SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-3/5 ml-auto">
                    {errors.subareaId && (
                      <p className="text-sm text-start text-red-500">{errors.subareaId}</p>
                    )}
                  </div>

                  <div className="flex w-full">
                    <Label className="text-nowrap text-gray-500 w-2/5">
                      Estado
                    </Label>
                    <Select value={statusId} onValueChange={(v)=>setStatusId(v)} disabled={esResuelto}>
                      <SelectTrigger className="w-3/5">
                        <SelectValue placeholder="Seleccione una opcion"/>
                      </SelectTrigger>
                      <SelectContent>
                        {allowedStatuses.map((s)=> (<SelectItem key={String(s)} value={String(s)}>{String(s)}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-3/5 ml-auto">
                    {errors.status && (
                      <p className="text-sm text-start text-red-500">{errors.status}</p>
                    )}
                  </div>

                  <div className="flex gap-1 flex-col">
                    <div className="flex w-full">
                      <Label htmlFor="actions" className="text-nowrap text-gray-500 w-2/5">
                        Acciones*
                      </Label>
                      <Input
                        required
                        id="actions" 
                        name="actions" 
                        value={actions} 
                        onChange={(e)=>setActions(e.target.value)} 
                        disabled={esResuelto}
                        className="w-3/5" />
                    </div>
                    <div className="w-3/5 ml-auto">
                      {errors.actions && (
                        <p className="text-sm text-start text-red-500">{errors.actions}</p>
                      )}
                    </div>
                  </div>
                </>
                )}

              <div className="flex w-full items-center gap-3">
                <Button variant="outline" className="w-1/2" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button className="w-1/2" type="submit" disabled={loading || esResuelto} variant="default">
                  {loading ? <Edit className="animate-spin"/> : null}
                  {isEdit ? "Guardar cambios" : "Crear reclamo"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
