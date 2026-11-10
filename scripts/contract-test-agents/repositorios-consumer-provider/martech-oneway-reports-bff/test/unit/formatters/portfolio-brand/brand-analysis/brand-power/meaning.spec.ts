import { loadBrandAnalysisFormatter } from "../helpers";

describe("Portfolio Brand Brand Analysis Brand Power Meaning formatter", () => {
  const formatter = loadBrandAnalysisFormatter("brand-power/meaning.jsonata");

  it("should return abi chart blocks with one dataset per block", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            quarter_year: "Q1 2024",
            ac: 132.8,
            ac_vs_ly: -0.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2025,
            quarter_year: "Q1 2025",
            ac: 132.8,
            ac_vs_ly: 0,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year": [
          {
            year_value: 2024,
            ac: 128.7,
            ac_vs_ly: -6.2,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 132.6,
            ac_vs_ly: 3.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-full": [
          {
            year_value: 2024,
            ac: 128.7,
            ac_vs_ly: -6.2,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 132.6,
            ac_vs_ly: 3.9,
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
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 132.8,
            ac_vs_ly: -0.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 140.1,
            ac_vs_ly: 9.3,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 132.8,
            ac_vs_ly: 0,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 146,
            ac_vs_ly: 5.9,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year": [
          {
            year_value: 2024,
            ac: 128.7,
            ac_vs_ly: -6.2,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2024,
            ac: 142.6,
            ac_vs_ly: 8.2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 132.6,
            ac_vs_ly: 3.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 146.4,
            ac_vs_ly: 3.7,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-full": [
          {
            year_value: 2024,
            ac: 128.7,
            ac_vs_ly: -6.2,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2024,
            ac: 142.6,
            ac_vs_ly: 8.2,
            sub_brand: "Amstel Lager",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 132.6,
            ac_vs_ly: 3.9,
            sub_brand: "Beats",
            raw_brand: "Beats",
          },
          {
            year_value: 2025,
            ac: 146.4,
            ac_vs_ly: 3.7,
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

  it("should keep ABI mode and dedupe quarterly periods in noisy datasource input", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            quarter_year: "Q1 2024",
            ac: 145.6,
            ac_vs_ly: 2.3,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2024,
            quarter_year: "Q1 2024",
            ac: 145.6,
            ac_vs_ly: 2.3,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2024,
            quarter_year: "Q1 2024",
            ac: 116.1,
            ac_vs_ly: -0.5,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2024,
            quarter_year: "Q1 2024",
            ac: 146.7,
            ac_vs_ly: 12.6,
            sub_brand: "All",
            raw_brand: "Corona",
          },
          {
            quarter: "Q2",
            year: 2024,
            quarter_year: "Q2 2024",
            ac: 147.5,
            ac_vs_ly: 2.6,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q2",
            year: 2024,
            quarter_year: "Q2 2024",
            ac: 147.5,
            ac_vs_ly: 2.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q2",
            year: 2024,
            quarter_year: "Q2 2024",
            ac: 116.2,
            ac_vs_ly: 0.5,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q2",
            year: 2024,
            quarter_year: "Q2 2024",
            ac: 141.2,
            ac_vs_ly: 5.7,
            sub_brand: "All",
            raw_brand: "Corona",
          },
          {
            quarter: "Q3",
            year: 2024,
            quarter_year: "Q3 2024",
            ac: 145.6,
            ac_vs_ly: 2.6,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q3",
            year: 2024,
            quarter_year: "Q3 2024",
            ac: 145.6,
            ac_vs_ly: 2.6,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q4",
            year: 2024,
            quarter_year: "Q4 2024",
            ac: 148,
            ac_vs_ly: 4,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q4",
            year: 2024,
            quarter_year: "Q4 2024",
            ac: 148,
            ac_vs_ly: 4,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year": [
          {
            year_value: 2024,
            ac: 146.7,
            ac_vs_ly: 2.9,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 148.6,
            ac_vs_ly: 2,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-full": [
          {
            year_value: 2021,
            ac: 118.3,
            ac_vs_ly: -6.4,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2022,
            ac: 138.7,
            ac_vs_ly: 20.4,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2023,
            ac: 143.8,
            ac_vs_ly: 5.1,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 146.7,
            ac_vs_ly: 2.9,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 148.6,
            ac_vs_ly: 2,
            sub_brand: "Brahma",
            raw_brand: "Brahma",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.quarterly.datasets).toHaveLength(1);
    expect(JSON.parse(JSON.stringify(result.kpiData.quarterly.labels))).toEqual(
      ["Q1'24", "Q2'24", "Q3'24", "Q4'24"],
    );
    expect(
      JSON.parse(JSON.stringify(result.kpiData.quarterly.datasets[0].data)),
    ).toEqual([145.6, 147.5, 145.6, 148]);
    expect(JSON.parse(JSON.stringify(result.kpiData.ytd.labels))).toEqual([
      2024, 2025,
    ]);
  });

  it("should resolve competitor using RAW_BRAND when SUB_BRAND is All", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-qtr": [
          {
            quarter: "Q1",
            year: 2024,
            ac: 132.8,
            ac_vs_ly: -0.9,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2024,
            ac: 140.1,
            ac_vs_ly: 9.3,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 132.8,
            ac_vs_ly: 0,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            quarter: "Q1",
            year: 2025,
            ac: 146,
            ac_vs_ly: 5.9,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year": [
          {
            year_value: 2024,
            ac: 128.7,
            ac_vs_ly: -6.2,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 142.6,
            ac_vs_ly: 8.2,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 132.6,
            ac_vs_ly: 3.9,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 146.4,
            ac_vs_ly: 3.7,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
        ],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-full": [
          {
            year_value: 2024,
            ac: 128.7,
            ac_vs_ly: -6.2,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            year_value: 2024,
            ac: 142.6,
            ac_vs_ly: 8.2,
            sub_brand: "All",
            raw_brand: "Amstel",
          },
          {
            year_value: 2025,
            ac: 132.6,
            ac_vs_ly: 3.9,
            sub_brand: "All",
            raw_brand: "Brahma",
          },
          {
            year_value: 2025,
            ac: 146.4,
            ac_vs_ly: 3.7,
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

  it("should prioritize component datasources when root datasources is empty", async () => {
    const result: any = await formatter.evaluate({
      datasources: {},
      components: [
        {
          id: "meaning",
          data: {
            datasources: {
              "portfolio-brand_brand-analysis_brand-power_meaning_per-year-qtr":
                [
                  {
                    quarter: "Q1",
                    year: 2024,
                    quarter_year: "Q1 2024",
                    ac: 132.8,
                    ac_vs_ly: -0.9,
                    sub_brand: "Beats",
                    raw_brand: "Beats",
                  },
                  {
                    quarter: "Q1",
                    year: 2025,
                    quarter_year: "Q1 2025",
                    ac: 132.8,
                    ac_vs_ly: 0,
                    sub_brand: "Beats",
                    raw_brand: "Beats",
                  },
                ],
              "portfolio-brand_brand-analysis_brand-power_meaning_per-year": [
                {
                  year_value: 2024,
                  ac: 128.7,
                  ac_vs_ly: -6.2,
                  sub_brand: "Beats",
                  raw_brand: "Beats",
                },
                {
                  year_value: 2025,
                  ac: 132.6,
                  ac_vs_ly: 3.9,
                  sub_brand: "Beats",
                  raw_brand: "Beats",
                },
              ],
              "portfolio-brand_brand-analysis_brand-power_meaning_per-year-full":
                [
                  {
                    year_value: 2024,
                    ac: 128.7,
                    ac_vs_ly: -6.2,
                    sub_brand: "Beats",
                    raw_brand: "Beats",
                  },
                  {
                    year_value: 2025,
                    ac: 132.6,
                    ac_vs_ly: 3.9,
                    sub_brand: "Beats",
                    raw_brand: "Beats",
                  },
                ],
            },
          },
        },
      ],
    });

    expect(result.empty).toBeUndefined();
    expect(JSON.parse(JSON.stringify(result.kpiData.quarterly.labels))).toEqual(
      ["Q1'24", "Q1'25"],
    );
  });

  it("should return empty=true when all meaning datasources are empty", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-qtr": [],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year": [],
        "portfolio-brand_brand-analysis_brand-power_meaning_per-year-full": [],
      },
    });

    expect(result).toEqual({ empty: true });
  });
});
