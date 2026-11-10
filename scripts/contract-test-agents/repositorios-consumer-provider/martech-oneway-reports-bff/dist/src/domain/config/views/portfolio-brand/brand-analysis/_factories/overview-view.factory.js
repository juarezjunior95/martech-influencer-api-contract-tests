"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBrandAnalysisOverviewView = void 0;
const ALL_BRAND_FILTERS = [
    { name: "brand", defaultValue: "All" },
    { name: "sub_brand", defaultValue: "All" },
];
const DATASOURCE_NAMES = [
    "portfolio-brand_brand-analysis_total-per-month-quarter-all-st",
    "portfolio-brand_brand-analysis_total-per-year-all-st",
    "portfolio-brand_brand-analysis_total-per-year-full-all-st",
    "portfolio-brand_brand-analysis_tooltip-st",
];
const createBrandAnalysisOverviewView = ({ id, formatter, }) => ({
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["default"],
    },
    filters: {
        default: [
            { name: "country" },
            { name: "zone" },
            { name: "brand" },
            { name: "sub_brand" },
            { name: "dt_end" },
        ],
    },
    components: [
        {
            id,
            formatter,
            datasources: DATASOURCE_NAMES.map((name) => ({
                name,
                filters: ALL_BRAND_FILTERS,
            })),
        },
    ],
});
exports.createBrandAnalysisOverviewView = createBrandAnalysisOverviewView;
//# sourceMappingURL=overview-view.factory.js.map