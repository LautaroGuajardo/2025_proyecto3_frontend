import type { Message } from "@/types/Message";

export interface IMessageService {
  sendMessage(
    token: string,
    message: Message,
  ): Promise<{ success: boolean; message: Message }>;

  getMessagesByClaimId(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message: Message[] }>;
}