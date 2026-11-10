import { loadBrandAnalysisFormatter } from "../helpers";

describe("Portfolio Brand Brand Analysis Brand Power Imagery formatter", () => {
  const formatter = loadBrandAnalysisFormatter("brand-power/imagery.jsonata");

  it("should return abi chart blocks with one dataset per block", async () => {
    const result: any = await formatter.evaluate({
      components: [
        {
          id: "imagery",
          data: {
            datasources: {
              "portfolio-brand_brand-analysis_brand-power_imagery_per-year-qtr":
                [
                  {
                    quarter: "Q1",
                    year: 2024,
                    quarter_year: "Q1 2024",
                    ac: 42.9,
                    ac_vs_ly: 1.6,
                    sub_brand: "Brahma",
                    raw_brand: "Brahma",
                  },
                  {
                    quarter: "Q1",
                    year: 2025,
                    quarter_year: "Q1 2025",
                    ac: 43,
                    ac_vs_ly: 0.1,
                    sub_brand: "Brahma",
                    raw_brand: "Brahma",
                  },
                ],
              "portfolio-brand_brand-analysis_brand-power_imagery_per-year": [
                {
                  year_value: 2024,
                  ac: 42.9,
                  ac_vs_ly: 1.6,
                  sub_brand: "Brahma",
                  raw_brand: "Brahma",
                },
                {
                  year_value: 2025,
                  ac: 43,
                  ac_vs_ly: 0.1,
                  sub_brand: "Brahma",
                  raw_brand: "Brahma",
                },
              ],
              "portfolio-brand_brand-analysis_brand-power_imagery_per-year-full":
                [
                  {
                    year_value: 2024,
                    ac: 42.9,
                    ac_vs_ly: 1.6,
                    sub_brand: "Brahma",
                    raw_brand: "Brahma",
                  },
                  {
                    year_value: 2025,
                    ac: 43,
                    ac_vs_ly: 0.1,
                    sub_brand: "Brahma",
                    raw_brand: "Brahma",
                  },
                ],
            },
          },
        },
      ],
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
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 42.9,
            ac_vs_ly: 1.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 29.4,
            ac_vs_ly: 2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 43,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 29.9,
            ac_vs_ly: 0.6,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year": [
          {
            year_value: 2024,
            ac: 42.9,
            ac_vs_ly: 1.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 29.4,
            ac_vs_ly: 2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 43,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 29.9,
            ac_vs_ly: 0.6,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-full": [
          {
            year_value: 2024,
            ac: 42.9,
            ac_vs_ly: 1.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 29.4,
            ac_vs_ly: 2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 43,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 29.9,
            ac_vs_ly: 0.6,
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
    expect(
      result.kpiData.quarterly.variation_caption.variationsRows.kpi.data[0]
        .variationsGroup,
    ).toHaveLength(2);
    expect(result.kpiData.yearly.variation_caption.subtitle).toBe(
      "Vs LY [ 2024 - 2025 ]",
    );
  });

  it("should return empty=true when all imagery datasources are empty", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-qtr": [],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year": [],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-full": [],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should ignore legacy keys and return empty when normalized keys are missing", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "ds_owr_brand-analysis_brand-power_imagery_per_year_qtr": [
          {
            quarter: "Q1",
            year: 2024,
            quarter_year_formatted: "Q1'24",
            ac: 42.9,
            comparison: 1.6,
            variation_direction: "up",
            sub_brand: "Brahma",
          },
        ],
        "ds_owr_brand-analysis_brand-power_imagery_per_year": [
          {
            year: 2024,
            ac: 42.9,
            comparison: 1.6,
            variation_direction: "up",
            sub_brand: "Brahma",
          },
        ],
        "ds_owr_brand-analysis_brand-power_imagery_per_year_full": [
          {
            year: 2024,
            ac: 42.9,
            comparison: 1.6,
            variation_direction: "up",
            sub_brand: "Brahma",
          },
        ],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should fallback to abi shape when competitor pairing is incomplete", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 42.9,
            ac_vs_ly: 1.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 29.4,
            ac_vs_ly: 2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 43,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year": [
          {
            year_value: 2024,
            ac: 42.9,
            ac_vs_ly: 1.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 29.4,
            ac_vs_ly: 2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 43,
            ac_vs_ly: 0.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-full": [
          {
            year_value: 2024,
            ac: 42.9,
            ac_vs_ly: 1.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 29.4,
            ac_vs_ly: 2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 43,
            ac_vs_ly: 0.1,
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
  });

  it("should keep ytd arrays for abi when datasource has a single year", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2026,
            ac: 28.6,
            ac_vs_ly: -0.7,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year": [
          {
            year_value: 2026,
            ac: 28.6,
            ac_vs_ly: -0.7,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-full": [
          {
            year_value: 2026,
            ac: 28.6,
            ac_vs_ly: -0.7,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(Array.isArray(result.kpiData.ytd.datasets[0].data)).toBe(true);
    expect(Array.isArray(result.kpiData.ytd.datasets[0].backgroundColor)).toBe(
      true,
    );
    expect(Array.isArray(result.kpiData.ytd.labels)).toBe(true);
    expect(
      Array.isArray(
        result.kpiData.ytd.variation_caption.variationsRows.kpi.data,
      ),
    ).toBe(true);
  });

  it("should keep ytd arrays for competitor when datasource has one year per brand", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2026,
            ac: 28.6,
            ac_vs_ly: -0.7,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2026,
            ac: 29.4,
            ac_vs_ly: -1.2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year": [
          {
            year_value: 2026,
            ac: 28.6,
            ac_vs_ly: -0.7,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2026,
            ac: 29.4,
            ac_vs_ly: -1.2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_imagery_per-year-full": [
          {
            year_value: 2026,
            ac: 28.6,
            ac_vs_ly: -0.7,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2026,
            ac: 29.4,
            ac_vs_ly: -1.2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.ytd.datasets).toHaveLength(2);
    expect(Array.isArray(result.kpiData.ytd.datasets[0].data)).toBe(true);
    expect(Array.isArray(result.kpiData.ytd.datasets[1].data)).toBe(true);
    expect(Array.isArray(result.kpiData.ytd.datasets[0].backgroundColor)).toBe(
      true,
    );
    expect(Array.isArray(result.kpiData.ytd.datasets[1].backgroundColor)).toBe(
      true,
    );
    expect(Array.isArray(result.kpiData.ytd.labels)).toBe(true);
    expect(
      Array.isArray(
        result.kpiData.ytd.variation_caption.variationsRows.kpi.data,
      ),
    ).toBe(true);
  });
});
