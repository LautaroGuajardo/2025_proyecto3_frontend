import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import type { Project } from "@/types/Project";
import { projectService } from "@/services/factories/projectServiceFactory";
import { ProjectType as PROJECT_TYPE } from "@/types/ProjectType";
import type { ProjectType } from "@/types/ProjectType";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import FetchingSpinner from "@/components/common/FetchingSpinner";
import EditProjectModal from "@/pages/private/components/EditProjectModal";
import EditClaimModal from "@/pages/private/components/EditClaimModal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import EditButton from "@/components/common/EditButton";
import DeleteButton from "@/components/common/DeleteButton";

export default function Project() {
  const { getAccessToken, logout } = useAuth();
  const token = getAccessToken();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Claim modal state (open with a selected project pre-filled)
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimInitial, setClaimInitial] = useState<any | null>(null);

  const { getAllProjects } = projectService;

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        toast.error("Por favor, inicia sesión para acceder a esta sección.");
        logout();
        return;
      }
      setLoading(true);
      setProjectTypes(Object.values(PROJECT_TYPE) as ProjectType[]);

      const res = await getAllProjects(token);
      const { success, projects } = res as { success: boolean; projects?: Project[]; message?: string };
      setLoading(false);
      if (!success) {
        toast.error("Error al cargar proyectos.");
        return;
      }
      if (!projects || projects.length === 0) {
        toast.info("No se encontraron proyectos.");
        return;
      }

      setProjects(projects);
    };

    const timeout = setTimeout(() => {
      fetchProjects();
    }, 0);
    return () => clearTimeout(timeout);
  }, [token, logout, getAllProjects]);

  const handleSaveProject = async (
    project: Project,
    isEdit: boolean
  ) => {
    if (!project.title) return toast.error("El nombre es obligatorio");
    if (!token) {
      toast.error("Por favor, inicia sesión para realizar esta acción.");
      logout();
      return;
    }
    if (!isEdit) {
      const {
        success,
        project: created,
        message,
      } = await projectService.createProject(token, {
        title: project.title,
        description: project.description,
        projectType: project.projectType,
      });
      if (!success || !created) {
        toast.error(message || "No se pudo crear el proyecto.");
        return;
      }
      setProjects((p) => [created, ...p]);
      toast.success("Proyecto creado");
    } else {
      if (!("id" in project) || !project.id)
        return toast.error("ID de proyecto no válida");
      const {
        success,
        message,
        project: updatedProject,
      } = await projectService.updateProjectById(token, project.id, {
        title: project.title,
        description: project.description,
        projectType: project.projectType,
      });
      if (!success) {
        toast.error(message || "No se pudo actualizar el proyecto.");
        return;
      }
      setProjects((p) =>
        p.map((c) => (c.id === updatedProject?.id ? updatedProject : c))
      );
      toast.success("Proyecto actualizado");
    }
    setModalOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (!token) {
      toast.error("Por favor, inicia sesión para realizar esta acción.");
      logout();
      return;
    }
    const { success, message } = await projectService.deleteProjectById(
      token,
      id
    );
    if (!success) {
      toast.error(message || "No se pudo eliminar el proyecto.");
      return;
    }
    setProjects((p) => p.filter((c) => c.id !== id));
    toast.success("Proyecto eliminado");
  };

  const filtered = projects.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q) ||
      c.id.includes(q)
    );
  });

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (orderBy) {
      case "title":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "latest":
      default:
        return list;
    }
  }, [filtered, orderBy]);

  const paginated = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    // If filter/sort changes and current page is out of range, clamp it
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  useEffect(() => {
    // when ordering changes, go back to first page
    setCurrentPage(1);
  }, [orderBy]);

  return (
    <>
      <div className="p-6 space-y-6">
        <h1 className="text-4xl font-bold">Proyectos</h1>
        <Card className="mb-6 border-0 rounded-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="text-start">
                <h3 className="text-2xl font-semibold">Todos los proyectos</h3>
              </div>
              <div className="relative w-full max-w-60 md:w-1/3 ml-auto bg-gray-50">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </span>
                <Input
                  placeholder="Buscar"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 border-none"
                />
              </div>
              <Select value={orderBy} onValueChange={(v) => setOrderBy(v)}>
                <SelectTrigger className="w-full lg:w-1/4 max-w-60 bg-gray-50 border-none font-semibold">
                  <span className="font-normal">Ordenar por:</span>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Más reciente</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-full md:w-auto">
                <Button
                  onClick={() => {
                    setSelectedProject(null);
                    setModalOpen(true);
                  }}
                >
                  Agregar Proyecto
                </Button>
              </div>
            </div>
          </CardContent>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-400">ID</TableHead>
                    <TableHead className="text-gray-400">Titulo</TableHead>
                    <TableHead className="text-gray-400">Descripción</TableHead>
                    <TableHead className="text-gray-400">Tipo Proyecto</TableHead>
                    <TableHead className="flex justify-center text-gray-400">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-start">
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <FetchingSpinner />
                      </TableCell>
                    </TableRow>
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No hay resultados
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.id}</TableCell>
                        <TableCell>{c.title}</TableCell>
                        <TableCell>{c.description}</TableCell>
                        <TableCell>{c.projectType}</TableCell>
                        <TableCell className="flex items-center justify-center space-x-2">
                          <EditButton
                            handleEdit={() => {
                              setSelectedProject(c);
                              setModalOpen(true);
                            }}
                          />
                          <DeleteButton
                            handleDelete={() => {
                              setSelectedProject(c);
                              setDeleteModalOpen(true);
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            title="Crear Reclamo"
                            onClick={() => {
                              setClaimInitial({ project: c });
                              setClaimModalOpen(true);
                            }}
                          >
                            Crear Reclamo
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

        {modalOpen && (
          <EditProjectModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            project={selectedProject}
            saveProject={handleSaveProject}
            projectTypes={projectTypes}
          />
        )}
        {claimModalOpen && (
          <EditClaimModal
            open={claimModalOpen}
            onOpenChange={setClaimModalOpen}
            claim={claimInitial}
          />
        )}
        {deleteModalOpen && selectedProject && (
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedProject(null);
            }}
            onConfirm={async () => {
              if (selectedProject && selectedProject.id) {
                await handleDeleteProject(selectedProject.id);
              }
              setDeleteModalOpen(false);
              setSelectedProject(null);
            }}
          />
        )}
      </div>
    </>
  );
}
