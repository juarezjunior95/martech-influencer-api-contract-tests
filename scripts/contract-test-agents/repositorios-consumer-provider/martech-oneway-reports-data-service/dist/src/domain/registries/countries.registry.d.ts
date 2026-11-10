export interface CountryRecord {
    id: string;
    iso2: string;
    title: string;
    zone: string;
    flag_icon: string;
    quick_filter_label: string;
    match_names: string[];
}
export type CountriesRegistry = Record<string, CountryRecord>;
export declare const countriesRegistry: CountriesRegistry;
