export interface CountryRecord {
    id: string;
    zone: string;
}
export declare const ABI_GLOBAL_ID = "ABI";
export declare const countriesRegistry: Record<string, CountryRecord>;
export declare const countries: {
    readonly [id: string]: CountryRecord;
};
