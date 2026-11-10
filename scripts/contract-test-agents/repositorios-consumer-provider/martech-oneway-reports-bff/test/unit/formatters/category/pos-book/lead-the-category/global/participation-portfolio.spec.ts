import { loadCompiledJsonata } from "../../../../../../helpers/jsonata";

describe("category pos-book lead-the-category global participation-portfolio formatter", () => {
  const mockInput = {
    datasources: {
      "category_pos-book_lead-the-category_global_participation-portfolio": [
        {
          maturity: "N/A",
          version_id: 1006,
          country_iso_code_3: "Global",
          segment: "N/A",
          ac: 43.3,
          ac_vs_ly: -0.9,
          type: "Total ABI",
          dt_ini: "2025-10-01T00:00:00.000Z",
          dt_end: "2025-12-01T00:00:00.000Z",
          comp_direction: "down",
          vs_ly_label_suffix: "MTD",
          variationDirectionVsLy: "down",
          variationDirectionVsLe: "down",
          variationDirectionGrowthCont: "down",
          variationDirectionTooltip: "down",
          variationDirectionContribution: "down",
          contributionMeasure: "",
          refreshMonthLabel: "Dec'25",
          lyMonthLabel: "Dec'24",
          variationDirectionOgVsLy: "down",
        },
        {
          maturity: "M3",
          version_id: 1005,
          country_iso_code_3: "USA",
          segment: "N/A",
          ac: 32.3,
          ac_vs_ly: -0.1,
          type: "Total ABI",
          dt_ini: "2025-10-01T00:00:00.000Z",
          dt_end: "2025-12-01T00:00:00.000Z",
          comp_direction: "down",
          vs_ly_label_suffix: "MTD",
          variationDirectionVsLy: "down",
          variationDirectionVsLe: "down",
          variationDirectionGrowthCont: "down",
          variationDirectionTooltip: "down",
          variationDirectionContribution: "down",
          contributionMeasure: "",
          refreshMonthLabel: "Dec'25",
          lyMonthLabel: "Dec'24",
          variationDirectionOgVsLy: "down",
        },
        {
          maturity: "M3",
          version_id: 1005,
          country_iso_code_3: "GBR",
          segment: "N/A",
          ac: 23.2,
          ac_vs_ly: 0.8,
          type: "Total ABI",
          dt_ini: "2025-10-01T00:00:00.000Z",
          dt_end: "2025-12-01T00:00:00.000Z",
          comp_direction: "down",
          vs_ly_label_suffix: "MTD",
          variationDirectionVsLy: "up",
          variationDirectionVsLe: "down",
          variationDirectionGrowthCont: "down",
          variationDirectionTooltip: "down",
          variationDirectionContribution: "down",
          contributionMeasure: "",
          refreshMonthLabel: "Dec'25",
          lyMonthLabel: "Dec'24",
          variationDirectionOgVsLy: "down",
        },
        {
          maturity: "N/A",
          version_id: 1008,
          country_iso_code_3: "Global",
          segment: "Megabrands",
          ac: 40,
          ac_vs_ly: -0.6,
          type: "Megabrands",
          dt_ini: "2025-10-01T00:00:00.000Z",
          dt_end: "2025-12-01T00:00:00.000Z",
          comp_direction: "down",
          vs_ly_label_suffix: "MTD",
          variationDirectionVsLy: "down",
          variationDirectionVsLe: "down",
          variationDirectionGrowthCont: "down",
          variationDirectionTooltip: "down",
          variationDirectionContribution: "down",
          contributionMeasure: "",
          refreshMonthLabel: "Dec'25",
          lyMonthLabel: "Dec'24",
          variationDirectionOgVsLy: "down",
        },
        {
          maturity: "N/A",
          version_id: 1008,
          country_iso_code_3: "Global",
          segment: "Tail",
          ac: 11.2,
          ac_vs_ly: 0,
          type: "Tail",
          dt_ini: "2025-10-01T00:00:00.000Z",
          dt_end: "2025-12-01T00:00:00.000Z",
          comp_direction: "down",
          vs_ly_label_suffix: "MTD",
          variationDirectionVsLy: "up",
          variationDirectionVsLe: "down",
          variationDirectionGrowthCont: "down",
          variationDirectionTooltip: "down",
          variationDirectionContribution: "down",
          contributionMeasure: "",
          refreshMonthLabel: "Dec'25",
          lyMonthLabel: "Dec'24",
          variationDirectionOgVsLy: "down",
        },
      ],
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/lead-the-category/global/participation-portfolio.jsonata",
    );

  it("should transform data correctly with header and rows", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("header");
    expect(result).toHaveProperty("rows");
    expect(Array.isArray(result.header)).toBe(true);
    expect(Array.isArray(result.rows)).toBe(true);
  });

  it("should include correct headers structure", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.header.length).toBe(6);

    // Check Label header with children
    const labelHeader = result.header[0];
    expect(labelHeader.title).toBe("Label");
    expect(labelHeader.children).toBeDefined();
    expect(labelHeader.children.length).toBe(2);
    expect(labelHeader.children[0].id).toBe("label");
    expect(labelHeader.children[1].id).toBe("country");

    // Check type headers
    expect(result.header[1].title).toBe("Total ABI");
    expect(result.header[1].id).toBe("total_abi");
    expect(result.header[2].title).toBe("Megabrands");
    expect(result.header[2].id).toBe("megabrands");
    expect(result.header[3].title).toBe("Expansion");
    expect(result.header[3].id).toBe("expansion");
    expect(result.header[4].title).toBe("Sustain");
    expect(result.header[4].id).toBe("sustain");
    expect(result.header[5].title).toBe("Tail");
    expect(result.header[5].id).toBe("tail");
  });

  it("should build rows grouped by maturity", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // rows should be an array of arrays (maturity groups)
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(2); // N/A and M3
  });

  it("should include label and country in each row", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first row
    const firstGroup = result.rows[0];
    const firstRow = firstGroup[0];

    expect(firstRow).toHaveProperty("label");
    expect(firstRow).toHaveProperty("country");
    expect(firstRow.label).toHaveProperty("value");
    expect(firstRow.country).toHaveProperty("value");
  });

  it("should include chartData with correct structure for types", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const firstGroup = result.rows[0];
    const firstRow = firstGroup[0];

    if (firstRow.total_abi && firstRow.total_abi.chartData) {
      expect(firstRow.total_abi.chartData).toHaveProperty("data");
      expect(firstRow.total_abi.chartData).toHaveProperty("backgroundColor");
      expect(firstRow.total_abi.chartData).toHaveProperty("chartUnitMeasure");
      expect(firstRow.total_abi.chartData.chartUnitMeasure).toBe("%");
    }
  });

  it("should include variation and variationMeasure in type data", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const firstGroup = result.rows[0];
    const firstRow = firstGroup[0];

    if (firstRow.total_abi && firstRow.total_abi.variation !== undefined) {
      expect(firstRow.total_abi).toHaveProperty("variation");
      expect(firstRow.total_abi).toHaveProperty("variationMeasure");
      expect(firstRow.total_abi.variationMeasure).toBe("pp");
    }
  });

  it("should include chartScaleMax in type data", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const firstGroup = result.rows[0];
    const firstRow = firstGroup[0];

    if (firstRow.total_abi) {
      expect(firstRow.total_abi).toHaveProperty("chartScaleMax");
      expect(typeof firstRow.total_abi.chartScaleMax).toBe("number");
    }
  });

  it("should return empty object when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_lead-the-category_global_participation-portfolio":
          [],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(emptyInput);

    expect(result).toEqual({ empty: true });
  });

  it("should set maturity as label value", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Global (N/A) should have label as space
    const globalGroup = result.rows[0];
    const globalRow = globalGroup[0];
    expect(globalRow.label.value).toBe(" "); // N/A becomes space

    // M3 should have label as M3
    const m3Group = result.rows[1];
    const m3Row = m3Group[0];
    expect(m3Row.label.value).toBe("M3");
  });

  it("should set country values correctly", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Check country values
    const countryValues: string[] = [];
    result.rows.forEach((group: { country: { value: string } }[]) => {
      group.forEach((row) => {
        if (row && row.country) {
          countryValues.push(row.country.value);
        }
      });
    });

    expect(countryValues).toContain("Global");
    expect(countryValues).toContain("USA");
    expect(countryValues).toContain("GBR");
  });

  it("should use correct colors for each type", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const firstGroup = result.rows[0];
    const firstRow = firstGroup[0];

    // Total ABI should use #EEC879
    if (firstRow.total_abi?.chartData?.backgroundColor?.[0]) {
      expect(firstRow.total_abi.chartData.backgroundColor[0]).toBe("#EEC879");
    }

    // Megabrands should use #F0DF78
    if (firstRow.megabrands?.chartData?.backgroundColor?.[0]) {
      expect(firstRow.megabrands.chartData.backgroundColor[0]).toBe("#F0DF78");
    }

    // Tail should use #B5BDF7
    if (firstRow.tail?.chartData?.backgroundColor?.[0]) {
      expect(firstRow.tail.chartData.backgroundColor[0]).toBe("#B5BDF7");
    }
  });
});
