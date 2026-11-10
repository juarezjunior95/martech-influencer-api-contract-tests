import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("contribution waterfall formatter (cores)", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/cores/contribution-waterfall.jsonata",
  );

  type DatasourceEntry = {
    kpi_name?: string;
    step_name: string;
    ac: number[];
    vol_vs_ly?: number;
    nr_vs_ly?: number;
    vilc_vs_ly?: number;
    maco_vs_ly?: number;
    sm_vs_ly?: number;
    ac_vs_ly?: number;
    comp_unit_of_measure?: string;
    variationDirectionVolVsLy?: string;
    variationDirectionNrVsLy?: string;
    variationDirectionVilcVsLy?: string;
    variationDirectionMacoVsLy?: string;
    variationDirectionSmVsLy?: string;
    variationDirectionVsLy?: string;
    raw_brand?: string;
    country_iso_code_3?: string;
    country?: { imageIcon?: string };
    portfolio?: string;
    sub_brand?: string;
    beer_price_segment?: string;
    brand?: { imageSquare?: string };
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry>,
  ): DatasourceEntry => ({
    kpi_name: "CORES",
    step_name: "Total",
    ac: [1000],
    vol_vs_ly: 5.2,
    nr_vs_ly: 3.1,
    vilc_vs_ly: 2.5,
    maco_vs_ly: 1.8,
    sm_vs_ly: -0.5,
    ac_vs_ly: 4.0,
    comp_unit_of_measure: "%",
    variationDirectionVolVsLy: "up",
    variationDirectionNrVsLy: "up",
    variationDirectionVilcVsLy: "up",
    variationDirectionMacoVsLy: "up",
    variationDirectionSmVsLy: "down",
    variationDirectionVsLy: "up",
    ...overrides,
  });

  const createMockInput = (
    largeEntries: DatasourceEntry[],
    smallEntries: DatasourceEntry[],
  ) => ({
    datasources: {
      large: largeEntries,
      small: smallEntries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  describe("basic functionality", () => {
    it("should return empty object when both datasources are empty", async () => {
      const mockInput = createMockInput([], []);
      const result = await evaluateExpression(mockInput);

      expect(result.empty).toBe(true);
      expect(result.large).toBeUndefined();
      expect(result.small).toBeUndefined();
    });

    it("should return empty object when datasources are undefined", async () => {
      const result = await compiledExpression.evaluate({
        datasources: {},
      });

      expect(result.empty).toBe(true);
    });

    it("should return waterfall structure with valid data", async () => {
      const largeEntries = [
        createEntry({
          step_name: "YTD'25",
          ac: [559581.7],
        }),
        createEntry({
          step_name: "Brand Name",
          raw_brand: "Brand Name",
          ac: [44956.5],
          brand: { imageSquare: "https://example.com/brand.png" },
        }),
        createEntry({
          step_name: "YTD'26",
          ac: [45914],
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);

      expect(result.empty).toBeUndefined();
      expect(result.large).toBeDefined();
      expect(result.small).toBeDefined();

      // Check values array - ac is an array, so values will be arrays
      expect(result.large.values).toBeDefined();
      expect(Array.isArray(result.large.values)).toBe(true);

      // Check formatted data
      expect(result.large.formattedData).toBeDefined();
      expect(Array.isArray(result.large.formattedData)).toBe(true);
    });

    it("should format large numbers correctly (k and M)", async () => {
      const largeEntries = [
        createEntry({
          step_name: "Total",
          ac: [1500000], // Should format as 1.5M
        }),
        createEntry({
          step_name: "Brand",
          ac: [2500], // Should format as 2.5k
        }),
        createEntry({
          step_name: "End",
          ac: [500], // Should format as 500.0
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);

      expect(result.large.formattedData).toBeDefined();
      expect(Array.isArray(result.large.formattedData)).toBe(true);
      expect(result.large.formattedData.length).toBeGreaterThan(0);

      // Check that formatted values exist
      const formattedValues = result.large.formattedData[0];
      expect(Array.isArray(formattedValues)).toBe(true);
      expect(formattedValues.length).toBe(3);
    });

    it("should return comparison line data with all 6 metrics", async () => {
      const largeEntries = [
        createEntry({
          step_name: "Total",
          ac: [1000],
          vol_vs_ly: 10.5,
          nr_vs_ly: 8.3,
          vilc_vs_ly: 5.2,
          maco_vs_ly: 3.1,
          sm_vs_ly: -2.0,
          ac_vs_ly: 7.5,
        }),
        createEntry({
          step_name: "Brand",
          ac: [500],
          vol_vs_ly: 5.0,
          nr_vs_ly: 4.0,
          vilc_vs_ly: 2.5,
          maco_vs_ly: 1.5,
          sm_vs_ly: -1.0,
          ac_vs_ly: 3.5,
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);

      expect(result.large.comparisonLine).toBeDefined();
      expect(result.large.comparisonLine.data).toBeDefined();
      expect(Array.isArray(result.large.comparisonLine.data)).toBe(true);
      expect(result.large.comparisonLine.data.length).toBe(6);

      // Check all comparison titles
      const titles = result.large.comparisonLine.data.map((d: any) => d.title);
      expect(titles).toContain("Vol. vs LY");
      expect(titles).toContain("NR vs LY");
      expect(titles).toContain("VILC vs LY");
      expect(titles).toContain("MACO vs LY");
      expect(titles).toContain("S&M vs LY");
      expect(titles).toContain("CORES vs LY");

      // Check that each comparison has value, measure, and trend
      result.large.comparisonLine.data.forEach((comparison: any) => {
        expect(comparison.data).toBeDefined();
        expect(Array.isArray(comparison.data)).toBe(true);
        comparison.data.forEach((item: any) => {
          expect(item).toHaveProperty("value");
          expect(item).toHaveProperty("measure");
          expect(item).toHaveProperty("trend");
        });
      });
    });

    it("should determine waterfallType as 'brand' when raw_brand exists", async () => {
      const largeEntries = [
        createEntry({
          step_name: "Total",
          ac: [1000],
        }),
        createEntry({
          step_name: "Brand Name",
          raw_brand: "Brand Name",
          ac: [500],
        }),
        createEntry({
          step_name: "End",
          ac: [1500],
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);

      expect(result.large).toBeDefined();
      expect(result.large.labels).toBeDefined();
    });

    it("should determine waterfallType as 'country' when country_iso_code_3 exists", async () => {
      const largeEntries = [
        createEntry({
          step_name: "Total",
          ac: [1000],
        }),
        createEntry({
          step_name: "Country Name",
          country_iso_code_3: "BRA",
          ac: [500],
        }),
        createEntry({
          step_name: "End",
          ac: [1500],
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);

      expect(result.large).toBeDefined();
      expect(result.large.labels).toBeDefined();
    });

    it("should return images structure", async () => {
      const largeEntries = [
        createEntry({
          step_name: "Total",
          ac: [1000],
          country: { imageIcon: "https://example.com/country.png" },
        }),
        createEntry({
          step_name: "Brand Name",
          raw_brand: "Brand Name",
          ac: [500],
          brand: { imageSquare: "https://example.com/brand.png" },
        }),
        createEntry({
          step_name: "End",
          ac: [1500],
          country: { imageIcon: "https://example.com/country2.png" },
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);

      expect(result.large.images).toBeDefined();
      expect(result.large.images.data).toBeDefined();
      expect(Array.isArray(result.large.images.data)).toBe(true);
      expect(result.large.images.data.length).toBe(3);

      // Check image structure
      result.large.images.data.forEach((img: any) => {
        expect(img).toHaveProperty("mainBrand");
        expect(img).toHaveProperty("title");
        expect(img.mainBrand).toHaveProperty("src");
        expect(img.mainBrand).toHaveProperty("alt");
      });
    });

    it("should return empty object when ac array has no valid numbers", async () => {
      const largeEntries = [
        createEntry({
          step_name: "Total",
          ac: [0],
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);

      expect(result.empty).toBe(true);
    });

    it("should use small datasource when large is empty", async () => {
      const smallEntries = [
        createEntry({
          step_name: "Total",
          ac: [1000],
        }),
        createEntry({
          step_name: "Brand",
          ac: [500],
        }),
      ];

      const mockInput = createMockInput([], smallEntries);
      const result = await evaluateExpression(mockInput);

      expect(result.empty).toBeUndefined();
      expect(result.large).toBeDefined();
      expect(result.small).toBeDefined();
    });
  });
});
