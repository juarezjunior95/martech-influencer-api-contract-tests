export interface AudienceTargetingCompetitor {
    value: string;
    label: string;
    is_sub_brand?: boolean;
    image_url: string;
    image_variants: Record<string, string>;
}
export type AudienceTargetingCompetitorDef = {
    value: string;
    label: string;
    is_sub_brand?: boolean;
};
export interface AudienceTargetingBrandRow {
    value: string;
    label: string;
    is_sub_brand: boolean;
    competitor: AudienceTargetingCompetitor[];
    image_url: string;
    image_variants: Record<string, string>;
}
export type AudienceTargetingBrandDef = {
    value: string;
    label: string;
    is_sub_brand: boolean;
    competitor: AudienceTargetingCompetitorDef[];
};
export type AudienceTargetingBrandsByCountry = Record<string, AudienceTargetingBrandRow[]>;
export type AudienceTargetingBrandsSource = Record<string, AudienceTargetingBrandDef[]>;
export interface AudienceTargetingBrandsPresetValue {
    enabled: boolean;
    default: AudienceTargetingBrandRow[];
    values: AudienceTargetingBrandsByCountry;
}
