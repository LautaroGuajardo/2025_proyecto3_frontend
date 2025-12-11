import { apiEndpoints } from "@/api/endpoints";
import type { Claim } from "@/types/Claim";
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

  async getClaimById(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string; claim?: Claim }> {
    try {
      const response = await fetch(
        apiEndpoints.claims.GET_CLAIM_BY_ID(claimId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener el reclamo");
      }
      const claim: Claim = await response.json();
      return {
        success: true,
        claim: claim,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener el reclamo",
      };
    }
  }

  async createClaim(
    token: string,
    claim: Partial<Claim>
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
    claimId: string,
    claim: Partial<Claim>
  ): Promise<{ success: boolean; message?: string; claim?: Claim }> {
    try {
      const response = await fetch(
        apiEndpoints.claims.UPDATE_CLAIM_BY_ID(claimId),
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

  async deleteClaimById(
    token: string,
    claimId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        apiEndpoints.claims.DELETE_CLAIM_BY_ID(claimId),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el reclamo");
      }
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al eliminar el reclamo",
      };
    }
  }
}

export const claimServiceReal = new ClaimServiceReal();