import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("category pos-book lead-the-category global participation-ranking formatter", () => {
  const mockInput = {
    datasources: {
      "category_pos-book_lead-the-category_global_participation-ranking": [
        {
          country_iso_code_3: "USA",
          brand: "BUDWEISER",
          raw_brand: "BUDWEISER",
          ac: 12.5,
          ac_vs_ly: 0.8,
          abi_comp: "ABI",
          variationDirectionVsLy: "up",
          comp_unit_of_mesure: "pp",
        },
        {
          country_iso_code_3: "USA",
          brand: "CORONA EXTRA",
          raw_brand: "CORONA EXTRA",
          ac: 10.2,
          ac_vs_ly: -0.3,
          abi_comp: "ABI",
          variationDirectionVsLy: "down",
          comp_unit_of_mesure: "pp",
        },
        {
          country_iso_code_3: "USA",
          brand: "HEINEKEN",
          raw_brand: "HEINEKEN",
          ac: 8.7,
          ac_vs_ly: 0,
          abi_comp: "Competition",
          variationDirectionVsLy: "down",
          comp_unit_of_mesure: "pp",
        },
        {
          country_iso_code_3: "GBR",
          brand: "STELLA ARTOIS",
          raw_brand: "STELLA ARTOIS",
          ac: 15.3,
          ac_vs_ly: 1.2,
          abi_comp: "ABI",
          variationDirectionVsLy: "up",
          comp_unit_of_mesure: "pp",
        },
        {
          country_iso_code_3: "KOR",
          brand: "CASS",
          raw_brand: "CASS",
          ac: 14,
          ac_vs_ly: null,
          abi_comp: "ABI",
          variationDirectionVsLy: "up",
          comp_unit_of_mesure: "pp",
        },
      ],
    },
  };

  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/category/pos-book/lead-the-category/global/participation-ranking.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiled = jsonata(expression);
    registerHelpers(compiled);
    return compiled;
  };

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
    // JSONata returns a sequence array (`sequence: true`); normalize for deep equality
    expect(Array.from(result.datasets[0].data)).toEqual([
      "12.5",
      "10.2",
      "8.7",
      "15.3",
      "14.0",
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

  it("should include labels with brand names and country", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.labels.length).toBe(5);

    // Labels should include brand name (Title Case) and country
    expect(result.labels[0]).toContain("Budweiser");
    expect(result.labels[0]).toContain("USA");

    expect(result.labels[3]).toContain("Stella Artois");
    expect(result.labels[3]).toContain("GBR");
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

    // Check first variation (Budweiser: 0.8) — formatted string, one decimal
    expect(variationsData[0].variationsGroup[0].variation).toBe("0.8");

    // Check second variation (Corona Extra: -0.3)
    expect(variationsData[1].variationsGroup[0].variation).toBe("-0.3");

    // Check third variation (Heineken: 0) — number 0 displays as "0.0" via formatNumber
    expect(variationsData[2].variationsGroup[0].variation).toBe("0.0");

    // Check fourth variation (Stella Artois: 1.2)
    expect(variationsData[3].variationsGroup[0].variation).toBe("1.2");
    expect(variationsData[3].variationsGroup[0].unit_of_measure).toBe("pp");

    // Check fifth variation (Cass: 1)
    expect(variationsData[4].variationsGroup[0].variation).toBe("-");
    expect(variationsData[4].variationsGroup[0].unit_of_measure).toBe("");
  });

  it("should return empty object when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_lead-the-category_global_participation-ranking": [],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(emptyInput);

    expect(result).toEqual({ empty: true });
  });

  it("should include direction and unit_of_measure in variations", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const variationsData = result.variation_caption.variationsRows.kpi.data;

    // Check that direction is included (from variationDirectionVsLy)
    expect(variationsData[0].variationsGroup[0]).toHaveProperty("direction");
    expect(variationsData[0].variationsGroup[0].direction).toBe("up");
    expect(variationsData[1].variationsGroup[0].direction).toBe("down");

    expect(variationsData[4].variationsGroup[0].unit_of_measure).toBe("");

    // Check that unit_of_measure is included
    expect(variationsData[0].variationsGroup[0]).toHaveProperty(
      "unit_of_measure",
    );
  });
});
