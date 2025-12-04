export const API_ENDPOINTS = {
  auth: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: (email: string, tokenPass: string) =>
      `/auth/reset-password?email=${encodeURIComponent(
        email
      )}&tokenPass=${encodeURIComponent(tokenPass)}`,
    LOGOUT: "/auth/logout",
    VERIFY_ACCOUNT: "/auth/verify-account",
    RESEND_VERIFICATION: "/auth/resend-verification",
    CHANGE_DATA: "/auth/change-data",
    REGENERATE_OTP: (email: string) =>
      `/auth/regenerate-otp?email=${encodeURIComponent(email)}`,
    VALIDATE_TOKEN: "/auth/validate-token",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  projects: {
    GET_ALL: "/projects",
    GET_PROJECTS_BY_USER_ID: (userId: string) => `/projects/user/${userId}`,
    GET_PROJECT: (id: string) => `/projects/${id}`,
    CREATE_PROJECT: "/projects",
    UPDATE_PROJECT: (id: string) => `/projects/${id}`,
    DELETE_PROJECT: (id: string) => `/projects/${id}`,
  },

  projectTypes: {
    GET_ALL: "/project-types",
  },

  claimStates: {
    GET_ALL: "/claim-states",
  },

  claimTypes: {
    GET_ALL: "/claim-types",
  },

  criticalities: {
    GET_ALL: "/criticalities",
  },

  priorities: {
    GET_ALL: "/priorities",
  },

  areas: {
    GET_ALL: "/areas",
  },

  subareas: {
    GET_ALL: "/sub-areas",
  },

  claims: {
    GET_ALL: "/claims",
    GET_CLAIM_BY_ID: (id: string) => `/claims/${id}`,
    CREATE_CLAIM: "/claims",
    UPDATE_CLAIM_BY_ID: (id: string) => `/claims/${id}`,
    DELETE_CLAIM_BY_ID: (id: string) => `/claims/${id}`,
  },

  users: {
    GET_ALL: "/users",
    GET_PROFILE: "/usuarios/profile",
    GET_USER_BY_EMAIL: (email: string) =>
      `/users/${encodeURIComponent(email)}`,
    UPDATE_USER_PROFILE: `/users/profile`,
    UPDATE_USER_BY_EMAIL: (email: string) =>
      `/users/${encodeURIComponent(email)}`,
    DELETE_USER_BY_EMAIL: (email: string) => `/users/${email}`,
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: (email: string) => `/users/${email}/change-password`,
  },
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

type EndpointFn<Args extends unknown[] = unknown[]> = (...args: Args) => string;

type EndpointValue =
  | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | EndpointFn<any>
  | EndpointsObject;

type EndpointsObject = { [key: string]: EndpointValue };

function wrapEndpoints<T extends EndpointsObject>(obj: T): {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends EndpointFn<infer A>
    ? (...args: A) => string
    : T[K] extends EndpointsObject
    ? ReturnType<typeof wrapEndpoints<T[K]>>
    : never;
} {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value === "string") {
        return `${API_BASE_URL}${value}`;
      }

      if (typeof value === "function") {
        return (...args: unknown[]) => `${API_BASE_URL}${value(...args)}`;
      }

      if (typeof value === "object" && value !== null) {
        return wrapEndpoints(value);
      }

      return value;
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any; 
}

export const apiEndpoints = wrapEndpoints(API_ENDPOINTS);
