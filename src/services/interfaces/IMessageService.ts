import type { CreateMessage, Message } from "@/types/Message";

export interface IMessageService {
  sendMessage(
    token: string,
    message: CreateMessage,
  ): Promise<{ success: boolean; message?: string }>;

  getMessagesByClaimId(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?:string; mensajes?: Message[] }>;
}