import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import FetchingSpinner from "@/components/common/FetchingSpinner";
import EditButton from "@/components/common/EditButton";
import DeleteButton from "@/components/common/DeleteButton";
import MoreDetailsButton from "@/components/common/MoreDetailsButton";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

import EditUserModal from "./components/EditUserModal";

import useAuth from "@/hooks/useAuth";

import type { UserFormData } from "@/types/User";
import { userService } from "@/services/factories/userServiceFactory";
const { getAllUsers, deleteUserByEmail} = userService;

export default function Users() {
  const { logout, getAccessToken } = useAuth();

  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<string>("latest");
  const [users, setUsers] = useState<UserFormData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = getAccessToken();

  const fetchUsers = async () => {
    if (!token) {
      toast.error("Por favor, inicia sesión para acceder a esta sección");
      logout();
      return;
    }

    // Cargar todos los usuarios al cargar la página
    setLoading(true);
    const { success, message, users } = await getAllUsers(token);
    setLoading(false);

    if (!success && message) {
      toast.error(message);
      return;
    }
    if (!users || users.length === 0) {
      toast.info("Usuarios no encontrados.");
      return;
    }
    const email = localStorage.getItem("email") || "";
    setUsers(users.filter((user) => user.email !== email));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, orderBy]);

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;

    const name = (user.firstName || "").toLowerCase();
    const lastname = (user.lastName || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = (
      (user as unknown as { phone?: string }).phone ?? ""
    ).toLowerCase();

    return (
      name.includes(q) ||
      lastname.includes(q) ||
      email.includes(q) ||
      phone.includes(q)
    );
  });

  
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (orderBy) {
      case "name":
        return (a.firstName || "").localeCompare(b.firstName || "");
      case "lastName":
        return (a.lastName || "").localeCompare(b.lastName || "");
      case "email":
        return (a.email || "").localeCompare(b.email || "");
      case "phone":
        return ((a as unknown as { phone?: string }).phone || "").localeCompare(
          (b as unknown as { phone?: string }).phone || ""
        );
      case "latest":
      default:
        return 0;
    }
  });

  const handleSave = (user: UserFormData, isEdit: boolean) => {
    if (isEdit) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.email === user.email ? user : u))
      );
      toast.success("Usuario actualizado correctamente");
    } else {
      fetchUsers(); // Refrescar la lista de usuarios
    }
  };

  const handleDeleteUser = async (user: UserFormData) => {
    if (!token) {
      toast.error("Por favor, inicia sesión para realizar esta acción.");
      logout();
      return;
    }

    try {
      const { success, message } = await deleteUserByEmail(token, user.email);

      if (!success) {
        toast.error(message || "Error al eliminar el usuario.");
        return;
      }

      setUsers((prev) => prev.filter((u) => u.email !== user.email));
      toast.success("Usuario eliminado correctamente.");
    } catch {
      toast.error("Error al eliminar el usuario.");
    }
  };

  // Paginación
  const USERS_PER_PAGE = 5;

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / USERS_PER_PAGE));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <>
      <div className="p-6 space-y-6">
        <h1 className="text-4xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">
          Sección donde se gestionan los usuarios del sistema.
        </p>
        <Card className="mb-6 border-0 rounded-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="text-start">
                <h3 className="text-2xl font-semibold">Todos los usuarios</h3>
              </div>
              <div className="relative w-full max-w-60 md:w-1/3 ml-auto bg-gray-50">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </span>
                <Input
                  aria-label="Buscar usuarios"
                  placeholder="Buscar"
                  value={search}
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
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
                  <SelectItem value="lastname">Apellido</SelectItem>
                  <SelectItem value="email">Correo</SelectItem>
                  <SelectItem value="phone">Teléfono</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-full md:w-auto">
                <Button
                  onClick={() => {
                    setSelectedUser(null);
                    setModalOpen(true);
                  }}
                >
                  Agregar Usuario
                </Button>
              </div>
            </div>
          </CardContent>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-400">Nombre</TableHead>
                    <TableHead className="text-gray-400">Apellido</TableHead>
                    <TableHead className="text-gray-400">Rol</TableHead>
                    <TableHead className="text-gray-400">Subárea</TableHead>
                    <TableHead className="text-gray-400">Area</TableHead>
                    <TableHead className="text-gray-400">Correo electrónico</TableHead>
                    <TableHead className="text-gray-400">Telefono</TableHead>
                    <TableHead className="text-center text-gray-400">
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
                  ) : paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user: UserFormData) => (
                      <TableRow
                        key={
                          user.email.length > 50
                            ? user.email.slice(0, 50)
                            : user.email
                        }
                      >
                        <TableCell>
                          {user.firstName.length > 50
                            ? user.firstName.slice(0, 50)
                            : user.firstName}
                        </TableCell>
                        <TableCell>
                          {user.lastName.length > 50
                            ? user.lastName.slice(0, 50)
                            : user.lastName}
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          {user.subarea ?? "---"}
                        </TableCell>
                        <TableCell>
                          {user.area ?? "---"}
                        </TableCell>
                        <TableCell>
                          {user.email.length > 50
                            ? user.email.slice(0, 50)
                            : user.email}
                        </TableCell>
                        <TableCell>{user.phone ?? "---"}</TableCell>
                        <TableCell className="text-center space-x-2">
                          <MoreDetailsButton
                            handleViewDetails={() => {
                              setSelectedUser(user);
                              setModalOpen(true);
                            }}
                          />
                          <EditButton
                            handleEdit={() => {
                              setSelectedUser(user);
                              setModalOpen(true);
                            }}
                          />
                          <DeleteButton
                            handleDelete={() => {
                              setSelectedUser(user);
                              setDeleteModalOpen(true);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Paginación */}
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
          </CardContent>
        </Card>
        {modalOpen && (
          <EditUserModal
            open={modalOpen}
            setModalOpen={setModalOpen}
            user={selectedUser}
            onSave={handleSave}
          />
        )}
        {deleteModalOpen && selectedUser && (
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={async () => {
              if (selectedUser) {
                await handleDeleteUser(selectedUser);
              }
              setDeleteModalOpen(false);
              setSelectedUser(null);
            }}
          />
        )}
      </div>
    </>
  );
}
