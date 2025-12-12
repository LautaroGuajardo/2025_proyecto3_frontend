import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import { messageService } from "@/services/factories/messageServiceFactory";
import type { Message } from "@/types/Message";
import { Role } from "@/types/Role";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  claimId: string | null;
};

export default function MessageModal({ open, onOpenChange, claimId }: Props) {
  const { getAccessToken, role, name, lastname, logout } = useAuth();
  const token = getAccessToken();

  const isCustomer = role === Role.CUSTOMER;

  const [messages, setMessages] = useState<Message[]>([]);
  const [stateFilter, setStateFilter] = useState<string>(isCustomer ? "PUBLICO" : "PUBLICO");
  const [content, setContent] = useState("");
  const [sendState, setSendState] = useState<string>(isCustomer ? "PUBLICO" : "PUBLICO");
  const [loading, setLoading] = useState(false);

  const loadMessages = async () => {
    if (!token) {
      toast.error("Por favor inicia sesión para ver mensajes");
      logout();
      return;
    }
    if (!claimId) return;
    const { success, message } = await messageService.getMessagesByClaimId(token, claimId);
    if (!success) {
      toast.error(String(message) || "Error al obtener mensajes");
      return;
    }
    setMessages(message);
  };

  useEffect(() => {
    if (open) {
      void loadMessages();
      setContent("");
      setSendState(isCustomer ? "PUBLICO" : "PUBLICO");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, claimId]);

  const filtered = useMemo(() => {
    return messages.filter((m) => (isCustomer ? m.state === "PUBLICO" : (stateFilter ? m.state === stateFilter : true)) && (!claimId || m.claimId === claimId));
  }, [messages, stateFilter, isCustomer, claimId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Por favor inicia sesión");
      logout();
      return;
    }
    if (!claimId) {
      toast.error("No hay reclamo seleccionado");
      return;
    }
    if (!content.trim()) {
      toast.error("El mensaje no puede estar vacío");
      return;
    }
    setLoading(true);
    const payload: Message = {
      id: "", // lo asigna el backend
      claimId,
      name,
      lastname,
      content: content.trim(),
      timestamp: new Date(),
      state: (isCustomer ? "PUBLICO" : (sendState)) as "PUBLICO" | "PRIVADO",
    };
    const { success, message } = await messageService.sendMessage(token, payload);
    setLoading(false);
    if (!success) {
      toast.error(String(message) || "Error al enviar mensaje");
      return;
    }
    toast.success("Mensaje enviado");
    setContent("");
    await loadMessages();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <MessageSquare className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-gray-800 text-lg font-semibold">Mensajes del reclamo</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Envía y consulta mensajes asociados al reclamo.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Filtro de estado (solo empleados) */}
        {!isCustomer && (
          <div className="flex w-full mb-4">
            <Label className="text-nowrap text-gray-500 w-1/4">Ver mensajes</Label>
            <Select value={stateFilter} onValueChange={(v) => setStateFilter(v)}>
              <SelectTrigger className="w-3/4">
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLICO">Públicos</SelectItem>
                <SelectItem value="PRIVADO">Privados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Lista de mensajes */}
        <div className="space-y-3 mb-6">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay mensajes.</p>
          ) : (
            filtered.map((m) => (
              <div key={m.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{m.name} {m.lastname}</div>
                  <div className="text-xs text-muted-foreground">{new Date(m.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-sm mt-1">{m.content}</div>
                <div className="text-xs mt-1 text-blue-600">{m.state}</div>
              </div>
            ))
          )}
        </div>

        {/* Formulario de envío */}
        <form onSubmit={handleSend}>
          <div className="space-y-4">
            {!isCustomer && (
              <div className="flex w-full">
                <Label className="text-nowrap text-gray-500 w-1/4">Estado</Label>
                <Select value={sendState} onValueChange={(v) => setSendState(v)}>
                  <SelectTrigger className="w-3/4">
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLICO">Público</SelectItem>
                    <SelectItem value="PRIVADO">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex w-full">
              <Label className="text-nowrap text-gray-500 w-1/4">Mensaje</Label>
              <Input
                required
                id="message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu mensaje"
                className="w-3/4"
              />
            </div>

            <div className="flex w-full items-center gap-3 mt-4">
              <Button type="button" variant="outline" className="w-1/2" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="w-1/2" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}