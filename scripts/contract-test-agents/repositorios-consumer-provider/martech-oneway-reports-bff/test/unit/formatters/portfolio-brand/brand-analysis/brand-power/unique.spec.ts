import { loadBrandAnalysisFormatter } from "../helpers";

describe("Portfolio Brand Brand Analysis Brand Power Unique formatter", () => {
  const formatter = loadBrandAnalysisFormatter("brand-power/unique.jsonata");

  it("should return abi chart blocks with one dataset per block", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            quarter_year: "Q1 2024",
            ac: 153,
            ac_vs_ly: 5.6,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2025,
            quarter_year: "Q1 2025",
            ac: 150.6,
            ac_vs_ly: -2.4,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year": [
          {
            year_value: 2024,
            ac: 150.4,
            ac_vs_ly: -0.3,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 151.2,
            ac_vs_ly: 0.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-full": [
          {
            year_value: 2024,
            ac: 150.4,
            ac_vs_ly: -0.3,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 151.2,
            ac_vs_ly: 0.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
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
      result.kpiData.yearly.variation_caption.variationsRows.kpi.data[0]
        .variationsGroup[0].unit_of_measure,
    ).toBe("pp");
  });

  it("should return competitor chart blocks with paired datasets and variations", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 153,
            ac_vs_ly: 5.6,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 109.5,
            ac_vs_ly: 5.8,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 150.6,
            ac_vs_ly: -2.4,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 110.7,
            ac_vs_ly: 1.1,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year": [
          {
            year_value: 2024,
            ac: 150.4,
            ac_vs_ly: -0.3,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2024,
            ac: 110,
            ac_vs_ly: 2.9,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 151.2,
            ac_vs_ly: 0.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 110.9,
            ac_vs_ly: 0.9,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-full": [
          {
            year_value: 2024,
            ac: 150.4,
            ac_vs_ly: -0.3,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2024,
            ac: 110,
            ac_vs_ly: 2.9,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 151.2,
            ac_vs_ly: 0.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 110.9,
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

  it("should return empty=true when all unique datasources are empty", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-qtr": [],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year": [],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-full": [],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should fallback to legacy datasource keys", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            quarter_year_formatted: "Q1'24",
            ac: 153,
            comparison: 5.6,
            variation_direction: "up",
            sub_brand: "Beats",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year": [
          {
            year: 2024,
            ac: 150.4,
            comparison: -0.3,
            variation_direction: "down",
            sub_brand: "Beats",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-full": [
          {
            year: 2024,
            ac: 150.4,
            comparison: -0.3,
            variation_direction: "down",
            sub_brand: "Beats",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.quarterly.datasets).toHaveLength(1);
    expect(result.kpiData.yearly.datasets).toHaveLength(1);
    expect(JSON.parse(JSON.stringify(result.kpiData.quarterly.labels))).toBe(
      "Q1'24",
    );
  });

  it("should fallback to abi shape when competitor pairing is incomplete", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 153,
            ac_vs_ly: 5.6,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 109.5,
            ac_vs_ly: 5.8,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            quarter: "Q2",
            year: 2024,
            ac: 150.6,
            ac_vs_ly: -2.4,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year": [
          {
            year_value: 2024,
            ac: 150.4,
            ac_vs_ly: -0.3,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2024,
            ac: 110,
            ac_vs_ly: 2.9,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 151.2,
            ac_vs_ly: 0.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-full": [
          {
            year_value: 2024,
            ac: 150.4,
            ac_vs_ly: -0.3,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2024,
            ac: 110,
            ac_vs_ly: 2.9,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 151.2,
            ac_vs_ly: 0.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.quarterly.datasets).toHaveLength(1);
    expect(result.kpiData.ytd.datasets).toHaveLength(1);
    expect(result.kpiData.yearly.datasets).toHaveLength(1);
    expect(JSON.parse(JSON.stringify(result.kpiData.quarterly.labels))).toEqual(
      ["Q1'24", "Q1'24", "Q2'24"],
    );
  });

  it("should ignore aggregate rows when specific sub_brand exists", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 153,
            ac_vs_ly: 5.6,
            sub_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 0,
            ac_vs_ly: 0,
            sub_brand: "All",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 150.6,
            ac_vs_ly: -2.4,
            sub_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 0,
            ac_vs_ly: 0,
            sub_brand: "All",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year": [
          {
            year_value: 2024,
            ac: 150.4,
            ac_vs_ly: -0.3,
            sub_brand: "Beats",
          },
          {
            year_value: 2024,
            ac: 0,
            ac_vs_ly: 0,
            sub_brand: "All",
          },
          {
            year_value: 2025,
            ac: 151.2,
            ac_vs_ly: 0.9,
            sub_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 0,
            ac_vs_ly: 0,
            sub_brand: "All",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_unique_per-year-full": [
          {
            year_value: 2024,
            ac: 150.4,
            ac_vs_ly: -0.3,
            sub_brand: "Beats",
          },
          {
            year_value: 2024,
            ac: 0,
            ac_vs_ly: 0,
            sub_brand: "All",
          },
          {
            year_value: 2025,
            ac: 151.2,
            ac_vs_ly: 0.9,
            sub_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 0,
            ac_vs_ly: 0,
            sub_brand: "All",
          },
        ],
      },
    });

    expect(result.kpiData.quarterly.datasets).toHaveLength(1);
    expect(JSON.parse(JSON.stringify(result.kpiData.quarterly.labels))).toEqual(
      ["Q1'24", "Q1'25"],
    );
    expect(
      JSON.parse(JSON.stringify(result.kpiData.quarterly.datasets[0].data)),
    ).toEqual([153, 150.6]);
  });
});
