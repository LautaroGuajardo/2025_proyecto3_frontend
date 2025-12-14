export interface Message {
  _id?: string;
  claimId: string;
  name?: string;
  lastname?: string;
  content: string;
  timestamp?: Date;
  state: "PRIVADO" | "PUBLICO"; //Publico para customer. Privado para empleados
}