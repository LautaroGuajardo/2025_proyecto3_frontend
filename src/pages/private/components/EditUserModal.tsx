import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IdCard } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { userService } from "@/services/factories/userServiceFactory";
const { updateUserByEmail } = userService;

import useAuth from "@/hooks/useAuth";

import type { UserFormData } from "@/types/User";

type Props = {
  open: boolean;
  setModalOpen: (val: boolean) => void;
  user: UserFormData | null;
  onSave: (user: UserFormData, isEdit: boolean) => void;
};

const initialFormState: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  role: "USER",
};

export default function EditUserModal({
  open,
  setModalOpen,
  user,
  onSave,
}: Props) {
  const { logout, getAccessToken } = useAuth();
  const isEdit = user !== null;

  const [form, setForm] = useState<UserFormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);

  const token = getAccessToken();

  useEffect(() => {
    if (isEdit && user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "USER",
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [isEdit, user, open]);

  const handleSelectChange = (
    field: keyof UserFormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("No se encontró el token de acceso.");
      logout();
      return;
    }
    if (!isEdit) {
      toast.info("Crear usuarios no está disponible desde este modal.");
      return;
    }
    {
      if (!form.firstName || !form.lastName) {
        toast.error("Por favor completá todos los campos obligatorios.");
        return;
      }
      setLoading(true);
      const { success, user: updatedUser } = await updateUserByEmail(
        token,
        form
      );
      setLoading(false);

      if (!success) {
        toast.error("Error al actualizar el usuario.");
        return;
      }
      if (updatedUser) onSave(updatedUser, isEdit);
      setModalOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <IdCard className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-gray-800 text-lg font-semibold">
                Gestionar rol de usuario
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Este formulario permitirá gestionar el rol de un usuario del
                sistema.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4 w-full">
            <div className="space-y-6">
              <div className="flex">
                <Label htmlFor="name" className="w-1/3 text-gray-600">
                  Nombre del usuario*
                </Label>
                <Input
                  id="name"
                  value={form.firstName}
                  disabled
                  onChange={(e) =>
                    handleSelectChange("firstName", e.target.value)
                  }
                  className="w-2/3"
                />
              </div>

              <div className="flex">
                <Label htmlFor="lastName" className="w-1/3 text-gray-600">
                  Apellido del usuario*
                </Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  disabled
                  onChange={(e) =>
                    handleSelectChange("lastName", e.target.value)
                  }
                  className="w-2/3"
                />
              </div>

              <div className="flex">
                <Label htmlFor="email" className="w-1/3 text-gray-600">
                  Correo electrónico*
                </Label>
                <Input
                  id="email"
                  value={form.email}
                  disabled
                  readOnly
                  className="w-2/3"
                />
              </div>

              <div className="flex">
                <Label htmlFor="role" className="w-1/3 text-gray-600">
                  Rol*
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => handleSelectChange("role", val)}
                >
                  <SelectTrigger className="w-2/3">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="AUDITOR">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setModalOpen(false)}
              className="w-1/2"
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-1/2" disabled={loading}>
              Confirmar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
