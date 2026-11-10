import type { ValueCreationGrowthLeverOption } from "@domain/config/presets/value-creation/value-creation.types";
export declare const VALUE_CREATION_SUPERIOR_CORE = "Superior Core";
export declare const VALUE_CREATION_LEAD_PREMIUN = "Lead Premium";
export declare const VALUE_CREATION_BALANCED_CHOICES = "Balanced Choices";
export declare const VALUE_CREATION_BEYOND_BEER = "Beyond Beer";
export declare const VALUE_CREATION_GROWTH_LEVERS_TEMPLATE: ValueCreationGrowthLeverOption[];
export declare const VALUE_CREATION_GEO_EUR = "EUR";
export declare const VALUE_CREATION_GEO_ABI = "ABI";
export declare const VALUE_CREATION_GEO_MAPPING: Record<string, Record<string, {
    label: string;
    quick_filter_label: string;
    zone: string;
    value: string;
    growth_levers: ValueCreationGrowthLeverOption[];
}>>;
export declare function cloneGrowthLeverTemplate(): ValueCreationGrowthLeverOption[];
