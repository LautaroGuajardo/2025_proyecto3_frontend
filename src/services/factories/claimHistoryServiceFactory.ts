import { claimHistoryServiceMock } from "@/services/mock/claimHistoryServiceMock";
import { claimHistoryServiceReal } from "@/services/claimHistoryService";

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_API === "true";
export const claimHistoryService = USE_MOCK_AUTH ? claimHistoryServiceMock : claimHistoryServiceReal;
