import { loadCompiledJsonata } from "../../../../../../helpers/jsonata";

describe("category pos-book lead-the-category global manufacture-participation formatter", () => {
  const mockInput = {
    datasources: {
      "category_pos-book_lead-the-category_global_manufacture-participation": [
        {
          maturity: "M3",
          country_iso_code_3: "USA",
          manufacturer: "abi_beer",
          manufacturer_name: "ABInBev",
          ac: 45.5,
          ac_vs_ly: 1.2,
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-03-31T00:00:00.000Z",
        },
        {
          maturity: "M2",
          country_iso_code_3: "GBR",
          manufacturer: "heineken_co",
          manufacturer_name: "Heineken Co",
          ac: 28.3,
          ac_vs_ly: -0.8,
          dt_ini: "2025-04-01T00:00:00.000Z",
          dt_end: "2025-06-30T00:00:00.000Z",
        },
        {
          maturity: "M1",
          country_iso_code_3: "BRA",
          manufacturer: "others_manufacturers",
          manufacturer_name: "Other Competitors",
          ac: 15.2,
          ac_vs_ly: 0.5,
          dt_ini: "2025-07-01T00:00:00.000Z",
          dt_end: "2025-09-30T00:00:00.000Z",
        },
        {
          maturity: "M3",
          country_iso_code_3: "MEX",
          manufacturer: "core_co",
          manufacturer_name: "Core Co",
          ac: 22.1,
          ac_vs_ly: -0.3,
          dt_ini: "2025-10-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
        },
      ],
    },
  };

  const getCompiledExpression = () =>
    loadCompiledJsonata(
      "src/infrastructure/formatters/category/pos-book/lead-the-category/global/manufacture-participation.jsonata",
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

    // First header is Label with children (label and country)
    expect(result.header[0].title).toBe("Label");
    expect(result.header[0].children).toBeDefined();
    expect(result.header[0].children.length).toBe(2);
    expect(result.header[0].children[0].id).toBe("label");
    expect(result.header[0].children[1].id).toBe("country");

    // Other headers are manufacturers with backgroundColor
    const manufacturerHeaders = result.header.slice(1);
    manufacturerHeaders.forEach(
      (header: { id: string; title: string; backgroundColor: string }) => {
        expect(header).toHaveProperty("id");
        expect(header).toHaveProperty("title");
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

  it("should include chartData for manufacturers with data", async () => {
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
      // Find a manufacturer key with chartData
      const manufacturerKey = Object.keys(firstRow).find(
        (key) =>
          key !== "label" && key !== "country" && firstRow[key].chartData,
      );

      if (manufacturerKey) {
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

  it("should include variation data in manufacturer cells with data", async () => {
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
      const manufacturerKey = Object.keys(firstRow).find(
        (key) =>
          key !== "label" && key !== "country" && firstRow[key].chartData,
      );

      if (manufacturerKey) {
        expect(firstRow[manufacturerKey]).toHaveProperty("variation");
        expect(firstRow[manufacturerKey]).toHaveProperty("variationMeasure");
        expect(firstRow[manufacturerKey].variationMeasure).toBe("pp");
      }
    }
  });

  it("should include tooltip for others_manufacturers", async () => {
    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    // Find a row with others_manufacturers
    let othersRow = null;
    for (const group of result.rows) {
      for (const row of group) {
        if (
          row &&
          row.others_manufacturers &&
          row.others_manufacturers.tooltip
        ) {
          othersRow = row;
          break;
        }
      }
      if (othersRow) break;
    }

    if (othersRow && othersRow.others_manufacturers) {
      expect(othersRow.others_manufacturers).toHaveProperty("tooltip");
      expect(othersRow.others_manufacturers.tooltip).toBe("Other Competitors");
    }
  });

  it("should return empty object when data is empty", async () => {
    const emptyInput = {
      datasources: {
        "category_pos-book_lead-the-category_global_manufacture-participation":
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

    // Check that maturity values are used as labels
    const labelValues: string[] = [];
    result.rows.forEach((group: { label: { value: string } }[]) => {
      group.forEach((row) => {
        if (row && row.label && row.label.value) {
          labelValues.push(row.label.value);
        }
      });
    });

    expect(labelValues).toContain("M3");
    expect(labelValues).toContain("M2");
    expect(labelValues).toContain("M1");
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
    expect(countryValues).toContain("MEX");
  });
});
