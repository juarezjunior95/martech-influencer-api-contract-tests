import { loadBrandAnalysisFormatter } from "../helpers";

describe("Portfolio Brand Brand Analysis Brand Power Unaided Awareness formatter", () => {
  const formatter = loadBrandAnalysisFormatter(
    "brand-power/unaided-awareness.jsonata",
  );

  it("should return abi chart blocks with one dataset per block", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-qtr":
          [
            {
              quarter: "Q1",
              year: 2024,
              quarter_year: "Q1 2024",
              ac: 4.5,
              ac_vs_ly: 0.1,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              quarter: "Q1",
              year: 2025,
              quarter_year: "Q1 2025",
              ac: 4.9,
              ac_vs_ly: 0.5,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
          ],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year":
          [
            {
              year_value: 2024,
              ac: 4.7,
              ac_vs_ly: 0.2,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              year_value: 2025,
              ac: 5.2,
              ac_vs_ly: 0.6,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
          ],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-full":
          [
            {
              year_value: 2024,
              ac: 4.7,
              ac_vs_ly: 0.2,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              year_value: 2025,
              ac: 5.2,
              ac_vs_ly: 0.6,
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
      result.kpiData.quarterly.variation_caption.variationsRows.kpi.data[0]
        .variationsGroup[0].unit_of_measure,
    ).toBe("pp");
  });

  it("should return competitor chart blocks with paired datasets and variations", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-qtr":
          [
            {
              quarter: "Q1",
              year: 2024,
              ac: 4.5,
              ac_vs_ly: 0.1,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              quarter: "Q1",
              year: 2024,
              ac: 22.4,
              ac_vs_ly: 3.7,
              sub_brand: "Amstel Lager",
              raw_brand: "Amstel",
            },
            {
              quarter: "Q1",
              year: 2025,
              ac: 4.9,
              ac_vs_ly: 0.5,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              quarter: "Q1",
              year: 2025,
              ac: 25.8,
              ac_vs_ly: 3.4,
              sub_brand: "Amstel Lager",
              raw_brand: "Amstel",
            },
          ],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year":
          [
            {
              year_value: 2024,
              ac: 4.7,
              ac_vs_ly: 0.2,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              year_value: 2024,
              ac: 22.8,
              ac_vs_ly: 3.9,
              sub_brand: "Amstel Lager",
              raw_brand: "Amstel",
            },
            {
              year_value: 2025,
              ac: 5.2,
              ac_vs_ly: 0.6,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              year_value: 2025,
              ac: 25,
              ac_vs_ly: 2.2,
              sub_brand: "Amstel Lager",
              raw_brand: "Amstel",
            },
          ],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-full":
          [
            {
              year_value: 2024,
              ac: 4.7,
              ac_vs_ly: 0.2,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              year_value: 2024,
              ac: 22.8,
              ac_vs_ly: 3.9,
              sub_brand: "Amstel Lager",
              raw_brand: "Amstel",
            },
            {
              year_value: 2025,
              ac: 5.2,
              ac_vs_ly: 0.6,
              sub_brand: "Beats",
              raw_brand: "Beats",
            },
            {
              year_value: 2025,
              ac: 25,
              ac_vs_ly: 2.2,
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

  it("should ignore COMP aggregate rows when sub_brand_comp is All", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-qtr":
          [
            {
              quarter: "Q2",
              year: 2024,
              ac: 5.1,
              ac_vs_ly: 1.1,
              sub_brand: "Beats",
            },
            {
              quarter: "Q2",
              year: 2024,
              ac: 22.5,
              ac_vs_ly: 3.8,
              sub_brand: "All",
            },
            {
              quarter: "Q2",
              year: 2024,
              ac: 19.3,
              ac_vs_ly: 2.1,
              sub_brand: "All",
            },
            {
              quarter: "Q1",
              year: 2025,
              ac: 4.9,
              ac_vs_ly: 0.5,
              sub_brand: "Beats",
            },
            {
              quarter: "Q1",
              year: 2025,
              ac: 25.8,
              ac_vs_ly: 3.4,
              sub_brand: "All",
            },
          ],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year":
          [
            {
              year_value: 2025,
              ac: 4.9,
              ac_vs_ly: 0.5,
              sub_brand: "Beats",
            },
            {
              year_value: 2025,
              ac: 25.8,
              ac_vs_ly: 3.4,
              sub_brand: "All",
            },
            {
              year_value: 2026,
              ac: 5.8,
              ac_vs_ly: 0.9,
              sub_brand: "Beats",
            },
            {
              year_value: 2026,
              ac: 26.1,
              ac_vs_ly: 0.3,
              sub_brand: "All",
            },
          ],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-full":
          [
            {
              year_value: 2024,
              ac: 4.7,
              ac_vs_ly: 0.2,
              sub_brand: "Beats",
            },
            {
              year_value: 2024,
              ac: 22.8,
              ac_vs_ly: 3.9,
              sub_brand: "All",
            },
            {
              year_value: 2025,
              ac: 5.2,
              ac_vs_ly: 0.6,
              sub_brand: "Beats",
            },
            {
              year_value: 2025,
              ac: 25,
              ac_vs_ly: 2.2,
              sub_brand: "All",
            },
          ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.kpiData.quarterly.datasets).toHaveLength(1);
    expect(result.kpiData.ytd.datasets).toHaveLength(1);
    expect(result.kpiData.yearly.datasets).toHaveLength(1);
    expect(JSON.parse(JSON.stringify(result.kpiData.quarterly.labels))).toEqual(
      ["Q2'24", "Q1'25"],
    );
    expect(
      JSON.parse(JSON.stringify(result.kpiData.quarterly.datasets[0].data)),
    ).toEqual([5.1, 4.9]);
    expect(
      JSON.parse(JSON.stringify(result.kpiData.ytd.datasets[0].data)),
    ).toEqual([4.9, 5.8]);
  });

  it("should return empty=true when all unaided-awareness datasources are empty", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-qtr":
          [],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year":
          [],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-full":
          [],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should fallback to legacy datasource keys", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-qtr":
          [
            {
              quarter: "Q1",
              year: 2024,
              quarter_year_formatted: "Q1'24",
              ac: 4.5,
              comparison: 0.1,
              variation_direction: "up",
              sub_brand: "Beats",
            },
          ],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year":
          [
            {
              year: 2024,
              ac: 4.7,
              comparison: 0.2,
              variation_direction: "up",
              sub_brand: "Beats",
            },
          ],
        "portfolio-brand_brand-analysis_brand-power_unaided-awareness_per-year-full":
          [
            {
              year: 2024,
              ac: 4.7,
              comparison: 0.2,
              variation_direction: "up",
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
});
