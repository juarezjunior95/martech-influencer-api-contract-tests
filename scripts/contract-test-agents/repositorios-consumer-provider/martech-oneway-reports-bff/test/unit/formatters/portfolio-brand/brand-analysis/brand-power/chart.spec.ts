import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const asArray = <T>(value: unknown): T[] =>
  value == null ? [] : Array.from(value as Iterable<T>);

describe("brand-power chart formatter (portfolio-brand brand-analysis)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-analysis/brand-power/chart.jsonata",
  );

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return total_per_year_full, total_per_month_quarter, total_per_year at root (caller may nest under power)", async () => {
    const fullYear = [
      {
        year_ini: 2023,
        ac: 72,
        ac_vs_ly: 0.8,
        variationDirectionVsLy: "up",
        kpi_name: "power",
        refreshMonthLabel: "Dec'23",
      },
    ];
    const perMonth = [
      {
        year_ini: 2025,
        month_ini: 1,
        ac: 71,
        ly: 70,
        ac_vs_ly: 1,
        variationDirectionVsLy: "up",
        kpi_name: "power",
        max_year: 2025,
        refreshMonthLabel: "Jan'25",
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-01-01T00:00:00.000Z",
      },
    ];
    const ytd = [
      {
        year_ini: 2025,
        month_ini: 1,
        ac: 70,
        ac_vs_ly: 0.5,
        variationDirectionVsLy: "up",
        kpi_name: "power",
        refreshMonthLabel: "Jan'25",
      },
    ];
    const tooltipInput = [
      {
        ac_current: 72,
        ac_previous: 71,
        ac_vs_ly: 1,
        variationDirectionVsLy: "up",
        kpi_name: "power",
      },
    ];

    const mockInput = {
      datasources: {
        "portfolio-brand_brand-analysis_overview_full-year": fullYear,
        "portfolio-brand_brand-analysis_overview_per-month": perMonth,
        "portfolio-brand_brand-analysis_overview_ytd": ytd,
        "portfolio-brand_brand-analysis_overview_tooltip": tooltipInput,
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("total_per_year_full");
    expect(result).toHaveProperty("total_per_month_quarter");
    expect(result).toHaveProperty("total_per_year");

    const perYearFull = result.total_per_year_full;
    expect(perYearFull).not.toBeNull();
    expect(perYearFull.refreshDate.quarter).toBe("Q4'23");
    expect(asArray<number>(perYearFull.datasets[0].data)).toContainEqual(72);
    expect(asArray<number>(perYearFull.labels)).toContainEqual(2023);
    expect(perYearFull.datasets[0].borderColor).toBe("#4BC0C0");
    expect(perYearFull.comparison_unit_of_measure).toBe("pp");

    const perMonthQuarter = result.total_per_month_quarter;
    expect(perMonthQuarter).not.toBeNull();
    expect(perMonthQuarter.labels_type).toBe("quarters");
    expect(asArray<string>(perMonthQuarter.labels)).toContainEqual("Q1'25");
    expect(perMonthQuarter.referencialUnitMeasure).toBe("pp");
    expect(perMonthQuarter.type).toBe("bar");

    const perYear = result.total_per_year;
    expect(perYear).not.toBeNull();
    expect(perYear.big_number.title).toBe("Brand Power");
    expect(perYear.big_number.totalUnitOfMeasureLabel).toBe("pp");
    expect(perYear.big_number.measure).toBe("[%]");
  });

  it("matches reference snapshot without power tooltip (synthetic 2022 + rounded comparison)", async () => {
    const fullYear = [
      {
        year_ini: 2023,
        ac: 52.2,
        ac_vs_ly: -0.3,
        variationDirectionVsLy: "down",
        kpi_name: "power",
        refreshMonthLabel: "Dec'23",
      },
      {
        year_ini: 2024,
        ac: 52.1,
        ac_vs_ly: -0.1,
        variationDirectionVsLy: "down",
        kpi_name: "power",
        refreshMonthLabel: "Dec'24",
      },
      {
        year_ini: 2025,
        ac: 53.5,
        ac_vs_ly: 1.4,
        variationDirectionVsLy: "up",
        kpi_name: "power",
        refreshMonthLabel: "Dec'25",
      },
    ];
    const perMonth = [
      {
        kpi_name: "power",
        year_ini: 2025,
        month_ini: 1,
        ac: 53.7,
        ac_vs_ly: 1.5,
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Mar'25",
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-01T00:00:00.000Z",
      },
      {
        kpi_name: "power",
        year_ini: 2025,
        month_ini: 4,
        ac: 53.3,
        ac_vs_ly: 1.4,
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Jun'25",
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-01T00:00:00.000Z",
      },
      {
        kpi_name: "power",
        year_ini: 2025,
        month_ini: 7,
        ac: 53.4,
        ac_vs_ly: 1.1,
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Sep'25",
        dt_ini: "2025-07-01T00:00:00.000Z",
        dt_end: "2025-09-01T00:00:00.000Z",
      },
      {
        kpi_name: "power",
        year_ini: 2025,
        month_ini: 10,
        ac: 53.6,
        ac_vs_ly: 1.5,
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Dec'25",
        dt_ini: "2025-10-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
      },
      {
        kpi_name: "power",
        year_ini: 2026,
        month_ini: 1,
        ac: 52.7,
        ac_vs_ly: -1.1,
        variationDirectionVsLy: "down",
        refreshMonthLabel: "Mar'26",
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-03-01T00:00:00.000Z",
      },
    ];
    const ytd = [
      {
        kpi_name: "power",
        year_ini: 2025,
        month_ini: 1,
        ac: 53.7,
        ac_vs_ly: 1.5,
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Mar'25",
      },
      {
        kpi_name: "power",
        year_ini: 2026,
        month_ini: 1,
        ac: 52.7,
        ac_vs_ly: -1.1,
        variationDirectionVsLy: "down",
        refreshMonthLabel: "Mar'26",
      },
    ];

    const result = await compiledExpression.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_overview_full-year": fullYear,
        "portfolio-brand_brand-analysis_overview_per-month": perMonth,
        "portfolio-brand_brand-analysis_overview_ytd": ytd,
        "portfolio-brand_brand-analysis_overview_tooltip": [
          {
            kpi_name: "market_share",
            ac_current: 55.2,
            ac_previous: 55.5,
            ac_vs_ly: -0.3,
            variationDirectionVsLy: "down",
          },
        ],
      },
    });

    const full = result.total_per_year_full;
    expect(asArray<number>(full.datasets[0].data)).toEqual([
      52.5, 52.2, 52.1, 53.5,
    ]);
    expect(asArray<number>(full.labels)).toEqual([2022, 2023, 2024, 2025]);
    expect(full.refreshDate).toEqual({ month: "Dec'25", quarter: "Q4'25" });
    expect(full.comparison_data).toEqual({
      comparison: 1,
      unit_of_measure: "pp",
      direction: "up",
    });
    expect(full.variation_caption.subtitle).toBe("vs LY [ 2022 - 2025 ]");
    const vFull = full.variation_caption.variationsRows.kpi.data;
    expect(asArray<unknown>(vFull).length).toBe(4);
    expect(vFull[0].variationsGroup[0].variation).toBe(1.8);
    expect(vFull[1].variationsGroup[0].variation).toBe(-0.3);
    expect(vFull[2].variationsGroup[0].variation).toBe(-0.1);
    expect(vFull[3].variationsGroup[0].variation).toBe(1.4);

    const q = result.total_per_month_quarter;
    expect(asArray<number>(q.datasets[0].data)).toEqual([
      53.7, 53.3, 53.4, 53.6, 52.7,
    ]);
    expect(asArray<string>(q.labels)).toEqual([
      "Q1'25",
      "Q2'25",
      "Q3'25",
      "Q4'25",
      "Q1'26",
    ]);
    expect(q.variation_caption.subtitle).toBe("vs LY [ Q'25 - Q'26 ]");
    expect(q.refreshDate).toEqual({ month: "Mar'26", quarter: "Q1'26" });

    const y = result.total_per_year;
    expect(asArray<number>(y.datasets[0].data)).toEqual([53.7, 52.7]);
    expect(asArray<number>(y.labels)).toEqual([2025, 2026]);
    expect(y.big_number).toMatchObject({
      total: -1.1,
      bigNumberDirection: "down",
      versus: "vs Q1'25 YTD",
    });
    expect(y.refreshDate).toEqual({ month: "Mar'26", quarter: "Q1'26" });
  });
});
