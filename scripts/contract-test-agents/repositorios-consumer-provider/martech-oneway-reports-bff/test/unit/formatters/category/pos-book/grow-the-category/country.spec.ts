import { loadCompiledJsonata } from "../../../../../helpers/jsonata";

describe("category pos-book grow-the-category country formatter", () => {
  const mockInput = {
    datasources: {
      "category_pos-book_grow-the-category_country": [
        {
          country_iso_code_3: "USA",
          maturity: "M3",
          ac: 45.5,
          ac_vs_ly: 1.2,
          category: "Beer",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
        {
          country_iso_code_3: "GBR",
          maturity: "M2",
          ac: 32.1,
          ac_vs_ly: -0.8,
          category: "Wine",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
        {
          country_iso_code_3: "BRA",
          maturity: "M1",
          ac: 28.3,
          ac_vs_ly: 0,
          category: "Spirits",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
      ],
    },
    filters: {
      pos_kpi: "occasion",
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/grow-the-category/country.jsonata",
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

    // First header is Label with children (label, country)
    expect(result.header[0].title).toBe("Label");
    expect(result.header[0].children).toBeDefined();
    expect(result.header[0].children.length).toBe(2);
    expect(result.header[0].children[0].id).toBe("label");
    expect(result.header[0].children[1].id).toBe("country");

    // Other headers are categories with backgroundColor
    const categoryHeaders = result.header.slice(1);
    categoryHeaders.forEach(
      (header: { title: string; id: string; backgroundColor: string }) => {
        expect(header).toHaveProperty("title");
        expect(header).toHaveProperty("id");
        expect(header).toHaveProperty("backgroundColor");
      },
    );
  });

  it("should build rows grouped by maturity", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // rows should be an array of arrays (maturity groups)
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(3); // M3, M2, M1
  });

  it("should include label and country in each row", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find a row in first maturity group
    const firstGroup = result.rows[0];
    const row = firstGroup[0];

    expect(row).toHaveProperty("label");
    expect(row).toHaveProperty("country");
    expect(row.label).toHaveProperty("value");
    expect(row.label).toHaveProperty("noChart");
    expect(row.label.noChart).toBe(true);
    expect(row.label.merge).toBe(true);
    expect(row.country.noChart).toBe(true);
  });

  it("should include chartData for categories", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const firstGroup = result.rows[0];
    const row = firstGroup[0];

    // Find a category key that exists (beer, wine, spirits)
    const categoryKey = Object.keys(row).find(
      (key) => key !== "label" && key !== "country",
    );

    if (categoryKey && row[categoryKey].chartData) {
      expect(row[categoryKey].chartData).toHaveProperty("data");
      expect(row[categoryKey].chartData).toHaveProperty("backgroundColor");
      expect(row[categoryKey].chartData).toHaveProperty("chartUnitMeasure");
    }
  });

  it("should include variation data in category cells", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const firstGroup = result.rows[0];
    const row = firstGroup[0];

    const categoryKey = Object.keys(row).find(
      (key) => key !== "label" && key !== "country",
    );

    if (categoryKey) {
      expect(row[categoryKey]).toHaveProperty("variation");
      expect(row[categoryKey]).toHaveProperty("variationMeasure");
    }
  });

  it("should include chartScaleMax in category cells", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const firstGroup = result.rows[0];
    const row = firstGroup[0];

    const categoryKey = Object.keys(row).find(
      (key) => key !== "label" && key !== "country",
    );

    if (categoryKey) {
      expect(row[categoryKey]).toHaveProperty("chartScaleMax");
      expect(typeof row[categoryKey].chartScaleMax).toBe("number");
    }
  });

  it("should return empty object when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_grow-the-category_country": [],
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

    const firstGroup = result.rows[0];
    const row = firstGroup[0];

    // Check that backgroundColor is set correctly
    if (row.beer && row.beer.chartData) {
      expect(row.beer.chartData.backgroundColor[0]).toBe("#F0DF78");
    }
    if (row.wine && row.wine.chartData) {
      expect(row.wine.chartData.backgroundColor[0]).toBe("#F6B7D0");
    }
    if (row.spirits && row.spirits.chartData) {
      expect(row.spirits.chartData.backgroundColor[0]).toBe("#A1CFF4");
    }
  });

  it("should set maturity as label value", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Check that maturity values are used as labels
    const maturityValues = result.rows.map(
      (group: { label: { value: string } }[]) => group[0]?.label?.value,
    );

    expect(maturityValues).toContain("M3");
    expect(maturityValues).toContain("M2");
    expect(maturityValues).toContain("M1");
  });

  it("should set country values correctly", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find all country values across rows
    const countryValues: string[] = [];
    result.rows.forEach((group: { country: { value: string } }[]) => {
      group.forEach((row) => {
        if (row && row.country) {
          countryValues.push(row.country.value);
        }
      });
    });

    expect(countryValues).toContain("USA");
    expect(countryValues).toContain("GBR");
    expect(countryValues).toContain("BRA");
  });
});
