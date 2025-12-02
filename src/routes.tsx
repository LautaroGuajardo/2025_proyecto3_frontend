import { lazy } from "react";

import {
  User
} from "lucide-react";
import { Role } from "./types/Role";

export type RouteItem = {
  label: string;
  to: string;
  icon: React.ElementType;
  element?: React.ReactNode;
  hiddenOnSidebar?: boolean;
};

const Login = lazy(() => import("@/pages/public/Login"));
const Register = lazy(() => import("@/pages/public/Register"));

export const publicRoutes: RouteItem[] = [
  {
    label: "Login",
    to: "/login",
    icon: User,
    element: <Login />,
  },
  {
    label: "Registro",
    to: "/register",
    icon: User,
    element: <Register />,
  },
]

export function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => route.to === path);
}

export const roleBasedRoutes: Record<Role, RouteItem[]> = {
  [Role.ADMIN]: [],
  [Role.USER]: [],
  [Role.CUSTOMER]: [],
}


export function getSidebarRoutesForRole(role: Role): RouteItem[] {
  const routes = roleBasedRoutes[role] || [];
  return routes.filter((item) => !item.hiddenOnSidebar);
}

export function getProtectedRoutesForRole(role: Role): RouteItem[] {
  return roleBasedRoutes[role];
}

export function getPublicRoutes(): RouteItem[] {
  return publicRoutes;
}