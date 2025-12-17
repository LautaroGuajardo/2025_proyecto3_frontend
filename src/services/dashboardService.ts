// Dashboard service: uses base URL env directly

export type DashboardFilters = {
  fromDate?: string;
  toDate?: string;
  projectIds?: string[];
  projectType?: string;
  areaId?: string;
  subareaId?: string;
  responsibleUserId?: string;
  claimType?: string;
  status?: string;
  customerId?: string;
  projectId?: string;
  search?: string;
};

export type DashboardResponse = {
  claimsPerMonth: { month: string; count: number }[];
  statusCounts: { pending: number; inProgress: number; resolved: number };
  avgResolutionByType: { claimType: string; avgDays: number; count: number }[];
  workloadByArea: { areaId: string; areaName: string; count: number }[];
  workloadByResponsible: { userId: string; count: number }[];
  commonClaimTypes: { claimType: string; count: number }[];
};

export async function getDashboardReports(token: string, filters: DashboardFilters): Promise<{ success: boolean; data?: DashboardResponse; message?: string }> {
  try {
    const params = new URLSearchParams();
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);
    if (filters.projectType) params.set("projectType", filters.projectType);
    if (filters.areaId) params.set("areaId", filters.areaId);
    if (filters.subareaId) params.set("subareaId", filters.subareaId);
    if (filters.responsibleUserId) params.set("responsibleUserId", filters.responsibleUserId);
    if (filters.claimType) params.set("claimType", filters.claimType);
    if (filters.status) params.set("status", filters.status);
    if (filters.customerId) params.set("customerId", filters.customerId);
    if (filters.projectId) params.set("projectId", filters.projectId);
    if (filters.search) params.set("search", filters.search);
    if (filters.projectIds && filters.projectIds.length) {
      filters.projectIds.forEach((id) => params.append("projectIds", id));
    }

    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const res = await fetch(`${base}/dashboard/reports?${params.toString()}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data: DashboardResponse = await res.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Error desconocido" };
  }
}
