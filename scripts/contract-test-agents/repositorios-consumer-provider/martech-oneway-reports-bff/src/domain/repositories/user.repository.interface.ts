import { UserEntity } from "@domain/entities/user.entity";

/**
 * User Repository Interface
 * Manages user information access
 */
export interface IUserRepository {
  /**
   * Gets the current authenticated user
   * @returns UserEntity instance or null if not authenticated
   */
  getCurrentUser(): Promise<UserEntity | null>;
}
