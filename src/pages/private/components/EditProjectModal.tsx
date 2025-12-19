import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FolderSymlink } from "lucide-react";
import { z } from "zod";
import type { Project } from "@/types/Project";
import type { ProjectType as ProjectTypeType } from "@/types/ProjectType";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project: Project | null;
  saveProject: (proj: Project, isEdit: boolean) => void;
  projectTypes?: ProjectTypeType[];
};

export default function EditProjectModal({
  open,
  onOpenChange,
  project,
  saveProject,
  projectTypes = [],
}: Props) {
  const isEdit = project !== null;
  const [form, setForm] = useState({ _id: "", title: "", description: "", projectType: "" });
  const { _id, title, description, projectType } = form;

  const projectSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, "El título es obligatorio"),
    description: z.string().optional(),
    projectType: z.string().nonempty("El tipo de proyecto es obligatorio"),
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof projectSchema>, string>>
  >({});

  useEffect(() => {
    // Only update the form when the modal opens or the project reference changes.
    // Removing `form` from deps prevents overwriting on every input change.
    const nextForm = isEdit && project
      ? {
          _id: project._id,
          title: project.title,
          description: project.description || "",
          projectType:
            typeof project.projectType === "string"
              ? project.projectType
              : project.projectType,
        }
      : { _id: "", title: "", description: "", projectType: "" };

    // Defer the state update so it doesn't run synchronously inside the effect
    const t = setTimeout(() => setForm(nextForm), 0);
    return () => clearTimeout(t);
  }, [isEdit, project, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => {
      const newErrors = { ...p } as Partial<
        Record<keyof z.infer<typeof projectSchema>, string>
      >;
      delete newErrors[name as keyof z.infer<typeof projectSchema>];
      return newErrors;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = isEdit
      ? { _id: String(_id), title, description, projectType }
      : { title, description, projectType };
    const parsed = projectSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Partial<
        Record<keyof z.infer<typeof projectSchema>, string>
      > = {};
      parsed.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof z.infer<typeof projectSchema>] =
          issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const selectedId = parsed.data.projectType;
    const selectedObj = projectTypes.find((pt) => pt === selectedId);

    type ParsedData = z.infer<typeof projectSchema>;
    type ResultData = Omit<ParsedData, "projectType"> & {
      projectType: string | ProjectTypeType | undefined;
      id?: string;
    };

    const resultData: ResultData = { ...parsed.data, projectType: parsed.data.projectType };

    if (selectedObj) {
      resultData.projectType = selectedObj;
    } else {
      if (isEdit && project && project.projectType) {
        resultData.projectType =
          typeof project.projectType === "string" ? project.projectType : project.projectType;
      }
    }

    saveProject(resultData as Project, isEdit);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <FolderSymlink className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">
                {isEdit ? "Editar proyecto" : "Agregar proyecto"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {isEdit ? "Modifica el proyecto" : "Crea un nuevo proyecto"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4 w-full">
            <div className="flex">
              <Label htmlFor="title" className="text-nowrap text-gray-500 w-2/5">
                Titulo*
              </Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={handleChange}
                className="w-3/5"
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}

            <div className="flex">
              <Label
                htmlFor="description"
                className="text-nowrap text-gray-500 w-2/5"
              >
                Descripción
              </Label>
              <Input
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                className="w-3/5"
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
            <div className="flex">
              <Label
                htmlFor="projectType"
                className="text-nowrap text-gray-500 w-2/5"
              >
                Tipo Proyecto
              </Label>
              <select
                id="projectType"
                name="projectType"
                value={projectType}
                onChange={handleChange}
                className="w-3/5 rounded border px-3 py-2 bg-transparent text-sm"
              >
                <option value="">Seleccione un tipo</option>
                {projectTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                </option>
                ))}
              </select>
            </div>
            {errors.projectType && (
              <p className="text-red-500 text-sm">{errors.projectType}</p>
            )}
            <div className="flex w-full items-center gap-3">
              <Button
                variant="outline"
                className="w-1/2"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button className="w-1/2" type="submit">
                {isEdit ? "Guardar cambios" : "Confirmar"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
