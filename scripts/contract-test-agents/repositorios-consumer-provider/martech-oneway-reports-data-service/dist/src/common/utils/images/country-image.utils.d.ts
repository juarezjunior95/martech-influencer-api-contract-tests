import { CountryImageFormat } from "./country-image-paths.constants";
export interface CountryImageParams {
    format?: CountryImageFormat;
}
export declare function normalizeCountryName(value: string): string;
export declare function getCountryFlag(value: string | number, params?: CountryImageParams): string;
