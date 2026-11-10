import { Injectable, Inject, Logger, Scope } from "@nestjs/common";
import { IUserRepository } from "@domain/repositories/user.repository.interface";
import { UserEntity } from "@domain/entities/user.entity";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";
import { jwtDecode } from "jwt-decode";

/**
 * Current User Repository Implementation
 * Extracts and caches current user information from JWT token in request context
 * Singleton per request scope - caches user for the entire request lifecycle
 */
@Injectable({ scope: Scope.REQUEST })
export class CurrentUserRepository implements IUserRepository {
  private readonly logger = new Logger(CurrentUserRepository.name);
  private currentUser: UserEntity | null | undefined = undefined; // undefined = not yet loaded

  constructor(
    @Inject("IHeaderContextService")
    private readonly headerContextService: IHeaderContextService,
  ) {}

  /**
   * @inheritDoc
   * Returns cached user if already loaded, otherwise extracts from JWT and caches it
   */
  async getCurrentUser(): Promise<UserEntity | null> {
    // Return cached user if already loaded
    if (this.currentUser !== undefined) {
      return this.currentUser;
    }

    try {
      const user = this.extractUserFromToken();
      this.currentUser = user;
      return user;
    } catch (error) {
      this.logger.error(`Error getting current user: ${error.message}`);
      this.currentUser = null;
      return null;
    }
  }

  /**
   * Extracts user entity from JWT token
   * @returns UserEntity or null if token is invalid or missing
   */
  private extractUserFromToken(): UserEntity | null {
    const token = this.getAuthorizationToken();
    if (!token) {
      return null;
    }

    const decoded = this.decodeJwtToken(token);
    if (!decoded) {
      return null;
    }

    const scopes = this.extractScopes(decoded);
    const country = this.extractCountry(decoded);
    const supportedCountries = this.extractSupportedCountries(decoded);

    return UserEntity.create({
      scopes,
      country,
      supportedCountries,
    });
  }

  /**
   * Gets authorization token from header context
   * @returns Token string or null if not found
   */
  private getAuthorizationToken(): string | null {
    const headerContext = this.headerContextService.getHeaderContext();
    return headerContext?.authorization || null;
  }

  /**
   * Decodes JWT token without verification
   * @param token - JWT token string (with or without "Bearer " prefix)
   * @returns Decoded token payload or null if invalid
   */
  private decodeJwtToken(token: string): any | null {
    try {
      // Remove "Bearer " prefix if present
      const cleanToken = token.replace(/^Bearer\s+/i, "");

      // Decode without verification (Istio/API Gateway handles verification)
      const decoded = jwtDecode(cleanToken);

      if (!decoded || typeof decoded !== "object") {
        this.logger.warn("Invalid JWT token format");
        return null;
      }

      return decoded;
    } catch (error) {
      this.logger.error(`Error decoding JWT token: ${error.message}`);
      return null;
    }
  }

  /**
   * Extracts and normalizes scopes from JWT payload
   * @param decoded - Decoded JWT payload
   * @returns Array of scopes
   */
  private extractScopes(decoded: any): string[] {
    const scopes = decoded.scopes || [];
    return this.normalizeScopes(scopes);
  }

  /**
   * Normalizes scopes to ensure it's an array
   * @param scopes - Scopes value from JWT (can be array or single value)
   * @returns Array of scopes
   */
  private normalizeScopes(scopes: any): string[] {
    if (Array.isArray(scopes)) {
      return scopes.filter(Boolean);
    }
    return scopes ? [scopes].filter(Boolean) : [];
  }

  /**
   * Extracts country from JWT payload or header context
   * @param decoded - Decoded JWT payload
   * @returns Country code or empty string
   */
  private extractCountry(decoded: any): string {
    const headerContext = this.headerContextService.getHeaderContext();
    return decoded.country || headerContext?.country || "";
  }

  private extractSupportedCountries(decoded: any): string[] {
    const supportedCountries = decoded.supportedCountries || [];
    return supportedCountries;
  }
}
