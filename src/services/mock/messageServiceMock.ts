import type { CreateMessage, Message } from "@/types/Message";
import type { IMessageService } from "../interfaces/IMessageService";

export const MESSAGES: Message[] = [
  {
    _id: "1",
    claim: "1",
    user: { _id: "mockUserId1", firstName: "Juan", lastName: "Perez" },
    content: "Hola, necesito ayuda con mi reclamo.",
    createdAt: new Date(),
    state: "PUBLICO",
  },
  {
    _id: "2",
    claim: "1",
    user: { _id: "mockUserId2", firstName: "Soporte", lastName: "Tecnico" },
    content: "Hola Juan, ¿en qué podemos ayudarte?",
    createdAt: new Date(),
    state: "PRIVADO",
  },
];

class MessageServiceMock implements IMessageService {
  async sendMessage(
    token: string,
    message: CreateMessage,
  ): Promise<{ success: boolean; message?: string }> {
    const newId = (MESSAGES.length + 1).toString();
    MESSAGES.push({
      _id: newId,
      claim: message.claimId,
      content: message.content,
      createdAt: new Date(),
      state: message.state,
      user: { _id: "mockUserId", firstName: "Mock", lastName: "User" },
    });
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
      mensajes: MESSAGES.filter(msg => msg.claim === claimId),
    };
  }
}

export const messageServiceMock = new MessageServiceMock();