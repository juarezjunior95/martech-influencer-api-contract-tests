export type KpiField = "dt_ini" | "dt_end" | "version_id" | "kpi_name" | "abi_zone" | "country_iso_code_3" | "image_key" | "raw_geography" | "raw_brand" | "price_tier" | "segment" | "maturity" | "level_1" | "level_2" | "level_3" | "level_4" | "unit_of_measure" | "comp_unit_of_measure" | "ac" | "bu" | "ly" | "og_ly" | "og_bu" | "ac_vs_ly" | "ac_vs_bu" | "bu_vs_ly" | "le" | "le_ly" | "le_vs_ly" | "le_vs_bu" | "value" | "mix" | "per_hl_vs_ly";
export type KpiComputedField = "comp_direction" | "date_refresh" | "vs_ly_label" | "vs_ly_label_suffix";
export interface KpiEntityOptions {
    variationPositiveZero?: boolean;
}
export declare class KpiEntity {
    [key: KpiField | KpiComputedField | string]: string | number | object | boolean;
    constructor(init?: Partial<Record<KpiField | string, any>>, options?: KpiEntityOptions);
}
export declare class KpiEntityNegativeZero extends KpiEntity {
    constructor(init?: Partial<Record<KpiField | string, any>>);
}
