import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("top-bottom-brands formatter (pr-pages market-share)", () => {
  let compiledExpression: jsonata.Expression;

  const DS_NAME = "value-creation_pr-pages_market-share_top-bottom-brands";

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/market-share/top-bottom-brands.jsonata",
  );

  const UP_COLOR = "#49764B";
  const DOWN_COLOR = "#A20A0A";

  type DatasourceEntry = {
    country_iso_code_3: string;
    raw_brand: string;
    ac_vs_ly: number | null;
    vol_og_ly: number | null;
    period_type: "MTD" | "YTD";
    variationDirectionVsLy: "up" | "down";
    brand: { imageSquare: string };
    country: { imageIcon: string };
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    country_iso_code_3: "USA",
    raw_brand: "Budweiser",
    ac_vs_ly: 1.2,
    vol_og_ly: -3.5,
    period_type: "YTD",
    variationDirectionVsLy: "up",
    brand: { imageSquare: "https://example.com/bud.png" },
    country: { imageIcon: "https://example.com/usa.png" },
    ...overrides,
  });

  const createMockInput = (entries: DatasourceEntry[]) => ({
    datasources: {
      [DS_NAME]: entries,
    },
  });

  const ensureArray = <T>(v: T | T[] | null | undefined): T[] => {
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
  };

  const getComparisonRows = (result: unknown) =>
    ensureArray(
      (result as { comparisonLine?: { data?: unknown } })?.comparisonLine?.data,
    );

  const getCells = (title: string, result: unknown) => {
    const row = getComparisonRows(result).find(
      (r: { title?: string }) => r.title === title,
    );
    return ensureArray((row as { data?: unknown })?.data);
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return empty state when datasource has no rows", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));
    expect(result).toEqual({ empty: true });
  });

  describe("vs LY comparison row (color from variationDirectionVsLy)", () => {
    it("maps variationDirectionVsLy up to green and down to red on each cell", async () => {
      const result = await compiledExpression.evaluate(
        createMockInput([
          createEntry({
            country_iso_code_3: "BRA",
            raw_brand: "Brand A",
            ac_vs_ly: 0.5,
            variationDirectionVsLy: "up",
            vol_og_ly: 1.0,
          }),
          createEntry({
            country_iso_code_3: "USA",
            raw_brand: "Brand B",
            ac_vs_ly: -0.3,
            variationDirectionVsLy: "down",
            vol_og_ly: -2.0,
          }),
        ]),
      );

      const cells = getCells("vs LY", result);
      expect(cells).toHaveLength(2);
      expect(cells[0]).toMatchObject({
        value: "0.5",
        measure: "pp",
        color: UP_COLOR,
      });
      expect(cells[0]).not.toHaveProperty("trend");
      expect(cells[1]).toMatchObject({
        value: "-0.3",
        measure: "pp",
        color: DOWN_COLOR,
      });
      expect(cells[1]).not.toHaveProperty("trend");
    });

    it("does not set color on vs LY when ac_vs_ly is not a number", async () => {
      const result = await compiledExpression.evaluate(
        createMockInput([
          createEntry({
            ac_vs_ly: null,
            vol_og_ly: 1.0,
            variationDirectionVsLy: "up",
          }),
        ]),
      );

      const cell = getCells("vs LY", result)[0];
      expect(cell).toEqual({ value: "-", measure: "" });
      expect(cell).not.toHaveProperty("color");
    });
  });

  describe("Vol. vs LY comparison row (trend from signed value)", () => {
    it("sets trend positive for zero or positive vol_og_ly and negative when below zero", async () => {
      const result = await compiledExpression.evaluate(
        createMockInput([
          createEntry({ vol_og_ly: -3.5, ac_vs_ly: 1.0 }),
          createEntry({
            country_iso_code_3: "MEX",
            raw_brand: "Other",
            vol_og_ly: 0.0,
            ac_vs_ly: 0.0,
          }),
          createEntry({
            country_iso_code_3: "CAN",
            raw_brand: "Third",
            vol_og_ly: 4.2,
            ac_vs_ly: 2.0,
          }),
        ]),
      );

      const cells = getCells("Vol. vs LY", result);
      expect(cells[0]).toMatchObject({
        value: "-3.5",
        measure: "%",
        trend: "negative",
      });
      expect(cells[0]).not.toHaveProperty("color");
      expect(cells[1]).toMatchObject({
        value: "0.0",
        measure: "%",
        trend: "positive",
      });
      expect(cells[2]).toMatchObject({
        value: "4.2",
        measure: "%",
        trend: "positive",
      });
    });

    it("omits trend when vol_og_ly is not a number", async () => {
      const result = await compiledExpression.evaluate(
        createMockInput([
          createEntry({
            ac_vs_ly: 1.0,
            vol_og_ly: null,
          }),
        ]),
      );

      expect(getCells("Vol. vs LY", result)[0]).toEqual({
        value: "-",
        measure: "",
      });
    });
  });
});
