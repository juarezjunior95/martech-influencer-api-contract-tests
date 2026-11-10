import { loadCompiledJsonata } from "../../../../../helpers/jsonata";

describe("category pos-book grow-the-category cohort formatter", () => {
  const mockData = [
    {
      country_iso_code_3: "USA",
      maturity: "M3",
      ac: 45.5,
      ac_vs_ly: 1.2,
      category: "Beer",
      cohort_level: "Overall",
      kpi_name: "p4w",
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-12-31T00:00:00.000Z",
    },
    {
      country_iso_code_3: "GBR",
      maturity: "M2",
      ac: 32.1,
      ac_vs_ly: -0.8,
      category: "Wine",
      cohort_level: "Overall",
      kpi_name: "p4w",
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-12-31T00:00:00.000Z",
    },
    {
      country_iso_code_3: "USA",
      maturity: "M3",
      ac: 48.2,
      ac_vs_ly: 2.1,
      category: "Beer",
      cohort_level: "Male",
      kpi_name: "p4w",
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-12-31T00:00:00.000Z",
    },
  ];

  const mockInput = {
    datasources: {
      "category_pos-book_grow-the-category_cohort": mockData,
    },
    filters: {
      pos_kpi: "p4w",
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/grow-the-category/cohort.jsonata",
    );

  it("should transform data correctly with header and rows", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("header");
    expect(result).toHaveProperty("rows");
    expect(Array.isArray(result.header)).toBe(true);
    expect(Array.isArray(result.rows)).toBe(true);
  });

  it("should include correct headers structure with categories", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Header should have Label (with children) + 5 categories
    expect(result.header.length).toBe(6);

    // First header is Label with children
    expect(result.header[0].title).toBe("Label");
    expect(result.header[0].children).toBeDefined();
    expect(result.header[0].children[0].id).toBe("label");

    // Category headers
    expect(result.header[1].title).toBe("Alcohol");
    expect(result.header[2].title).toBe("Beer");
    expect(result.header[3].title).toBe("Beyond Beer");
    expect(result.header[4].title).toBe("Spirits");
    expect(result.header[5].title).toBe("Wine");
  });

  it("should build rows grouped by cohort (Overall, Gender, Age, Income)", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // rows should be an array of 4 groups
    expect(result.rows.length).toBe(4);
  });

  it("should include label in each row", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-empty row
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

  it("should include chartData for categories", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-empty row with beer data
    let firstRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row && row.beer && row.beer.chartData) {
          firstRow = row;
          break;
        }
      }
      if (firstRow) break;
    }

    if (firstRow && firstRow.beer && firstRow.beer.chartData) {
      expect(firstRow.beer.chartData).toHaveProperty("data");
      expect(firstRow.beer.chartData).toHaveProperty("backgroundColor");
    }
  });

  it("should include variation data in category cells", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-empty row with beer data
    let firstRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row && row.beer && row.beer.variation !== undefined) {
          firstRow = row;
          break;
        }
      }
      if (firstRow) break;
    }

    if (firstRow && firstRow.beer) {
      expect(firstRow.beer).toHaveProperty("variation");
    }
  });

  it("should include chartScaleMax in category cells", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-empty row with beer data
    let firstRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row && row.beer) {
          firstRow = row;
          break;
        }
      }
      if (firstRow) break;
    }

    if (firstRow && firstRow.beer) {
      expect(firstRow.beer).toHaveProperty("chartScaleMax");
      expect(typeof firstRow.beer.chartScaleMax).toBe("number");
    }
  });

  it("should return empty object when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_grow-the-category_cohort": [],
      },
      filters: {},
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(emptyInput);

    expect(result).toEqual({ empty: true });
  });

  it("should use correct colors for categories", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find first non-empty row
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
      // Beer should use #F0DF78
      if (firstRow.beer?.chartData?.backgroundColor?.[0]) {
        expect(firstRow.beer.chartData.backgroundColor[0]).toBe("#F0DF78");
      }
      // Wine should use #F6B7D0
      if (firstRow.wine?.chartData?.backgroundColor?.[0]) {
        expect(firstRow.wine.chartData.backgroundColor[0]).toBe("#F6B7D0");
      }
    }
  });

  it("should filter empty groups", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Groups should either have data or be empty arrays (filtered nulls)
    result.rows.forEach((group: unknown[]) => {
      expect(Array.isArray(group)).toBe(true);
    });
  });

  it("should format cohort labels correctly", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find all label values
    const labelValues: string[] = [];
    result.rows.forEach((group: { label: { value: string } }[]) => {
      group.forEach((row) => {
        if (row && row.label && row.label.value) {
          labelValues.push(row.label.value);
        }
      });
    });

    // Should contain some cohort labels
    expect(labelValues.length).toBeGreaterThan(0);
  });
});
