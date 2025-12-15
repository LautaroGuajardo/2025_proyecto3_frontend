import { apiEndpoints } from "@/api/endpoints";
import type { Claim, CreateClaim, UpdateClaim } from "@/types/Claim";
import type { IClaimService } from "@/services/interfaces/IClaimService";

class ClaimServiceReal implements IClaimService {
  async getAllClaims(
    token: string
  ): Promise<{ success: boolean; message?: string; claims?: Claim[] }> {
    try {
      const response = await fetch(apiEndpoints.claims.GET_ALL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los reclamos");
      }
      const claims: Claim[] = await response.json();
      return {
        success: true,
        claims: claims,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener los reclamos",
      };
    }
  }

  async createClaim(
    token: string,
    claim: CreateClaim
  ): Promise<{ success: boolean; message?: string; claim?: Claim }> {
    try {
      const response = await fetch(apiEndpoints.claims.CREATE_CLAIM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(claim),
      });
      if (!response.ok) {
        throw new Error("Error al crear el reclamo");
      }
      const createdClaim: Claim = await response.json();
      return {
        success: true,
        claim: createdClaim,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al crear el reclamo",
      };
    }
  }

  async updateClaimById(
    token: string,
    claim: UpdateClaim
  ): Promise<{ success: boolean; message?: string; claim?: Claim }> {
    try {
      const response = await fetch(
        apiEndpoints.claims.UPDATE_CLAIM_BY_ID(claim._id?.toString() || ""),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(claim),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el reclamo");
      }
      const updatedClaim: Claim = await response.json();
      return {
        success: true,
        claim: updatedClaim,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al actualizar el reclamo",
      };
    }
  }
}

export const claimServiceReal = new ClaimServiceReal();