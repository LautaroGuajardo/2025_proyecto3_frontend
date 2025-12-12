import { messageServiceMock } from "@/services/mock/messageServiceMock";
import { messageServiceReal } from "@/services/messageService";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const messageService = USE_MOCK_API ? messageServiceMock : messageServiceReal;
