import type { CommercialResultsOption, CommercialResultsPeriodOption } from "./commercial-results.types";
export declare const COMMERCIAL_RESULTS_KPI_OPTIONS: readonly [{
    readonly value: "volume";
    readonly label: "Volume";
}, {
    readonly value: "nr";
    readonly label: "Net Revenue";
}];
export declare const COMMERCIAL_RESULTS_DEFAULT_KPI: {
    readonly value: "volume";
    readonly label: "Volume";
};
export declare const COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS: {
    readonly volume: "sku_pnl";
    readonly nr: "sku_pnl_nr";
};
export declare const PERIOD_ORDER: readonly ["YTD", "L3M", "MTD"];
export declare const PERIOD_NORMALIZATION: Record<string, string>;
export declare const STATIC_PERIOD_OPTIONS: CommercialResultsPeriodOption[];
export declare const FILTER_PLACEHOLDER_VALUE = "All";
export declare const GROWTH_LEVERS_ALLOWED: readonly ["Balanced Choices", "Beyond Beer", "Lead Premium", "Superior Core"];
export declare const BEER_PRICE_SEGMENT_ALLOWED: readonly ["Super Premium", "Premium", "Core+", "Core", "Value"];
export declare const PORTFOLIOS_ALLOWED: readonly ["Megabrands", "Expansion", "Sustain", "Tail"];
export declare const GROWTH_LEVERS_ALLOWED_SET: Set<string>;
export declare const BEER_PRICE_SEGMENT_ALLOWED_SET: Set<string>;
export declare const PORTFOLIOS_ALLOWED_SET: Set<string>;
export declare const FILTER_PLACEHOLDERS: {
    readonly region: CommercialResultsOption;
    readonly brand: CommercialResultsOption;
    readonly subBrand: CommercialResultsOption;
    readonly subBrandNoBrand: CommercialResultsOption;
    readonly sku: CommercialResultsOption;
    readonly skuNoBrand: CommercialResultsOption;
    readonly channel: CommercialResultsOption;
    readonly packType: CommercialResultsOption;
    readonly category: CommercialResultsOption;
    readonly nonAlcoholic: CommercialResultsOption;
    readonly growthLevers: CommercialResultsOption;
    readonly beerPriceSegment: CommercialResultsOption;
    readonly portfolios: CommercialResultsOption;
};
export declare const ZONE_AFFINITY_GROUPS: readonly (readonly string[])[];
