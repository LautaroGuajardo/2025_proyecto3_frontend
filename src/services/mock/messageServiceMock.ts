import type { Message } from "@/types/Message";
import type { IMessageService } from "../interfaces/IMessageService";

export const MESSAGES: Message[] = [
  {
    id: "1",
    claimId: "1",
    name: "Juan",
    lastname: "Perez",
    content: "Hola, necesito ayuda con mi reclamo.",
    timestamp: new Date(),
    state: "PUBLICO",
  },
  {
    id: "2",
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
  ): Promise<{ success: boolean; message: Message }> {
    MESSAGES.push({...message, id: (MESSAGES.length + 1).toString() });
    return {
      success: true,
      message: {
        ...message,
        id: "mocked-message-id",
        timestamp: new Date(),
      },
    };
  }
 
  async getMessagesByClaimId(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message: Message[] }> {
    return {
      success: true,
      message: MESSAGES.filter(msg => msg.claimId === claimId),
    };
  }
}

export const messageServiceMock = new MessageServiceMock();