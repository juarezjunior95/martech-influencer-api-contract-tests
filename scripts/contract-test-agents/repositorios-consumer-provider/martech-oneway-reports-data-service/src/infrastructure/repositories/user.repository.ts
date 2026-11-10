import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { jwtDecode } from "jwt-decode";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";
import { UserEntity } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/repositories/user.repository.interface";
import { mockUser } from "@infrastructure/repositories/__mocks__/mock-user.dev";

interface JwtPayload {
  scopes?: string[] | string;
  country?: string;
  supportedCountries?: string[];
  [key: string]: unknown;
}

/**
 * Request-scoped user repository.
 *
 * Decodes the JWT forwarded by the API gateway from the `Authorization`
 * header (already verified upstream) and exposes a UserEntity for use by
 * the preset pipeline. Missing or invalid tokens resolve to `null`,
 * which the PresetEntity treats as "no filtering" for backward
 * compatibility (RFC-003 §4.8).
 */
@Injectable({ scope: Scope.REQUEST })
export class CurrentUserRepository implements IUserRepository {
  private readonly logger = new Logger(CurrentUserRepository.name);
  private currentUser: UserEntity | null | undefined = undefined;

  constructor(
    @Inject("IHeaderContextService")
    private readonly headerContextService: IHeaderContextService,
  ) {}

  async getCurrentUser(): Promise<UserEntity | null> {
    if (this.currentUser !== undefined) {
      return this.currentUser;
    }

    try {
      this.currentUser = this.resolveMockUser() ?? this.extractUserFromToken();
    } catch (error) {
      this.logger.error(`Error resolving current user: ${error.message}`);
      this.currentUser = null;
    }

    return this.currentUser;
  }

  /**
   * Dev-only override hook. Returns a UserEntity built from
   * `mock-user.dev.ts` when BOTH guards are satisfied:
   *   - `NODE_ENV === "development"`, AND
   *   - `MOCK_USER_OVERRIDE === "true"`.
   *
   * The two runtime guards are the security boundary; the static
   * import at the top of this file is harmless because the mock
   * payload is only ever consumed inside this function.
   */
  private resolveMockUser(): UserEntity | null {
    if (process.env.NODE_ENV !== "development") {
      return null;
    }
    if (process.env.MOCK_USER_OVERRIDE !== "true") {
      return null;
    }

    this.logger.warn(
      `MOCK USER ACTIVE — overriding JWT (scopes=[${mockUser.scopes.join(", ")}], supportedCountries=[${mockUser.supportedCountries.join(", ")}])`,
    );
    return UserEntity.create({
      scopes: [...mockUser.scopes],
      country: mockUser.country ?? null,
      supportedCountries: [...mockUser.supportedCountries],
    });
  }

  private extractUserFromToken(): UserEntity | null {
    const token = this.headerContextService.getHeaderContext()?.authorization;
    if (!token) {
      return null;
    }

    const decoded = this.decodeJwt(token);
    if (!decoded) {
      return null;
    }

    return UserEntity.create({
      scopes: this.normalizeScopes(decoded.scopes),
      country: decoded.country ?? null,
      supportedCountries: Array.isArray(decoded.supportedCountries)
        ? decoded.supportedCountries
        : [],
    });
  }

  private decodeJwt(token: string): JwtPayload | null {
    try {
      const cleanToken = token.replace(/^Bearer\s+/i, "");
      const decoded = jwtDecode<JwtPayload>(cleanToken);

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

  private normalizeScopes(scopes: string[] | string | undefined): string[] {
    if (Array.isArray(scopes)) {
      return scopes.filter(Boolean);
    }
    return scopes ? [scopes].filter(Boolean) : [];
  }
}
