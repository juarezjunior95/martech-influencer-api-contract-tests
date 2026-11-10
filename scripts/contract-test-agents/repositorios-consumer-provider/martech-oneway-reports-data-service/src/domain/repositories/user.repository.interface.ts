import { UserEntity } from "@domain/entities/user.entity";

/**
 * Abstraction for retrieving the user attached to the current request.
 * Returns null when no valid user could be resolved (missing/invalid JWT).
 */
export interface IUserRepository {
  getCurrentUser(): Promise<UserEntity | null>;
}
