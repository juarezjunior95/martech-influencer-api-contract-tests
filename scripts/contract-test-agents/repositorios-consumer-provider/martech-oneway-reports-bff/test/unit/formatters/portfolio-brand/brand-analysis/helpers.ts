import fs from "fs";
import path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

type OverviewKpiName = "volume" | "nr" | "cores" | "market_share" | "power";

const FORMATTERS_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/portfolio-brand/brand-analysis",
);

export const MONTHLY_KEY =
  "portfolio-brand_brand-analysis_total-per-month-quarter-all-st";
export const YEARLY_KEY =
  "portfolio-brand_brand-analysis_total-per-year-all-st";
export const YEAR_FULL_KEY =
  "portfolio-brand_brand-analysis_total-per-year-full-all-st";
export const TOOLTIP_KEY = "portfolio-brand_brand-analysis_tooltip-st";

export const loadBrandAnalysisFormatter = (formatterPath: string) => {
  const expression = jsonata(
    fs.readFileSync(path.join(FORMATTERS_PATH, formatterPath), "utf8"),
  );
  registerHelpers(expression);
  return expression;
};

export const buildOverviewDatasources = (
  kpiName: OverviewKpiName,
  tooltipValue?: number,
) => {
  const normalizedKpiName = kpiName.toUpperCase();

  return {
    [MONTHLY_KEY]: [
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
    [YEARLY_KEY]: [
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
    [YEAR_FULL_KEY]: [
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
    [TOOLTIP_KEY]:
      typeof tooltipValue === "number"
        ? [{ kpi_name: normalizedKpiName, ac_vs_ly: tooltipValue }]
        : [],
  };
};

export const EMPTY_OVERVIEW_DATASOURCES = {
  [MONTHLY_KEY]: [],
  [YEARLY_KEY]: [],
  [YEAR_FULL_KEY]: [],
  [TOOLTIP_KEY]: [],
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
  expectedRefreshDate: { month: string; quarter: string };
  rendersDashOnNullComparison: boolean;
}

export const runOverviewFormatterSuite = (cfg: OverviewSpecConfig) => {
  describe(cfg.describeName, () => {
    const formatter = loadBrandAnalysisFormatter(cfg.formatterFile);

    const buildBaseDatasources = () =>
      cfg.yearFull.sendsTooltip
        ? buildOverviewDatasources(cfg.kpiName, cfg.yearFull.expectedComparison)
        : buildOverviewDatasources(cfg.kpiName);

    it("should format all overview sections when datasource is present", async () => {
      const result: any = await formatter.evaluate({
        datasources: buildBaseDatasources(),
      });

      expect(result.total_per_year_full.type).toBe("bar");
      expect(result.total_per_year_full.comparison_data.comparison).toBe(
        cfg.yearFull.expectedComparison,
      );
      expect(result.total_per_year_full.comparison_data.unit_of_measure).toBe(
        cfg.unitOfMeasure,
      );
    });

    it("should format total_per_month_quarter section with chart legend, refresh date and background", async () => {
      const result: any = await formatter.evaluate({
        datasources: buildBaseDatasources(),
      });

      expect(result.total_per_month_quarter.type).toBe(cfg.monthQuarter.type);
      expect(result.total_per_month_quarter.labels_type).toBe(
        cfg.monthQuarter.labelsType,
      );
      expect(result.total_per_month_quarter.refreshDate.month).toBe(
        cfg.expectedRefreshDate.month,
      );
      expect(result.total_per_month_quarter.refreshDate.quarter).toBe(
        cfg.expectedRefreshDate.quarter,
      );
      expect(result.total_per_month_quarter.referencialUnitMeasure).toBe(
        cfg.unitOfMeasure,
      );
      expect(result.total_per_month_quarter.chartLegend).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ label: "Previous Year" }),
          expect.objectContaining({ label: "Current Year" }),
        ]),
      );
      expect(result.total_per_month_quarter.backgroundColor).toHaveLength(
        cfg.monthQuarter.expectedBackgroundColorLength,
      );
    });

    it("should format total_per_year big number with title, measure, total, direction and versus", async () => {
      const result: any = await formatter.evaluate({
        datasources: buildBaseDatasources(),
      });

      expect(result.total_per_year.big_number.title).toBe(cfg.bigNumber.title);
      expect(result.total_per_year.big_number.measure).toBe(
        cfg.bigNumber.measure,
      );
      expect(result.total_per_year.big_number.totalUnitOfMeasureLabel).toBe(
        cfg.unitOfMeasure,
      );
      expect(result.total_per_year.big_number.total).toBe(
        cfg.bigNumber.expectedTotal,
      );
      expect(result.total_per_year.big_number.bigNumberDirection).toBe(
        cfg.bigNumber.expectedDirection,
      );
      expect(result.total_per_year.big_number.versus).toBe(
        cfg.bigNumber.expectedVersus,
      );
      expect(result.total_per_year.refreshDate.month).toBe(
        cfg.expectedRefreshDate.month,
      );
      expect(result.total_per_year.refreshDate.quarter).toBe(
        cfg.expectedRefreshDate.quarter,
      );
    });

    it("should return root empty when no datasource is available", async () => {
      const result: any = await formatter.evaluate({
        datasources: EMPTY_OVERVIEW_DATASOURCES,
      });

      expect(result).toEqual({ empty: true });
    });

    it("should not return root empty when only monthly data exists", async () => {
      const fullData = buildBaseDatasources();
      const result: any = await formatter.evaluate({
        datasources: {
          ...EMPTY_OVERVIEW_DATASOURCES,
          [MONTHLY_KEY]: fullData[MONTHLY_KEY],
        },
      });

      expect(result.empty).toBeUndefined();
      expect(result.total_per_month_quarter.empty).toBeUndefined();
      expect(result.total_per_year_full).toEqual({ empty: true });
      expect(result.total_per_year).toEqual({ empty: true });
    });

    it("should keep non-empty result when values are zero but rows exist", async () => {
      const fullData = buildOverviewDatasources(cfg.kpiName, 0);
      const result: any = await formatter.evaluate({
        datasources: {
          ...fullData,
          [MONTHLY_KEY]: fullData[MONTHLY_KEY].map((item: any) => ({
            ...item,
            ac: 0,
            ly: 0,
            ac_vs_ly: 0,
          })),
          [YEARLY_KEY]: fullData[YEARLY_KEY].map((item: any) => ({
            ...item,
            ac: 0,
            ac_vs_ly: 0,
          })),
          [YEAR_FULL_KEY]: fullData[YEAR_FULL_KEY].map((item: any) => ({
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
        const result: any = await formatter.evaluate({
          datasources: {
            ...fullData,
            [YEAR_FULL_KEY]: fullData[YEAR_FULL_KEY].map(
              (item: any, index: number) =>
                index === 0
                  ? {
                      ...item,
                      ac_vs_ly: null,
                    }
                  : item,
            ),
          },
        });

        expect(
          result.total_per_year_full.variation_caption.variationsRows.kpi
            .data[0].variationsGroup[0].variation,
        ).toBe("-");
      });
    }
  });
};
