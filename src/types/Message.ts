import type { UserMessage } from "./User";

export interface Message {
  _id?: string;
  claim: string;
  user: UserMessage;
  content: string;
  createdAt?: Date | string;
  state: "PRIVADO" | "PUBLICO"; //Publico para customer. Privado para empleados
}

export interface CreateMessage {
  claimId: string;
  content: string;
  state: "PRIVADO" | "PUBLICO";
}