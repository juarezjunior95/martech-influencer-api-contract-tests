import { loadBrandAnalysisFormatter } from "../helpers";

describe("Portfolio Brand Brand Analysis Brand Power formatter", () => {
  const formatter = loadBrandAnalysisFormatter(
    "brand-power/brand-power.jsonata",
  );

  it("should return abi chart blocks with one dataset per block", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_per-year-qtr": [
          {
            quarter: "Q1",
            quarter_year: "Q1 2024",
            year: 2024,
            ac: 52.9,
            ac_vs_ly: -0.5,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            quarter_year: "Q1 2025",
            year: 2025,
            ac: 53.4,
            ac_vs_ly: 0.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_per-year": [
          {
            year_value: 2024,
            ac: 52.9,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 53.3,
            ac_vs_ly: 0.4,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_per-year-full": [
          {
            year_value: 2024,
            ac: 52.9,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 53.3,
            ac_vs_ly: 0.4,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.quarterly.datasets).toHaveLength(1);
    expect(result.kpiData.ytd.datasets).toHaveLength(1);
    expect(result.kpiData.yearly.datasets).toHaveLength(1);
    expect(JSON.parse(JSON.stringify(result.kpiData.quarterly.labels))).toEqual(
      ["Q1'24", "Q1'25"],
    );
    expect(JSON.parse(JSON.stringify(result.kpiData.yearly.labels))).toEqual([
      2024, 2025,
    ]);
    expect(
      JSON.parse(JSON.stringify(result.kpiData.yearly.datasets[0].data)),
    ).toEqual([52.9, 53.3]);
  });

  it("should return competitor chart blocks with paired datasets and variations", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 52.9,
            ac_vs_ly: -0.5,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 45.1,
            ac_vs_ly: 0.8,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 53.4,
            ac_vs_ly: 0.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 45.8,
            ac_vs_ly: 0.7,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_per-year": [
          {
            year_value: 2024,
            ac: 52.9,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 45.2,
            ac_vs_ly: 1.1,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 53.3,
            ac_vs_ly: 0.4,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 45.9,
            ac_vs_ly: 0.9,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_per-year-full": [
          {
            year_value: 2024,
            ac: 52.9,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 45.2,
            ac_vs_ly: 1.1,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 53.3,
            ac_vs_ly: 0.4,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 45.9,
            ac_vs_ly: 0.9,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.quarterly.datasets).toHaveLength(2);
    expect(result.kpiData.ytd.datasets).toHaveLength(2);
    expect(result.kpiData.yearly.datasets).toHaveLength(2);
    expect(JSON.parse(JSON.stringify(result.kpiData.quarterly.labels))).toEqual(
      ["Q1'24", "Q1'25"],
    );
    expect(
      result.kpiData.quarterly.variation_caption.variationsRows.kpi.data[0]
        .variationsGroup,
    ).toHaveLength(2);
    expect(result.kpiData.yearly.variation_caption.subtitle).toBe(
      "Vs LY [ 2024 - 2025 ]",
    );
  });

  it("should detect competitor using RAW_BRAND when SUB_BRAND is All", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 13.2,
            ac_vs_ly: 0.1,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 4.5,
            ac_vs_ly: 0.9,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 13.2,
            ac_vs_ly: 0,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 5.0,
            ac_vs_ly: 0.5,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_per-year": [
          {
            year_value: 2024,
            ac: 13.5,
            ac_vs_ly: 0.5,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 4.6,
            ac_vs_ly: 0.8,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 13.2,
            ac_vs_ly: -0.3,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 5.1,
            ac_vs_ly: 0.5,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_per-year-full": [
          {
            year_value: 2024,
            ac: 13.5,
            ac_vs_ly: 0.5,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 4.6,
            ac_vs_ly: 0.8,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 13.2,
            ac_vs_ly: -0.3,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 5.1,
            ac_vs_ly: 0.5,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.quarterly.datasets).toHaveLength(2);
    expect(result.kpiData.ytd.datasets).toHaveLength(2);
    expect(result.kpiData.yearly.datasets).toHaveLength(2);
  });

  it("should return empty=true when all brand power datasources are empty", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_per-year-qtr": [],
        "portfolio-brand_brand-analysis_brand-power_per-year": [],
        "portfolio-brand_brand-analysis_brand-power_per-year-full": [],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should return yearly empty=true when per-year-full is empty", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_per-year-qtr": [
          {
            quarter: "Q1",
            quarter_year: "Q1 2024",
            year: 2024,
            ac: 52.9,
            ac_vs_ly: -0.5,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_per-year": [
          {
            year_value: 2024,
            ac: 52.9,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_per-year-full": [],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.quarterly).toBeDefined();
    expect(result.kpiData.ytd).toBeDefined();
    expect(result.kpiData.yearly).toEqual({ empty: true });
  });

  it("should not use legacy datasource keys", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "ds_owr_brand-analysis_brand-power_brand-power_per_year_qtr": [
          {
            quarter: "Q1",
            year: 2024,
            quarter_year_formatted: "Q1'24",
            ac: 52.9,
            comparison: -0.5,
            variation_direction: "down",
            sub_brand: "Brahma",
          },
        ],
        "ds_owr_brand-analysis_brand-power_brand-power_per_year": [
          {
            year: 2024,
            ac: 52.9,
            comparison: 0.1,
            variation_direction: "up",
            sub_brand: "Brahma",
          },
        ],
        "ds_owr_brand-analysis_brand-power_brand-power_per_year_full": [
          {
            year: 2024,
            ac: 52.9,
            comparison: 0.1,
            variation_direction: "up",
            sub_brand: "Brahma",
          },
        ],
      },
    });

    expect(result).toEqual({ empty: true });
  });
});
