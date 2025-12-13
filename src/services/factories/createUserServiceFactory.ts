import { createUserServiceMock } from "@/services/mock/createUserServiceMock";
import { createUserServiceReal } from "@/services/createUserService";

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_API === "true";
export const createUserService = USE_MOCK_AUTH ? createUserServiceMock : createUserServiceReal;
