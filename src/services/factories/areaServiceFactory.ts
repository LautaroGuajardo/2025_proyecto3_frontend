import { areaServiceMock } from "@/services/mock/areaServiceMock";
import { areaServiceReal } from "@/services/areaService";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const areaService = USE_MOCK_API ? areaServiceMock : areaServiceReal;
