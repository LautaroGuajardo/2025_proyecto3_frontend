import { subareaServiceMock } from "@/services/mock/subareaServiceMock";
import { subareaServiceReal } from "@/services/subareaService";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const subareaService = USE_MOCK_API ? subareaServiceMock : subareaServiceReal;
