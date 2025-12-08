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
import useAuth from "@/hooks/useAuth";
import { claimService } from "@/services/factories/claimServiceFactory";
import { projectService } from "@/services/factories/projectServiceFactory";
import { areaService } from "@/services/factories/areaServiceFactory";

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  claim: Claim | null;
  onSaved?: () => void;
};

export default function EditClaimModal({ open, onOpenChange, claim, onSaved }: Props) {
  const isEdit = Boolean(claim && claim.id);
  const { getAccessToken, role } = useAuth();
  const token = getAccessToken();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [claimCode, setClaimCode] = useState("");
  const [description, setDescription] = useState("");
  const [claimTypeId, setClaimTypeId] = useState("");
  const [criticalityId, setCriticalityId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [subareaName, setSubareaName] = useState("");
  const isCustomer = role === Role.CUSTOMER;

  const claimTypes = Object.values(ClaimType) as string[];
  const criticalities = Object.values(Criticality) as string[];
  const priorities = Object.values(Priority) as string[];
  const [projects, setProjects] = useState<Project[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url?: string; name: string; type: string }[]>([]);

  const claimSchema = z.object({
    id: z.string().optional(),
    claimCode: z.string().min(1, "El código es obligatorio"),
    description: z.string().optional(),
    claimType: z.string().min(1, "El tipo es obligatorio"),
    criticality: z.string().min(1, "La criticidad es obligatoria"),
    priority: z.string().min(1, "La prioridad es obligatoria"),
    projectId: z.string().min(1, "El proyecto es obligatorio"),
    area: z.string().optional(),
    subarea: z.string().optional(),
  });

  useEffect(() => {
    // load reference data
    const load = async () => {
      if (!token) return;
      const [projRes, areasRes] = await Promise.all([
        projectService.getAllProjects(token),
        areaService.getAllAreas(token),
      ]);

      if (projRes.success && projRes.projects) setProjects(projRes.projects.map((c)=> ({...c, id: String((c).id)})));
      if (areasRes.success && areasRes.areas) setAreas(areasRes.areas);
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (claim) {
      const editing = Boolean((claim).id);
      if (editing) {
        setClaimCode(claim.claimCode || "");
        setDescription(claim.description || "");
        setClaimTypeId(String((claim.claimType) ?? claim.claimType ?? ""));
        setCriticalityId(String((claim.criticality) ?? claim.criticality ?? ""));
        setPriorityId(String((claim.priority) ?? claim.priority ?? ""));
        setProjectId(String((claim.project)?.id ?? ""));
        
        const claimAreaStr = typeof claim.area === 'string' ? claim.area : (claim.area as any)?.name || "";
        const claimSubareaStr = typeof claim.subarea === 'string' ? claim.subarea : (claim.subarea as any)?.name || "";
        setAreaName(claimAreaStr);
        setSubareaName(claimSubareaStr);
        
        if (claimAreaStr) {
          const foundArea = areas.find(a => a.name === claimAreaStr);
          if (foundArea) setSelectedAreaId(foundArea.id);
        }
      } else {
        setClaimCode("");
        setDescription("");
        setClaimTypeId("");
        setCriticalityId("");
        setPriorityId("");
        setProjectId(String((claim).project?.id ?? ""));
        setSelectedAreaId("");
        setAreaName("");
        setSubareaName("");
      }
    } else {
      setClaimCode("");
      setDescription("");
      setClaimTypeId("");
      setCriticalityId("");
      setPriorityId("");
      setProjectId("");
      setSelectedAreaId("");
      setAreaName("");
      setSubareaName("");
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
    const selectedArea = areas.find(a => a.id === areaId);
    if (selectedArea) {
      setAreaName(selectedArea.name);
      setSubareaName("");
    }
  };

  const handleSubareaChange = (subareaId: string) => {
    const selectedArea = areas.find(a => a.id === selectedAreaId);
    if (selectedArea) {
      const selectedSubarea = selectedArea.subareas?.find((s: any) => s.id === subareaId);
      if (selectedSubarea) {
        setSubareaName(selectedSubarea.name);
      }
    }
  };

  const filteredSubareas = selectedAreaId
    ? areas.find(a => a.id === selectedAreaId)?.subareas || []
    : [];

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token) {
    toast.error("Por favor inicia sesión");
    return;
  }
  setLoading(true);
  try {
    if (isEdit && claim) {
      const parsed = claimSchema.safeParse({
        id: String(claim.id),
        claimCode,
        description: description || undefined,
        claimType: claimTypeId,
        criticality: criticalityId,
        priority: priorityId,
        projectId,
        area: areaName || undefined,
        subarea: subareaName || undefined,
      });
      if (!parsed.success) {
        const fieldErrors: Partial<Record<string, string>> = {};
        parsed.error.issues.forEach((issue) => {
          fieldErrors[String(issue.path[0])] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
      const toSave: Partial<Claim> = {
        ...parsed.data,
        project: projects.find((p) => String(p.id) === projectId),
        area: areaName || undefined,
        subarea: subareaName || undefined,
        attachments: files.length ? files : undefined,
      };
      const { success, message } = await claimService.updateClaimById(
        token,
        claim.id,
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
        claimCode,
        description: description || undefined,
        claimType: claimTypeId,
        criticality: criticalityId,
        priority: priorityId,
        projectId,
        area: areaName || undefined,
        subarea: subareaName || undefined,
      });

      if (!parsed.success) {
        const fieldErrors: Partial<Record<string, string>> = {};
        parsed.error.issues.forEach((issue) => {
          fieldErrors[String(issue.path[0])] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const toSave: Partial<Claim> = {
        ...parsed.data,
        project: projects.find((p) => String(p.id) === projectId),
        area: areaName || undefined,
        subarea: subareaName || undefined,
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

  } catch (err: any) {
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
                <Label className="text-nowrap text-gray-500 w-2/5">Proyecto</Label>
                <Select value={projectId} onValueChange={(v)=>setProjectId(v)}>
                  <SelectTrigger className="w-3/5"><SelectValue placeholder="Seleccione una opcion"/></SelectTrigger>
                  <SelectContent>
                    {projects.map((p)=> (<SelectItem key={p.id} value={String(p.id)}>{p.title || p.name || `#${p.id}`}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-3/5 ml-auto">
                {errors.projectId && (
                  <p className="text-sm text-start text-red-500">{errors.projectId}</p>
                )}
              </div>

              <div className="flex gap-1 flex-col">
                <div className="flex w-full">
                  <Label htmlFor="claimCode" className="text-nowrap text-gray-500 w-2/5">
                  Código*
                  </Label>
                  <Input
                    required
                    id="claimCode" 
                    name="claimCode" 
                    value={claimCode} 
                    onChange={(e)=>setClaimCode(e.target.value)} 
                    className="w-3/5" />
                </div>
                <div className="w-3/5 ml-auto">
                  {errors.claimCode && (
                    <p className="text-sm text-start text-red-500">{errors.claimCode}</p>
                  )}
                </div>
              </div>

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
                  <Label className="text-nowrap text-gray-500 w-2/5">Adjuntos</Label>
                  <div className="w-3/5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                    <div
                      className="border-dashed border-2 border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center gap-3 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
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
                            <button type="button" className="text-xs text-rose-600 mt-1" onClick={() => removeFileAt(i)}>Eliminar</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 flex-col">
                <div className="flex w-full">
                  <Label className="text-nowrap text-gray-500 w-2/5">Tipo de reclamo*</Label>
                  <Select value={claimTypeId} onValueChange={(v)=>setClaimTypeId(v)}>
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
                <Label className="text-nowrap text-gray-500 w-2/5">Criticidad*</Label>
                <Select value={criticalityId} onValueChange={(v)=>setCriticalityId(v)}>
                  <SelectTrigger className="w-3/5"><SelectValue placeholder="Seleccione una opcion"/></SelectTrigger>
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
                <Label className="text-nowrap text-gray-500 w-2/5">Prioridad*</Label>
                <Select value={priorityId} onValueChange={(v)=>setPriorityId(v)}>
                  <SelectTrigger className="w-3/5"><SelectValue placeholder="Seleccione una opcion"/></SelectTrigger>
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
                    <Label className="text-nowrap text-gray-500 w-2/5">Área</Label>
                    <Select value={selectedAreaId} onValueChange={handleAreaChange}>
                      <SelectTrigger className="w-3/5"><SelectValue placeholder="Seleccione un área"/></SelectTrigger>
                      <SelectContent>
                        {areas.map((area)=> (<SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-3/5 ml-auto">
                    {errors.area && (
                      <p className="text-sm text-start text-red-500">{errors.area}</p>
                    )}
                  </div>
    
                  <div className="flex w-full">
                    <Label className="text-nowrap text-gray-500 w-2/5">Subárea</Label>
                    <Select
                      value={filteredSubareas.find((s: any) => s.name === subareaName)?.id || ""}
                      onValueChange={handleSubareaChange}
                      disabled={!selectedAreaId}
                    >
                      <SelectTrigger className="w-3/5"><SelectValue placeholder="Seleccione una subárea"/></SelectTrigger>
                      <SelectContent>
                        {filteredSubareas.map((s: any)=> (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-3/5 ml-auto">
                    {errors.subareaId && (
                      <p className="text-sm text-start text-red-500">{errors.subareaId}</p>
                    )}
                  </div>
                  </>
                )}

              <div className="flex w-full items-center gap-3">
                <Button variant="outline" className="w-1/2" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button className="w-1/2" type="submit" disabled={loading} variant="default">
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
