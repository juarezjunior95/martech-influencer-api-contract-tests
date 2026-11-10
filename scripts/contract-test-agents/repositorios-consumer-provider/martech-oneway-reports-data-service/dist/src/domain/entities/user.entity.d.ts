export interface UserEntityProps {
    scopes: string[];
    country: string | null;
    supportedCountries: string[];
}
export type CountryAccessPolicy = {
    mode: "unrestricted";
} | {
    mode: "all";
} | {
    mode: "explicit";
    iso3Set: Set<string>;
} | {
    mode: "deny";
};
export declare class UserEntity {
    readonly scopes: string[];
    readonly country: string | null;
    readonly supportedCountries: string[];
    readonly policy: CountryAccessPolicy;
    private constructor();
    static create(props: UserEntityProps): UserEntity;
    getSupportedCountries(): string[];
    hasCountryAccess(countryId: string): boolean;
}
