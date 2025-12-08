import { projectServiceMock } from "@/services/mock/projectServiceMock";
import { projectServiceReal } from "@/services/projectService";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const projectService = USE_MOCK_API ? projectServiceMock : projectServiceReal;
