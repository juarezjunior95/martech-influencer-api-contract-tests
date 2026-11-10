import { loadCompiledJsonata } from "../../../../../../helpers/jsonata";

describe("category pos-book lead-the-category country participation-ranking formatter", () => {
  const mockInput = {
    datasources: {
      "category_pos-book_lead-the-category_country_participation-ranking": [
        {
          country_iso_code_3: "USA",
          brand: "BUDWEISER",
          raw_brand: "BUDWEISER",
          ac: 12.5,
          ac_vs_ly: 0.8,
          comp_unit_of_measure: "pp",
          abi_comp: "ABI",
          variationDirectionVsLy: "up",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
        {
          country_iso_code_3: "USA",
          brand: "CORONA EXTRA",
          raw_brand: "CORONA EXTRA",
          ac: 10.2,
          ac_vs_ly: -0.3,
          comp_unit_of_measure: "pp",
          abi_comp: "ABI",
          variationDirectionVsLy: "down",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
        {
          country_iso_code_3: "USA",
          brand: "HEINEKEN",
          raw_brand: "HEINEKEN",
          ac: 8.7,
          ac_vs_ly: 0,
          comp_unit_of_measure: "pp",
          abi_comp: "Competition",
          variationDirectionVsLy: "down",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
        {
          country_iso_code_3: "USA",
          brand: "STELLA ARTOIS",
          raw_brand: "STELLA ARTOIS",
          ac: 15.3,
          ac_vs_ly: 1.2,
          comp_unit_of_measure: "pp",
          abi_comp: "ABI",
          variationDirectionVsLy: "up",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
        {
          country_iso_code_3: "CAN",
          brand: "MOLSON",
          raw_brand: "MOLSON",
          ac: 5,
          ac_vs_ly: -1,
          comp_unit_of_measure: "pp",
          abi_comp: "ABI",
          variationDirectionVsLy: "down",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
      ],
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/lead-the-category/country/participation-ranking.jsonata",
    );

  it("should transform data correctly with datasets, labels, and variation_caption", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("datasets");
    expect(result).toHaveProperty("labels");
    expect(result).toHaveProperty("variation_caption");
    expect(Array.isArray(result.datasets)).toBe(true);
    expect(Array.isArray(result.labels)).toBe(true);
  });

  it("should include datasets with data, unitMeasure, and source", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.datasets.length).toBe(3);

    // First dataset should have data (ac values)
    expect(result.datasets[0]).toHaveProperty("data");
    expect(Array.from(result.datasets[0].data)).toEqual([
      "12.5",
      "10.2",
      "8.7",
      "15.3",
      "5.0",
    ]);

    // Second dataset should have unitMeasure
    expect(result.datasets[1]).toHaveProperty("unitMeasure");
    expect(result.datasets[1].unitMeasure.length).toBe(5);
    result.datasets[1].unitMeasure.forEach((unit: string) => {
      expect(unit).toBe("%");
    });

    // Third dataset should have source (abi_comp)
    expect(result.datasets[2]).toHaveProperty("source");
    expect(result.datasets[2].source).toEqual([
      "ABI",
      "ABI",
      "Competition",
      "ABI",
      "ABI",
    ]);
  });

  it("should include labels with brand names in Title Case", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.labels.length).toBe(5);
    expect(result.labels[0]).toContain("Budweiser");
    expect(result.labels[1]).toContain("Corona Extra");
    expect(result.labels[2]).toContain("Heineken");
    expect(result.labels[3]).toContain("Stella Artois");
  });

  it("should include variation_caption with correct structure", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.variation_caption).toHaveProperty("title");
    expect(result.variation_caption).toHaveProperty("subtitle");
    expect(result.variation_caption).toHaveProperty("variationsRows");

    expect(result.variation_caption.title).toBe("Comparison");
    expect(result.variation_caption.subtitle).toBe("Vs LY");
  });

  it("should include variations in variationsRows", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const variationsData = result.variation_caption.variationsRows.kpi.data;

    expect(Array.isArray(variationsData)).toBe(true);
    expect(variationsData.length).toBe(5);

    // Check first variation (Budweiser: 0.8)
    expect(variationsData[0].variationsGroup[0].variation).toBe("0.8");
    expect(variationsData[0].variationsGroup[0].unit_of_measure).toBe("pp");

    // Check second variation (Corona Extra: -0.3)
    expect(variationsData[1].variationsGroup[0].variation).toBe("-0.3");

    // Check third variation (Heineken: 0)
    expect(variationsData[2].variationsGroup[0].variation).toBe("0.0");

    // Check fourth variation (Stella Artois: 1.2)
    expect(variationsData[3].variationsGroup[0].variation).toBe("1.2");

    // Check fifth variation (Molson: -1)
    expect(variationsData[4].variationsGroup[0].variation).toBe("-1.0");
    expect(variationsData[4].variationsGroup[0].unit_of_measure).toBe("pp");
  });

  it("should return empty object when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_lead-the-category_country_participation-ranking": [],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(emptyInput);

    expect(result).toEqual({ empty: true });
  });

  it("should include direction in variations when available", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const variationsData = result.variation_caption.variationsRows.kpi.data;

    // Check that direction is included (from variationDirectionVsLy)
    expect(variationsData[0].variationsGroup[0]).toHaveProperty("direction");
    expect(variationsData[0].variationsGroup[0].direction).toBe("up");
    expect(variationsData[1].variationsGroup[0].direction).toBe("down");
  });
});
