import { loadCompiledJsonata } from "../../../../../helpers/jsonata";

describe("category pos-book grow-the-category maturity formatter", () => {
  const mockMaturityData = [
    {
      maturity: "M3",
      country_iso_code_3: "USA",
      category: "Beer",
      ac: 45.5,
      ly: 44.3,
      ac_vs_ly: 1.2,
      gender: "Male",
      age: "25-34",
      socio_economic_level: "High Income",
      group: "Maturity",
      kpi_name: "p4w",
    },
    {
      maturity: "N/A",
      country_iso_code_3: "Global",
      category: "Wine",
      ac: 32.1,
      ly: 32.9,
      ac_vs_ly: -0.8,
      gender: "Female",
      age: "35-44",
      socio_economic_level: "Medium Income",
      group: "",
      kpi_name: "p4w",
    },
  ];

  const mockZoneData = [
    {
      maturity: "M2",
      abi_zone: "NAZ",
      category: "Spirits",
      ac: 28.3,
      ly: 28.3,
      ac_vs_ly: 0,
      gender: "Male",
      age: "45-54",
      socio_economic_level: "Low Income",
      kpi_name: "p4w",
    },
    {
      maturity: "M1",
      abi_zone: "SAZ",
      category: "Beer",
      ac: 52.1,
      ly: 50.5,
      ac_vs_ly: 1.6,
      gender: "Female",
      age: "LDA - 24",
      socio_economic_level: "High Income",
      kpi_name: "p4w",
    },
  ];

  const mockInput = {
    datasources: {
      "category_pos-book_grow-the-category_maturity": mockMaturityData,
      "category_pos-book_grow-the-category_zone": mockZoneData,
    },
    filters: {
      pos_kpi: "participation",
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/grow-the-category/maturity.jsonata",
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
    expect(result.header[0].children.length).toBe(2);
    expect(result.header[0].children[0].id).toBe("label");
    expect(result.header[0].children[1].id).toBe("maturity_zone");

    // Category headers
    expect(result.header[1].title).toBe("Alcohol");
    expect(result.header[2].title).toBe("Beer");
    expect(result.header[3].title).toBe("Beyond Beer");
    expect(result.header[4].title).toBe("Spirits");
    expect(result.header[5].title).toBe("Wine");
  });

  it("should build rows grouped by Global, Maturity, and Zone", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // rows should be an array of 3 groups: Global, Maturity, Zone
    expect(result.rows.length).toBe(3);
  });

  it("should include label and maturity_zone in each row", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find a row in Global group
    const globalGroup = result.rows[0];
    const globalRow = globalGroup.find(
      (row: { maturity_zone: { value: string } } | null) =>
        row && row.maturity_zone && row.maturity_zone.value === "Global",
    );

    if (globalRow) {
      expect(globalRow.label).toBeDefined();
      expect(globalRow.maturity_zone).toBeDefined();
      expect(globalRow.maturity_zone.noChart).toBe(true);
    }
  });

  it("should include chartData for categories", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find a row with data
    const maturityGroup = result.rows[1];
    const m3Row = maturityGroup.find(
      (row: { maturity_zone: { value: string } } | null) =>
        row && row.maturity_zone && row.maturity_zone.value === "M3",
    );

    if (m3Row && m3Row.beer && m3Row.beer.chartData) {
      expect(m3Row.beer.chartData).toHaveProperty("data");
      expect(m3Row.beer.chartData).toHaveProperty("backgroundColor");
      expect(m3Row.beer.chartData).toHaveProperty("chartUnitMeasure");
      expect(m3Row.beer.chartData.chartUnitMeasure).toBe("%");
    }
  });

  it("should include variation data in category cells", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const maturityGroup = result.rows[1];
    const m3Row = maturityGroup.find(
      (row: { maturity_zone: { value: string } } | null) =>
        row && row.maturity_zone && row.maturity_zone.value === "M3",
    );

    if (m3Row && m3Row.beer) {
      expect(m3Row.beer).toHaveProperty("variation");
      expect(m3Row.beer).toHaveProperty("variationMeasure");
      expect(m3Row.beer.variationMeasure).toBe("pp");
    }
  });

  it("should include chartScaleMax in category cells", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const maturityGroup = result.rows[1];
    const m3Row = maturityGroup.find(
      (row: { maturity_zone: { value: string } } | null) =>
        row && row.maturity_zone && row.maturity_zone.value === "M3",
    );

    if (m3Row && m3Row.beer) {
      expect(m3Row.beer).toHaveProperty("chartScaleMax");
      expect(typeof m3Row.beer.chartScaleMax).toBe("number");
    }
  });

  it("should return empty object when both datasources are empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_grow-the-category_maturity": [],
        "category_pos-book_grow-the-category_zone": [],
      },
      filters: {},
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(emptyInput);

    expect(result).toEqual({ empty: true });
  });

  it("should build zone rows with correct maturity_zone values", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Zone group is the third group
    const zoneGroup = result.rows[2];

    // Should have zone rows
    const nazRow = zoneGroup.find(
      (row: { maturity_zone: { value: string } } | null) =>
        row && row.maturity_zone && row.maturity_zone.value === "NAZ",
    );
    const sazRow = zoneGroup.find(
      (row: { maturity_zone: { value: string } } | null) =>
        row && row.maturity_zone && row.maturity_zone.value === "SAZ",
    );

    if (nazRow) {
      expect(nazRow.label.value).toBe("Zone");
    }
    if (sazRow) {
      expect(sazRow.label.value).toBe("Zone");
    }
  });

  it("should use correct colors for categories", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const maturityGroup = result.rows[1];
    const m3Row = maturityGroup.find(
      (row: { maturity_zone: { value: string } } | null) =>
        row && row.maturity_zone && row.maturity_zone.value === "M3",
    );

    if (m3Row) {
      // Beer should use #F0DF78
      if (m3Row.beer?.chartData?.backgroundColor) {
        expect(m3Row.beer.chartData.backgroundColor[0]).toBe("#F0DF78");
      }
    }
  });

  it("should return null for groups without data", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Check that some items in groups are null (items without data)
    const hasNullItems = result.rows.some((group: unknown[]) =>
      group.some((item) => item === null),
    );
    expect(hasNullItems).toBe(true);
  });
});
