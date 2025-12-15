import type { Message } from "@/types/Message";
import type { IMessageService } from "../interfaces/IMessageService";

export const MESSAGES: Message[] = [
  {
    _id: "1",
    claimId: "1",
    name: "Juan",
    lastname: "Perez",
    content: "Hola, necesito ayuda con mi reclamo.",
    timestamp: new Date(),
    state: "PUBLICO",
  },
  {
    _id: "2",
    claimId: "1",
    name: "Soporte",
    lastname: "Tecnico",
    content: "Hola Juan, ¿en qué podemos ayudarte?",
    timestamp: new Date(),
    state: "PRIVADO",
  },
];

class MessageServiceMock implements IMessageService {
  async sendMessage(
    token: string,
    message: Message,
  ): Promise<{ success: boolean; message: string }> {
    const newId = (MESSAGES.length + 1).toString();
    MESSAGES.push({ ...message, _id: newId });
    void token; // Evitar warning de variable no usada
    return {
      success: true,
      message: newId,
    };
  }

  async getMessagesByClaimId(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string; mensajes?: Message[] }> {
    void token; // Evitar warning de variable no usada
    return {
      success: true,
      mensajes: MESSAGES.filter(msg => msg.claimId === claimId),
    };
  }
}

export const messageServiceMock = new MessageServiceMock();