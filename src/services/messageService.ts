import { apiEndpoints } from "@/api/endpoints";
import type { Message } from "../types/Message";
import type { IMessageService } from "./interfaces/IMessageService";

class MessageServiceReal implements IMessageService {
  async sendMessage(
    token: string,
    message: Message,
  ): Promise<{ success: boolean; message: Message }> {
    try {
      const response = await fetch(apiEndpoints.messages.SEND_MESSAGE(message.claimId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }

      const savedMessage: Message = await response.json();
      return { success: true, message: savedMessage };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al enviar el mensaje",
      };
    }
  }

  async getMessagesByClaimId(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message: Message[] }> {
    try {
      const response = await fetch(
        apiEndpoints.messages.GET_MESSAGES_BY_CLAIM_ID(claimId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            },
            }
        );
        if (!response.ok) {
            throw new Error("Error al obtener los mensajes");
        }

      const messages: Message[] = await response.json();
      return { success: true, message: messages };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al obtener los mensajes",
      };
    }
  }
}

export const messageServiceReal = new MessageServiceReal();