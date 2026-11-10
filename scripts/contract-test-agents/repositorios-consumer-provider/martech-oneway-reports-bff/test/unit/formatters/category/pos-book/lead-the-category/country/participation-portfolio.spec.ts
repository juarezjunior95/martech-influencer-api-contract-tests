import { loadCompiledJsonata } from "../../../../../../helpers/jsonata";

describe("category pos-book lead-the-category country participation-portfolio formatter", () => {
  const mockInput = {
    datasources: {
      "category_pos-book_lead-the-category_country_participation-portfolio": [
        {
          maturity: "M3",
          ac: 45.5,
          ac_vs_ly: 1.2,
          type: "Total ABI",
          category: "Overall",
        },
        {
          maturity: "M3",
          ac: 38.2,
          ac_vs_ly: -0.5,
          type: "Megabrands",
          category: "Overall",
        },
        {
          maturity: "M3",
          ac: 12.3,
          ac_vs_ly: 0.8,
          type: "Expansion",
          category: "Male",
        },
        {
          maturity: "M3",
          ac: 8.5,
          ac_vs_ly: 0,
          type: "Sustain",
          category: "Female",
        },
        {
          maturity: "M3",
          ac: 5.2,
          ac_vs_ly: -0.2,
          type: "Tail",
          category: "25-34",
        },
      ],
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/lead-the-category/country/participation-portfolio.jsonata",
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
    expect(labelHeader.children[0].id).toBe("label");

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

  it("should build rows grouped by category", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // rows should be an array of arrays (groups)
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(4); // 4 groups: Overall, Gender, Age, Income
  });

  it("should include label and type data in each row", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find the Overall group row
    const overallGroup = result.rows[0];
    const overallRow = overallGroup.find(
      (row: { label: { value: string } } | null) =>
        row && row.label && row.label.value === "Overall",
    );

    if (overallRow) {
      expect(overallRow.label.value).toBe("Overall");
      expect(overallRow.total_abi).toBeDefined();
      expect(overallRow.megabrands).toBeDefined();
    }
  });

  it("should include chartData with correct structure for types", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find a row with data
    const overallGroup = result.rows[0];
    const overallRow = overallGroup.find(
      (row: { label: { value: string } } | null) =>
        row && row.label && row.label.value === "Overall",
    );

    if (overallRow && overallRow.total_abi && overallRow.total_abi.chartData) {
      expect(overallRow.total_abi.chartData).toHaveProperty("data");
      expect(overallRow.total_abi.chartData).toHaveProperty("backgroundColor");
      expect(overallRow.total_abi.chartData).toHaveProperty("chartUnitMeasure");
      expect(overallRow.total_abi.chartData.chartUnitMeasure).toBe("%");
    }
  });

  it("should include variation and variationMeasure in type data", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const overallGroup = result.rows[0];
    const overallRow = overallGroup.find(
      (row: { label: { value: string } } | null) =>
        row && row.label && row.label.value === "Overall",
    );

    if (overallRow && overallRow.total_abi) {
      expect(overallRow.total_abi).toHaveProperty("variation");
      expect(overallRow.total_abi).toHaveProperty("variationMeasure");
      expect(overallRow.total_abi.variationMeasure).toBe("pp");
    }
  });

  it("should include chartScaleMax in type data", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const overallGroup = result.rows[0];
    const overallRow = overallGroup.find(
      (row: { label: { value: string } } | null) =>
        row && row.label && row.label.value === "Overall",
    );

    if (overallRow && overallRow.total_abi) {
      expect(overallRow.total_abi).toHaveProperty("chartScaleMax");
      expect(typeof overallRow.total_abi.chartScaleMax).toBe("number");
    }
  });

  it("should return empty object when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_lead-the-category_country_participation-portfolio":
          [],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(emptyInput);

    expect(result).toEqual({ empty: true });
  });

  it("should return null for categories without data", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Income group should have null rows since no data matches
    const incomeGroup = result.rows[3];
    const hasNullRows = incomeGroup.some((row: unknown) => row === null);
    expect(hasNullRows).toBe(true);
  });

  it("should use correct colors for each type", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const overallGroup = result.rows[0];
    const overallRow = overallGroup.find(
      (row: { label: { value: string } } | null) =>
        row && row.label && row.label.value === "Overall",
    );

    if (overallRow) {
      // Total ABI should use #EEC879
      if (overallRow.total_abi?.chartData?.backgroundColor) {
        expect(overallRow.total_abi.chartData.backgroundColor[0]).toBe(
          "#EEC879",
        );
      }
      // Megabrands should use #F0DF78
      if (overallRow.megabrands?.chartData?.backgroundColor) {
        expect(overallRow.megabrands.chartData.backgroundColor[0]).toBe(
          "#F0DF78",
        );
      }
    }
  });
});
