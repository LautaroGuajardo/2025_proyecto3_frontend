import type { Claim } from "@/types/Claim";

export interface IClaimService {
  getAllClaims(
    token: string
  ): Promise<{ success: boolean; message?: string; claims?: Claim[] }>;
  getClaimById(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string; claim?: Claim }>;
  createClaim(
    token: string,
    claim: Partial<Claim>
  ): Promise<{ success: boolean; message?: string; claim?: Claim }>;
  updateClaimById(
    token: string,
    claimId: string,
    claim: Partial<Claim>
  ): Promise<{ success: boolean; message?: string; claim?: Claim }>;
  deleteClaimById(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string }>;
}