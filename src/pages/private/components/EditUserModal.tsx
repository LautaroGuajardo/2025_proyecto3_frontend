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
import { z } from "zod";

import { userService } from "@/services/factories/userServiceFactory";
import { authService } from "@/services/factories/authServiceFactory";
const { updateUserByEmail } = userService;
const { register: registerService } = authService;

import useAuth from "@/hooks/useAuth";

import type { UserFormData } from "@/types/User";
import type { RegisterFormDto } from "@/dto/RegisterFormDto";

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
  phone: "",
  area: "",
  subarea: "",
};

const createUserSchema = z
  .object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "El apellido es obligatorio"),
    email: z.email("El email no es válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres.")
      .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula.")
      .regex(/[a-z]/, "La contraseña debe tener al menos una letra minúscula.")
      .regex(/\d/, "La contraseña debe tener al menos un número."),
    confirmPassword: z.string().min(1, "Confirmá la contraseña"),
    phone: z.string().optional(),
    area: z.string().optional(),
    subarea: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const editUserSchema = z.object({
  email: z.string().email("El email no es válido"),
  role: z.string().nonempty("El rol es obligatorio"),
  area: z.string().optional(),
  subarea: z.string().optional(),
});

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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = getAccessToken();

  useEffect(() => {
    if (isEdit && user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "USER",
        phone: user.phone || "",
        area: user.area || "",
        subarea: user.subarea || "",
      });
    } else {
      setForm(initialFormState);
      setPassword("");
      setConfirmPassword("");
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
    try {
      if (!isEdit) {
        // create validation
        const parsed = createUserSchema.safeParse({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password,
          confirmPassword,
          phone: form.phone,
          area: form.area,
          subarea: form.subarea,
        });
        if (!parsed.success) {
          const fieldErrors: Partial<Record<string, string>> = {};
          parsed.error.issues.forEach((issue) => {
            const key = String(issue.path[0] ?? "");
            fieldErrors[key] = issue.message;
          });
          setErrors(fieldErrors);
          return;
        }

        setLoading(true);
        const payload = {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          password: parsed.data.password,
          phone: parsed.data.phone,
          area: parsed.data.area,
          subarea: parsed.data.subarea,
        } as RegisterFormDto;

        console.log("Payload registro:", payload);

        const { success, message } = await registerService(payload);
        setLoading(false);

        if (!success) {
          toast.error(message || "Error al crear el usuario.");
          return;
        }

        onSave({ ...form } as UserFormData, false);
        toast.success("Usuario creado correctamente.");
        setModalOpen(false);
        return;
      }

      const parsedEdit = editUserSchema.safeParse({
        email: form.email,
        role: form.role,
        area: form.area,
        subarea: form.subarea,
      });
      if (!parsedEdit.success) {
        const fieldErrors: Partial<Record<string, string>> = {};
        parsedEdit.error.issues.forEach((issue) => {
          const key = String(issue.path[0] ?? "");
          fieldErrors[key] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setLoading(true);
      const updatePayload: Partial<UserFormData> = {
        email: parsedEdit.data.email,
        role: parsedEdit.data.role,
        area: parsedEdit.data.area,
        subarea: parsedEdit.data.subarea,
      };

      const { success, user: updatedUser, message } = await updateUserByEmail(
        token,
        updatePayload
      );
      setLoading(false);

      if (!success) {
        toast.error(message || "Error al actualizar el usuario.");
        return;
      }
      if (updatedUser) onSave(updatedUser, true);
      toast.success("Usuario actualizado correctamente");
      setModalOpen(false);
    } catch (err) {
      setLoading(false);
      toast.error("Error al procesar la solicitud.");
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
                  disabled={isEdit}
                  onChange={(e) =>
                    handleSelectChange("firstName", e.target.value)
                  }
                  className="w-2/3"
                />
                
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
              <div className="flex">
                <Label htmlFor="lastName" className="w-1/3 text-gray-600">
                  Apellido del usuario*
                </Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  disabled={isEdit}
                  onChange={(e) =>
                    handleSelectChange("lastName", e.target.value)
                  }
                  className="w-2/3"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
              <div className="flex mb-5">
                <Label htmlFor="email" className="w-1/3 text-gray-600">
                  Correo electrónico*
                </Label>
                <Input
                  id="email"
                  value={form.email}
                  disabled={isEdit}
                  readOnly={isEdit}
                  onChange={(e) => handleSelectChange("email", e.target.value)}
                  className="w-2/3"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-0.5">{errors.email}</p>
              )}
              <div className="flex">
                <Label htmlFor="phone" className="w-1/3 text-gray-600">Telefono</Label>
                <Input
                  className="w-2/3"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => handleSelectChange("phone", e.target.value)}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-start text-red-500 mt-0.5">
                  {errors.phone}
                </p>
              )}
              <div className="flex">
                <Label htmlFor="area" className="w-1/3 text-gray-600">
                  Área
                </Label>
                <Input
                  id="area"
                  value={form.area}
                  onChange={(e) => handleSelectChange("area", e.target.value)}
                  className="w-2/3"
                />
              </div>
              {errors.area && (
                  <p className="text-red-500 text-sm">{errors.area}</p>
                )}

              <div className="flex">
                <Label htmlFor="subarea" className="w-1/3 text-gray-600">
                  Subárea
                </Label>
                <Input
                  id="subarea"
                  value={form.subarea}
                  onChange={(e) =>
                    handleSelectChange("subarea", e.target.value)
                  }
                  className="w-2/3"
                />
              </div>
              {errors.subarea && (
                <p className="text-red-500 text-sm">{errors.subarea}</p>
              )}

              {!isEdit && (
                <>
                  <div className="flex">
                    <Label htmlFor="password" className="w-1/3 text-gray-600">
                      Contraseña*
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                        if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }));
                      }}
                      className="w-2/3"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}

                  <div className="flex">
                    <Label htmlFor="confirmPassword" className="w-1/3 text-gray-600">
                      Confirmar contraseña*
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }));
                      }}
                      className="w-2/3"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </>
              )}

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
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
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
