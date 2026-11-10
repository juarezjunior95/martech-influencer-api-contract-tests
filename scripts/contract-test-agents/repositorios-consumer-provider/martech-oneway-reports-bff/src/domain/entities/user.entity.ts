/**
 * User entity representing the current authenticated user
 */
export interface User {
  scopes: string[];
  country: string;
  supportedCountries: string[];
}

/**
 * User Entity class with domain logic
 */
export class UserEntity {
  readonly scopes: string[];
  readonly country: string;
  readonly supportedCountries: string[];

  private constructor(
    scopes: string[],
    country: string,
    supportedCountries: string[],
  ) {
    this.scopes = scopes;
    this.country = country;
    this.supportedCountries = supportedCountries;
  }

  /**
   * Creates a new UserEntity instance
   * @param props - User properties
   * @returns New UserEntity instance
   */
  static create(props: User): UserEntity {
    return new UserEntity(
      props.scopes,
      props.country,
      props.supportedCountries,
    );
  }

  /**
   * Gets OneWayReports scopes filtered from all scopes
   * @param sorted - If true, returns scopes sorted alphabetically (case-insensitive)
   * @returns Array of OneWayReports scopes, optionally sorted
   */
  getScopes(sorted?: boolean): string[] {
    const filtered = this.scopes.filter((scope) =>
      scope.startsWith("OneWayReports."),
    );

    if (!sorted) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      return aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
    });
  }
}
