import type { Claim, CreateClaim, UpdateClaim } from "@/types/Claim";

export interface IClaimService {
  getAllClaims(
    token: string
  ): Promise<{ success: boolean; message?: string; claims?: Claim[] }>;
  createClaim(
    token: string,
    claim: CreateClaim
  ): Promise<{ success: boolean; message?: string; claim?: Claim }>;
  updateClaimById(
    token: string,
    claim: UpdateClaim
  ): Promise<{ success: boolean; message?: string; claim?: Claim }>;
}