import { CountryRecord } from "@domain/registries/countries.registry";
export declare const WILDCARD = "*";
export declare function resolveCountries(ids: string[]): CountryRecord[];
export declare function resolveCountryByIso2(iso2: string): CountryRecord | undefined;
export declare function resolveCountriesByZone(zoneId: string): CountryRecord[];
