"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOverviewFormatterSuite = exports.EMPTY_OVERVIEW_DATASOURCES = exports.buildOverviewDatasources = exports.loadBrandAnalysisFormatter = exports.TOOLTIP_KEY = exports.YEAR_FULL_KEY = exports.YEARLY_KEY = exports.MONTHLY_KEY = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonata_1 = __importDefault(require("jsonata"));
const helpers_1 = require("../../../../../src/infrastructure/repositories/helpers");
const FORMATTERS_PATH = path_1.default.join(process.cwd(), "src/infrastructure/formatters/portfolio-brand/brand-analysis");
exports.MONTHLY_KEY = "portfolio-brand_brand-analysis_total-per-month-quarter-all-st";
exports.YEARLY_KEY = "portfolio-brand_brand-analysis_total-per-year-all-st";
exports.YEAR_FULL_KEY = "portfolio-brand_brand-analysis_total-per-year-full-all-st";
exports.TOOLTIP_KEY = "portfolio-brand_brand-analysis_tooltip-st";
const loadBrandAnalysisFormatter = (formatterPath) => {
    const expression = (0, jsonata_1.default)(fs_1.default.readFileSync(path_1.default.join(FORMATTERS_PATH, formatterPath), "utf8"));
    (0, helpers_1.registerHelpers)(expression);
    return expression;
};
exports.loadBrandAnalysisFormatter = loadBrandAnalysisFormatter;
const buildOverviewDatasources = (kpiName, tooltipValue) => {
    const normalizedKpiName = kpiName.toUpperCase();
    return {
        [exports.MONTHLY_KEY]: [
            {
                kpi_name: normalizedKpiName,
                ac: 100,
                ly: 98,
                ac_vs_ly: 1.2,
                month_ini: 9,
                year_ini: 2024,
                max_year: 2025,
                dt_end: "2024-09-01T00:00:00.000Z",
            },
            {
                kpi_name: normalizedKpiName,
                ac: 110,
                ly: 109,
                ac_vs_ly: -0.4,
                month_ini: 12,
                year_ini: 2025,
                max_year: 2025,
                dt_end: "2025-12-01T00:00:00.000Z",
            },
        ],
        [exports.YEARLY_KEY]: [
            {
                kpi_name: normalizedKpiName,
                ac: 500,
                ac_vs_ly: 2.1,
                month_ini: 12,
                year_ini: 2024,
                previous_dt_end: "2023-12-01",
                dt_end: "2024-12-01",
            },
            {
                kpi_name: normalizedKpiName,
                ac: 520,
                ac_vs_ly: -1.3,
                month_ini: 12,
                year_ini: 2025,
                previous_dt_end: "2024-12-01",
                dt_end: "2025-12-01",
            },
        ],
        [exports.YEAR_FULL_KEY]: [
            {
                kpi_name: normalizedKpiName,
                ac: 700,
                ac_vs_ly: 3.0,
                year_ini: 2024,
                dt_end: "2024-12-01T00:00:00.000Z",
            },
            {
                kpi_name: normalizedKpiName,
                ac: 735,
                ac_vs_ly: 5.0,
                year_ini: 2025,
                dt_end: "2025-12-01T00:00:00.000Z",
            },
        ],
        [exports.TOOLTIP_KEY]: typeof tooltipValue === "number"
            ? [{ kpi_name: normalizedKpiName, ac_vs_ly: tooltipValue }]
            : [],
    };
};
exports.buildOverviewDatasources = buildOverviewDatasources;
exports.EMPTY_OVERVIEW_DATASOURCES = {
    [exports.MONTHLY_KEY]: [],
    [exports.YEARLY_KEY]: [],
    [exports.YEAR_FULL_KEY]: [],
    [exports.TOOLTIP_KEY]: [],
};
const runOverviewFormatterSuite = (cfg) => {
    describe(cfg.describeName, () => {
        const formatter = (0, exports.loadBrandAnalysisFormatter)(cfg.formatterFile);
        const buildBaseDatasources = () => cfg.yearFull.sendsTooltip
            ? (0, exports.buildOverviewDatasources)(cfg.kpiName, cfg.yearFull.expectedComparison)
            : (0, exports.buildOverviewDatasources)(cfg.kpiName);
        it("should format all overview sections when datasource is present", async () => {
            const result = await formatter.evaluate({
                datasources: buildBaseDatasources(),
            });
            expect(result.total_per_year_full.type).toBe("bar");
            expect(result.total_per_year_full.comparison_data.comparison).toBe(cfg.yearFull.expectedComparison);
            expect(result.total_per_year_full.comparison_data.unit_of_measure).toBe(cfg.unitOfMeasure);
        });
        it("should format total_per_month_quarter section with chart legend, refresh date and background", async () => {
            const result = await formatter.evaluate({
                datasources: buildBaseDatasources(),
            });
            expect(result.total_per_month_quarter.type).toBe(cfg.monthQuarter.type);
            expect(result.total_per_month_quarter.labels_type).toBe(cfg.monthQuarter.labelsType);
            expect(result.total_per_month_quarter.refreshDate.month).toBe(cfg.expectedRefreshDate.month);
            expect(result.total_per_month_quarter.refreshDate.quarter).toBe(cfg.expectedRefreshDate.quarter);
            expect(result.total_per_month_quarter.referencialUnitMeasure).toBe(cfg.unitOfMeasure);
            expect(result.total_per_month_quarter.chartLegend).toEqual(expect.arrayContaining([
                expect.objectContaining({ label: "Previous Year" }),
                expect.objectContaining({ label: "Current Year" }),
            ]));
            expect(result.total_per_month_quarter.backgroundColor).toHaveLength(cfg.monthQuarter.expectedBackgroundColorLength);
        });
        it("should format total_per_year big number with title, measure, total, direction and versus", async () => {
            const result = await formatter.evaluate({
                datasources: buildBaseDatasources(),
            });
            expect(result.total_per_year.big_number.title).toBe(cfg.bigNumber.title);
            expect(result.total_per_year.big_number.measure).toBe(cfg.bigNumber.measure);
            expect(result.total_per_year.big_number.totalUnitOfMeasureLabel).toBe(cfg.unitOfMeasure);
            expect(result.total_per_year.big_number.total).toBe(cfg.bigNumber.expectedTotal);
            expect(result.total_per_year.big_number.bigNumberDirection).toBe(cfg.bigNumber.expectedDirection);
            expect(result.total_per_year.big_number.versus).toBe(cfg.bigNumber.expectedVersus);
            expect(result.total_per_year.refreshDate.month).toBe(cfg.expectedRefreshDate.month);
            expect(result.total_per_year.refreshDate.quarter).toBe(cfg.expectedRefreshDate.quarter);
        });
        it("should return root empty when no datasource is available", async () => {
            const result = await formatter.evaluate({
                datasources: exports.EMPTY_OVERVIEW_DATASOURCES,
            });
            expect(result).toEqual({ empty: true });
        });
        it("should not return root empty when only monthly data exists", async () => {
            const fullData = buildBaseDatasources();
            const result = await formatter.evaluate({
                datasources: {
                    ...exports.EMPTY_OVERVIEW_DATASOURCES,
                    [exports.MONTHLY_KEY]: fullData[exports.MONTHLY_KEY],
                },
            });
            expect(result.empty).toBeUndefined();
            expect(result.total_per_month_quarter.empty).toBeUndefined();
            expect(result.total_per_year_full).toEqual({ empty: true });
            expect(result.total_per_year).toEqual({ empty: true });
        });
        it("should keep non-empty result when values are zero but rows exist", async () => {
            const fullData = (0, exports.buildOverviewDatasources)(cfg.kpiName, 0);
            const result = await formatter.evaluate({
                datasources: {
                    ...fullData,
                    [exports.MONTHLY_KEY]: fullData[exports.MONTHLY_KEY].map((item) => ({
                        ...item,
                        ac: 0,
                        ly: 0,
                        ac_vs_ly: 0,
                    })),
                    [exports.YEARLY_KEY]: fullData[exports.YEARLY_KEY].map((item) => ({
                        ...item,
                        ac: 0,
                        ac_vs_ly: 0,
                    })),
                    [exports.YEAR_FULL_KEY]: fullData[exports.YEAR_FULL_KEY].map((item) => ({
                        ...item,
                        ac: 0,
                        ac_vs_ly: 0,
                    })),
                },
            });
            expect(result.empty).toBeUndefined();
            expect(result.total_per_year_full.empty).toBeUndefined();
            expect(result.total_per_month_quarter.empty).toBeUndefined();
            expect(result.total_per_year.empty).toBeUndefined();
        });
        if (cfg.rendersDashOnNullComparison) {
            it("should render '-' when comparison variation is null", async () => {
                const fullData = buildBaseDatasources();
                const result = await formatter.evaluate({
                    datasources: {
                        ...fullData,
                        [exports.YEAR_FULL_KEY]: fullData[exports.YEAR_FULL_KEY].map((item, index) => index === 0
                            ? {
                                ...item,
                                ac_vs_ly: null,
                            }
                            : item),
                    },
                });
                expect(result.total_per_year_full.variation_caption.variationsRows.kpi
                    .data[0].variationsGroup[0].variation).toBe("-");
            });
        }
    });
};
exports.runOverviewFormatterSuite = runOverviewFormatterSuite;
//# sourceMappingURL=helpers.js.map