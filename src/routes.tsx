import { lazy } from "react";

import {
  FolderSymlink,
  User,
  MessageCircleWarning
} from "lucide-react";
import { Role } from "./types/Role";
import Claims from "./pages/private/Claims";
const ClaimHistory = lazy(() => import("@/pages/private/ClaimHistory"));

export type RouteItem = {
  label: string;
  to: string;
  icon: React.ElementType;
  element?: React.ReactNode;
  hiddenOnSidebar?: boolean;
};

const Login = lazy(() => import("@/pages/public/Login"));
const Register = lazy(() => import("@/pages/public/Register"));

const Projects = lazy(() => import("@/pages/private/Projects"));
const Users = lazy(() => import("@/pages/private/Users"));

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
  [Role.CUSTOMER]: [
    {
      label: "Projectos",
      to: "/projects",
      icon: FolderSymlink,
      element: <Projects />,
    },
    {
      label: "Reclamos",
      to: "/claims",
      icon: MessageCircleWarning,
      element: <Claims />,
    },
    {
      label: "Historial Reclamo",
      to: "/claims/:id",
      icon: MessageCircleWarning,
      element: <ClaimHistory />, 
      hiddenOnSidebar: true,
    },
    {
      label: "Usuarios",
      to: "/users",
      icon: User,
      element: <Users />,
    },
  ],
  [Role.ADMIN]: [],
  [Role.USER]: [],  
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