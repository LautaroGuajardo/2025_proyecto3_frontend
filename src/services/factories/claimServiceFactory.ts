import { claimServiceMock } from "@/services/mock/claimServiceMock";
import { claimServiceReal } from "@/services/claimService";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const claimService = USE_MOCK_API ? claimServiceMock : claimServiceReal;
