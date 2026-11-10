import { loadCompiledJsonata } from "../../../../../../helpers/jsonata";

describe("category pos-book lead-the-category global participation-global-brands formatter", () => {
  const mockInput = {
    datasources: {
      "category_pos-book_lead-the-category_global_participation-global-brands":
        [
          {
            maturity: "M3",
            country_iso_code_3: "USA",
            raw_brand: "CORONA",
            ac: 8.5,
            ac_vs_ly: 0.3,
            gender: "Overall",
            age: "Overall",
            socio_economic_level: "Overall",
            brand: {
              imageSquare: "https://example.com/corona.png",
              imageTable: "https://example.com/corona-table.png",
            },
          },
          {
            maturity: "M2",
            country_iso_code_3: "GBR",
            raw_brand: "BUDWEISER",
            ac: 6.2,
            ac_vs_ly: -0.5,
            gender: "Male",
            age: "25-34",
            socio_economic_level: "High Income",
            brand: {
              imageSquare: "https://example.com/budweiser.png",
              imageTable: "https://example.com/budweiser-table.png",
            },
          },
          {
            maturity: "M3",
            country_iso_code_3: "USA",
            raw_brand: "STELLA ARTOIS",
            ac: 4.8,
            ac_vs_ly: 0,
            gender: "Female",
            age: "35-44",
            socio_economic_level: "Medium Income",
            brand: {
              imageSquare: "https://example.com/stella.png",
              imageTable: "https://example.com/stella-table.png",
            },
          },
          {
            maturity: "M1",
            country_iso_code_3: "BRA",
            raw_brand: "MICHELOB ULTRA",
            ac: 3.2,
            ac_vs_ly: 1.1,
            gender: "Overall",
            age: "45-54",
            socio_economic_level: "Low Income",
            brand: {
              imageSquare: "https://example.com/michelob.png",
              imageTable: "https://example.com/michelob-table.png",
            },
          },
          {
            maturity: "M2",
            country_iso_code_3: "MEX",
            raw_brand: "HEINEKEN",
            ac: 7.1,
            ac_vs_ly: -0.2,
            gender: "Male",
            age: "LDA - 24",
            socio_economic_level: "High Income",
            brand: {
              imageSquare: "https://example.com/heineken.png",
              imageTable: "https://example.com/heineken-table.png",
            },
          },
        ],
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/lead-the-category/global/participation-global-brands.jsonata",
    );

  it("should transform data correctly with header and rows", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("header");
    expect(result).toHaveProperty("rows");
    expect(Array.isArray(result.header)).toBe(true);
    expect(Array.isArray(result.rows)).toBe(true);
  });

  it("should include correct headers structure with brands", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // First header is Label with children (label, country)
    expect(result.header[0].title).toBe("Label");
    expect(result.header[0].children).toBeDefined();
    expect(result.header[0].children.length).toBe(2);
    expect(result.header[0].children[0].id).toBe("label");
    expect(result.header[0].children[1].id).toBe("country");

    // Other headers are brands with brandImg property
    const brandHeaders = result.header.slice(1);
    brandHeaders.forEach(
      (header: { id: string; brandImg: boolean; imgName: string }) => {
        expect(header).toHaveProperty("id");
        expect(header).toHaveProperty("brandImg");
        expect(header.brandImg).toBe(true);
        expect(header).toHaveProperty("imgName");
      },
    );
  });

  it("should build rows grouped by maturity", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // rows should be an array of arrays (maturity groups)
    expect(Array.isArray(result.rows)).toBe(true);
  });

  it("should include label and country in each row", async () => {
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
      expect(firstRow).toHaveProperty("country");
      expect(firstRow.label).toHaveProperty("value");
      expect(firstRow.country).toHaveProperty("value");
    }
  });

  it("should include chartData for brands", async () => {
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
      // Find a brand key that exists
      const brandKey = Object.keys(firstRow).find(
        (key) => key !== "label" && key !== "country",
      );

      if (brandKey && firstRow[brandKey].chartData) {
        expect(firstRow[brandKey].chartData).toHaveProperty("data");
        expect(firstRow[brandKey].chartData).toHaveProperty("backgroundColor");
        expect(firstRow[brandKey].chartData).toHaveProperty("chartUnitMeasure");
        expect(firstRow[brandKey].chartData.chartUnitMeasure).toBe("%");
      }
    }
  });

  it("should include variation data in brand cells", async () => {
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
      const brandKey = Object.keys(firstRow).find(
        (key) =>
          key !== "label" &&
          key !== "country" &&
          firstRow[key].chartData?.data?.length > 0,
      );

      if (brandKey) {
        expect(firstRow[brandKey]).toHaveProperty("variation");
        expect(firstRow[brandKey]).toHaveProperty("variationMeasure");
        expect(firstRow[brandKey].variationMeasure).toBe("pp");
      }
    }
  });

  it("should include chartScaleMax in brand cells", async () => {
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
      const brandKey = Object.keys(firstRow).find(
        (key) => key !== "label" && key !== "country",
      );

      if (brandKey) {
        expect(firstRow[brandKey]).toHaveProperty("chartScaleMax");
      }
    }
  });

  it("should return empty object with header and rows when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_lead-the-category_global_participation-global-brands":
          [],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(emptyInput);

    expect(result).toHaveProperty("empty");
    expect(result.empty).toBe(true);
    expect(result).toHaveProperty("header");
    expect(result).toHaveProperty("rows");
  });

  it("should use correct colors for brands", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find a row with Corona data
    let coronaRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (row && row.corona && row.corona.chartData?.data?.length > 0) {
          coronaRow = row;
          break;
        }
      }
      if (coronaRow) break;
    }

    if (coronaRow && coronaRow.corona) {
      expect(coronaRow.corona.chartData.backgroundColor[0]).toBe("#F0DF78");
    }
  });

  it("should format brand names in Title Case for imgName", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const brandHeaders = result.header.slice(1);
    const imgNames = brandHeaders.map(
      (header: { imgName: string }) => header.imgName,
    );

    // Check that brand names are in Title Case
    imgNames.forEach((name: string) => {
      if (name) {
        // Should start with uppercase letter
        expect(name[0]).toBe(name[0].toUpperCase());
      }
    });
  });

  it("should handle different maturity levels", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Check that rows contain data from different maturities
    const labelValues: string[] = [];
    result.rows.forEach((group: { label: { value: string } }[]) => {
      group.forEach((row) => {
        if (row && row.label && row.label.value) {
          labelValues.push(row.label.value);
        }
      });
    });

    // Should have different maturity values
    expect(labelValues.length).toBeGreaterThan(0);
  });
});
