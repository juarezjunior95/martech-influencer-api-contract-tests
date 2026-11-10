import jsonata from "jsonata";
type OverviewKpiName = "volume" | "nr" | "cores" | "market_share" | "power";
export declare const MONTHLY_KEY = "portfolio-brand_brand-analysis_total-per-month-quarter-all-st";
export declare const YEARLY_KEY = "portfolio-brand_brand-analysis_total-per-year-all-st";
export declare const YEAR_FULL_KEY = "portfolio-brand_brand-analysis_total-per-year-full-all-st";
export declare const TOOLTIP_KEY = "portfolio-brand_brand-analysis_tooltip-st";
export declare const loadBrandAnalysisFormatter: (formatterPath: string) => jsonata.Expression;
export declare const buildOverviewDatasources: (kpiName: OverviewKpiName, tooltipValue?: number) => {
    "portfolio-brand_brand-analysis_total-per-month-quarter-all-st": {
        kpi_name: string;
        ac: number;
        ly: number;
        ac_vs_ly: number;
        month_ini: number;
        year_ini: number;
        max_year: number;
        dt_end: string;
    }[];
    "portfolio-brand_brand-analysis_total-per-year-all-st": {
        kpi_name: string;
        ac: number;
        ac_vs_ly: number;
        month_ini: number;
        year_ini: number;
        previous_dt_end: string;
        dt_end: string;
    }[];
    "portfolio-brand_brand-analysis_total-per-year-full-all-st": {
        kpi_name: string;
        ac: number;
        ac_vs_ly: number;
        year_ini: number;
        dt_end: string;
    }[];
    "portfolio-brand_brand-analysis_tooltip-st": {
        kpi_name: string;
        ac_vs_ly: number;
    }[];
};
export declare const EMPTY_OVERVIEW_DATASOURCES: {
    "portfolio-brand_brand-analysis_total-per-month-quarter-all-st": any[];
    "portfolio-brand_brand-analysis_total-per-year-all-st": any[];
    "portfolio-brand_brand-analysis_total-per-year-full-all-st": any[];
    "portfolio-brand_brand-analysis_tooltip-st": any[];
};
export interface OverviewSpecConfig {
    describeName: string;
    formatterFile: string;
    kpiName: OverviewKpiName;
    unitOfMeasure: string;
    bigNumber: {
        title: string;
        measure: string;
        expectedDirection: "up" | "down";
        expectedVersus: string;
        expectedTotal: number;
    };
    yearFull: {
        expectedComparison: number;
        sendsTooltip: boolean;
    };
    monthQuarter: {
        type: "bar" | "line";
        labelsType: "months" | "quarters";
        expectedBackgroundColorLength: number;
    };
    expectedRefreshDate: {
        month: string;
        quarter: string;
    };
    rendersDashOnNullComparison: boolean;
}
export declare const runOverviewFormatterSuite: (cfg: OverviewSpecConfig) => void;
export {};
