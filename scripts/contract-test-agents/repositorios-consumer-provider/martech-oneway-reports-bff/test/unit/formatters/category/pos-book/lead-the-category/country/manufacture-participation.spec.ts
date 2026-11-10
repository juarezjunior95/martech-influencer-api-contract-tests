import { loadCompiledJsonata } from "../../../../../../helpers/jsonata";

describe("category pos-book lead-the-category country manufacture-participation formatter", () => {
  const mockInput = {
    datasources: {
      "category_pos-book_lead-the-category_country_manufacture-participation": [
        {
          maturity: "M3",
          country_iso_code_3: "USA",
          manufacturer: "abi_beer",
          ac: 45.5,
          ac_vs_ly: 1.2,
          gender: "Overall",
          age: "Overall",
          socio_economic_level: "Overall",
          type: "Overall",
        },
        {
          maturity: "M2",
          country_iso_code_3: "USA",
          manufacturer: "core_co",
          ac: 28.3,
          ac_vs_ly: -0.8,
          gender: "Male",
          age: "25-34",
          socio_economic_level: "High Income",
          type: "Male",
        },
        {
          maturity: "M3",
          country_iso_code_3: "USA",
          manufacturer: "premium_co",
          ac: 15.2,
          ac_vs_ly: 0.5,
          gender: "Female",
          age: "35-44",
          socio_economic_level: "Medium Income",
          type: "Female",
        },
        {
          maturity: "M1",
          country_iso_code_3: "USA",
          manufacturer: "beer",
          ac: 100,
          ac_vs_ly: 0,
          gender: "Overall",
          age: "LDA - 24",
          socio_economic_level: "Low Income",
          type: "LDA - 24",
        },
      ],
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/lead-the-category/country/manufacture-participation.jsonata",
    );

  it("should transform data correctly with header and rows", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("header");
    expect(result).toHaveProperty("rows");
    expect(Array.isArray(result.header)).toBe(true);
    expect(Array.isArray(result.rows)).toBe(true);
  });

  it("should include correct headers structure with manufacturers", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // First header is Label with children
    expect(result.header[0].title).toBe("Label");
    expect(result.header[0].children).toBeDefined();
    expect(result.header[0].children[0].id).toBe("label");

    // Other headers are manufacturers
    const manufacturerHeaders = result.header.slice(1);
    manufacturerHeaders.forEach((header: { id: string; title: string }) => {
      expect(header).toHaveProperty("id");
      expect(header).toHaveProperty("title");
    });
  });

  it("should build rows grouped by cohort", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // rows should be an array of arrays (groups)
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(4); // 4 groups: Overall, Gender, Age, Income
  });

  it("should include label in each row", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-null row
    let firstRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row) {
          firstRow = row;
          break;
        }
      }
      if (firstRow) break;
    }

    if (firstRow) {
      expect(firstRow).toHaveProperty("label");
      expect(firstRow.label).toHaveProperty("value");
      expect(firstRow.label.noChart).toBe(true);
      expect(firstRow.label.merge).toBe(true);
    }
  });

  it("should include chartData for manufacturers", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-null row
    let firstRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row) {
          firstRow = row;
          break;
        }
      }
      if (firstRow) break;
    }

    if (firstRow) {
      // Find a manufacturer key
      const manufacturerKey = Object.keys(firstRow).find(
        (key) => key !== "label" && key.startsWith("manufacturer_"),
      );

      if (manufacturerKey && firstRow[manufacturerKey].chartData) {
        expect(firstRow[manufacturerKey].chartData).toHaveProperty("data");
        expect(firstRow[manufacturerKey].chartData).toHaveProperty(
          "backgroundColor",
        );
        expect(firstRow[manufacturerKey].chartData).toHaveProperty(
          "chartUnitMeasure",
        );
        expect(firstRow[manufacturerKey].chartData.chartUnitMeasure).toBe("%");
      }
    }
  });

  it("should include variation data in manufacturer cells", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-null row
    let firstRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row) {
          firstRow = row;
          break;
        }
      }
      if (firstRow) break;
    }

    if (firstRow) {
      const manufacturerKey = Object.keys(firstRow).find(
        (key) => key !== "label" && key.startsWith("manufacturer_"),
      );

      if (manufacturerKey) {
        expect(firstRow[manufacturerKey]).toHaveProperty("variation");
        expect(firstRow[manufacturerKey]).toHaveProperty("variationMeasure");
        expect(firstRow[manufacturerKey].variationMeasure).toBe("pp");
      }
    }
  });

  it("should include chartScaleMax in manufacturer cells", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-null row
    let firstRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row) {
          firstRow = row;
          break;
        }
      }
      if (firstRow) break;
    }

    if (firstRow) {
      const manufacturerKey = Object.keys(firstRow).find(
        (key) => key !== "label" && key.startsWith("manufacturer_"),
      );

      if (manufacturerKey) {
        expect(firstRow[manufacturerKey]).toHaveProperty("chartScaleMax");
      }
    }
  });

  it("should return empty object when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_lead-the-category_country_manufacture-participation":
          [],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(emptyInput);

    expect(result).toEqual({ empty: true });
  });

  it("should return null for groups without data", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Check that some groups have null rows
    const hasNullItems = result.rows.some((group: unknown[]) =>
      group.some((item) => item === null),
    );
    expect(hasNullItems).toBe(true);
  });

  it("should use correct colors based on manufacturer name", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-null row
    let firstRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row) {
          firstRow = row;
          break;
        }
      }
      if (firstRow) break;
    }

    if (firstRow) {
      const manufacturerKey = Object.keys(firstRow).find(
        (key) => key !== "label" && key.startsWith("manufacturer_"),
      );

      if (manufacturerKey && firstRow[manufacturerKey].chartData) {
        // Color should be one of the defined colors
        const validColors = [
          "#C9D1D6",
          "#F0DF78",
          "#A1E3BC",
          "#A1CFF4",
          "#B5BDF7",
        ];
        expect(
          validColors.includes(
            firstRow[manufacturerKey].chartData.backgroundColor,
          ),
        ).toBe(true);
      }
    }
  });
});
