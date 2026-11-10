import { loadBrandAnalysisFormatter } from "../helpers";

const toArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
};

const normalize = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe("Portfolio Brand Brand Analysis Brand Power Occasion Based Salience formatter", () => {
  const formatter = loadBrandAnalysisFormatter(
    "brand-power/occasion-based-salience.jsonata",
  );

  it("should return empty=true when payload has no canonical datasource", async () => {
    const result: any = await formatter.evaluate({
      view: "portfolio-brand_brand-analysis_brand-power_occasion-based-salience",
      components: [
        {
          id: "occasion-based-salience",
          error:
            "Internal server error. Please try again later. Contact support if the error persists.",
        },
      ],
    });

    expect(result).toEqual({ empty: true });
  });

  it("should return abi chart payload with one dataset and averaged ac by level", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_occasion-based-salience_occasion-based-salience":
          [
            {
              level_4: "Socialize",
              ac: 100,
              ac_vs_ly: 1.1,
              sub_brand: "Brahma",
              raw_brand: "Brahma",
            },
            {
              level_4: "Socialize",
              ac: 110,
              ac_vs_ly: -0.3,
              sub_brand: "Brahma",
              raw_brand: "Brahma",
            },
            {
              level_4: "Relax",
              ac: 80,
              ac_vs_ly: 0.4,
              sub_brand: "Brahma",
              raw_brand: "Brahma",
            },
          ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.datasets).toHaveLength(1);
    expect(normalize(toArray(result.labels))).toEqual(["Socialize", "Relax"]);
    expect(normalize(toArray(result.datasets[0].data))).toEqual([105, 80]);
    expect(
      result.variation_caption.variationsRows.kpi.data[0].variationsGroup,
    ).toHaveLength(2);
    expect(
      result.variation_caption.variationsRows.kpi.data[0].variationsGroup[0]
        .unit_of_measure,
    ).toBe("pp");
    expect(result.paddingTop).toBe(20);
  });

  it("should return competitor chart payload with two datasets using raw_brand lowercase", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_occasion-based-salience_occasion-based-salience":
          [
            {
              level_4: "Meals - OOH",
              ac: 7.6,
              ac_vs_ly: 0.3,
              sub_brand: "All",
              raw_brand: "Brahma",
            },
            {
              level_4: "Meals - OOH",
              ac: 7,
              ac_vs_ly: 0.8,
              sub_brand: "All",
              raw_brand: "Amstel",
            },
            {
              level_4: "Party - OOH",
              ac: 21.1,
              ac_vs_ly: 2.3,
              sub_brand: "All",
              raw_brand: "Brahma",
            },
            {
              level_4: "Party - OOH",
              ac: 20.5,
              ac_vs_ly: 2.9,
              sub_brand: "All",
              raw_brand: "Amstel",
            },
          ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.datasets).toHaveLength(2);
    expect(normalize(toArray(result.datasets[0].data))).toEqual([7.6, 21.1]);
    expect(normalize(toArray(result.datasets[1].data))).toEqual([7, 20.5]);
    expect(
      result.variation_caption.variationsRows.kpi.data[0].variationsGroup,
    ).toHaveLength(2);
  });

  it("should fallback to abi mode when competitor data is not fully pairable", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_occasion-based-salience_occasion-based-salience":
          [
            {
              level_4: "Socialize",
              ac: 100,
              ac_vs_ly: 1.2,
              sub_brand: "All",
              raw_brand: "Brahma",
            },
            {
              level_4: "Socialize",
              ac: 70,
              ac_vs_ly: -0.8,
              sub_brand: "All",
              raw_brand: "Amstel",
            },
            {
              level_4: "Relax",
              ac: 80,
              ac_vs_ly: 0.6,
              sub_brand: "All",
              raw_brand: "Brahma",
            },
          ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.datasets).toHaveLength(1);
    expect(normalize(toArray(result.datasets[0].data))).toEqual([85, 80]);
  });

  it("should not consume legacy datasource key", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "ds_owr_brand-analysis_brand-power_occasion_based_salience": [
          {
            level: "Socialize",
            ac: 95,
            comparison: 0.7,
            variation_direction: "up",
            brand_key: "Brahma",
          },
        ],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should match expected competitor shape for Meals/Party/Relax/Social example", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_occasion-based-salience_occasion-based-salience":
          [
            {
              level_4: "Meals - OOH",
              ac: 7.6,
              ac_vs_ly: 0.3,
              variation_direction: "up",
              raw_brand: "Brahma",
            },
            {
              level_4: "Meals - OOH",
              ac: 7,
              ac_vs_ly: 0.8,
              variation_direction: "up",
              raw_brand: "Amstel",
            },
            {
              level_4: "Party - OOH",
              ac: 21.1,
              ac_vs_ly: 2.3,
              variation_direction: "up",
              raw_brand: "Brahma",
            },
            {
              level_4: "Party - OOH",
              ac: 20.5,
              ac_vs_ly: 2.9,
              variation_direction: "up",
              raw_brand: "Amstel",
            },
            {
              level_4: "Relax family",
              ac: 25.6,
              ac_vs_ly: -0.5,
              variation_direction: "down",
              raw_brand: "Brahma",
            },
            {
              level_4: "Relax family",
              ac: 20.3,
              ac_vs_ly: -1.3,
              variation_direction: "down",
              raw_brand: "Amstel",
            },
            {
              level_4: "Social MG - OOH",
              ac: 26.5,
              ac_vs_ly: -0.5,
              variation_direction: "down",
              raw_brand: "Brahma",
            },
            {
              level_4: "Social MG - OOH",
              ac: 23.7,
              ac_vs_ly: 0,
              variation_direction: "up",
              raw_brand: "Amstel",
            },
          ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.datasets).toHaveLength(2);
    expect(normalize(toArray(result.labels))).toEqual([
      "Meals - OOH",
      "Party - OOH",
      "Relax family",
      "Social MG - OOH",
    ]);
    expect(normalize(toArray(result.datasets[0].data))).toEqual([
      7.6, 21.1, 25.6, 26.5,
    ]);
    expect(normalize(toArray(result.datasets[1].data))).toEqual([
      7, 20.5, 20.3, 23.7,
    ]);
    expect(result.paddingTop).toBe(20);
    expect(
      result.variation_caption.variationsRows.kpi.data[3].variationsGroup[1]
        .direction,
    ).toBe("up");
  });
});
