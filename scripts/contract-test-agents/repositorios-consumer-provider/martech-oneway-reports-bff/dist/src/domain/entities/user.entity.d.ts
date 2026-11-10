export interface User {
    scopes: string[];
    country: string;
    supportedCountries: string[];
}
export declare class UserEntity {
    readonly scopes: string[];
    readonly country: string;
    readonly supportedCountries: string[];
    private constructor();
    static create(props: User): UserEntity;
    getScopes(sorted?: boolean): string[];
}
