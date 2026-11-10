import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("mtd-by-country formatter (segments-gb)", () => {
  let compiledExpression: jsonata.Expression;

  const DS_NAME = "value-creation_pr-pages_volume_segments-gb_mtd-by-country";

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/segments-gb/mtd-by-country.jsonata",
  );

  type DatasourceEntry = {
    page_type: string;
    country_iso_code_3: string;
    period_type: string;
    dt_end: string;
    delta: number | null;
    ac_vs_ly: number | null;
    ac_vs_bu: number | null;
    rnk: number;
    vs_ly_label_suffix?: string;
    variationDirectionVsLy: "up" | "down";
    variationDirectionVsBu: "up" | "down";
    variationDirectionDelta: "up" | "down";
    refreshMonthLabel?: string;
    lyMonthLabel?: string;
    country: { imageIcon: string; imageWaving?: string };
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    page_type: "Global",
    country_iso_code_3: "USA",
    period_type: "MTD",
    dt_end: "2026-02-01T00:00:00.000Z",
    delta: 10,
    ac_vs_ly: 5.5,
    ac_vs_bu: -2.1,
    rnk: 1,
    variationDirectionVsLy: "up",
    variationDirectionVsBu: "down",
    variationDirectionDelta: "up",
    country: {
      imageIcon: "https://example.com/usa.png",
      imageWaving: "",
    },
    ...overrides,
  });

  const createMockInput = (entries: DatasourceEntry[]) => ({
    datasources: {
      [DS_NAME]: entries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  type ComparisonCell =
    | { value: string }
    | { value: string; measure: string; color: string };

  type MtdByCountryResult = {
    empty?: boolean;
    period?: string;
    labels?: string[] | Iterable<string>;
    /** Pode vir como série única `[n1, n2]` ou aninhado `[[n1, n2]]` (JSONata) */
    values?: number[] | number[][];
    formattedData?: string[] | string[][];
    comparisonLine?: {
      data: Array<{ title: string; data: ComparisonCell[] }>;
    };
  };

  /** JSONata costuma devolver sequências iteráveis — normaliza para Array JS */
  const toPlainStringArray = (
    labels: MtdByCountryResult["labels"],
  ): string[] => (labels == null ? [] : Array.from(labels as Iterable<string>));

  /** Extrai a série numérica (trata `values` plano ou `[ [ ... ] ]`) */
  const getValueSeries = (result: MtdByCountryResult): number[] => {
    const v = result.values;
    if (v == null || (Array.isArray(v) && v.length === 0)) return [];
    const first = (v as number[] | number[][])[0];
    return Array.isArray(first) ? (first as number[]) : (v as number[]);
  };

  const getFormattedSeries = (result: MtdByCountryResult): string[] => {
    const f = result.formattedData;
    if (f == null || (Array.isArray(f) && f.length === 0)) return [];
    const first = (f as string[] | string[][])[0];
    return Array.isArray(first) ? (first as string[]) : (f as string[]);
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return empty when datasource is empty", async () => {
    const result = (await evaluateExpression(
      createMockInput([]),
    )) as MtdByCountryResult;

    expect(result).toEqual({ empty: true });
  });

  it("should return empty when datasources object has no keys", async () => {
    const result = (await compiledExpression.evaluate({
      datasources: {},
    })) as MtdByCountryResult;

    expect(result.empty).toBe(true);
  });

  it("should map waterfall totals (rnk 0 / 99) to month-year labels and sort by rnk", async () => {
    const entries = [
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 99,
        dt_end: "2026-03-15T00:00:00.000Z",
        delta: 100,
        ac_vs_ly: 2,
        ac_vs_bu: 1,
        variationDirectionVsLy: "up",
        variationDirectionVsBu: "up",
      }),
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 0,
        dt_end: "2026-01-01T00:00:00.000Z",
        delta: 80,
        ac_vs_ly: 1,
        ac_vs_bu: 0.5,
        variationDirectionVsLy: "up",
        variationDirectionVsBu: "up",
      }),
      createEntry({
        country_iso_code_3: "BRA",
        rnk: 1,
        dt_end: "2026-02-01T00:00:00.000Z",
        delta: 20,
        ac_vs_ly: 3,
        ac_vs_bu: -1,
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as MtdByCountryResult;

    expect(result.empty).toBeUndefined();
    expect(toPlainStringArray(result.labels)).toEqual([
      "Jan'26",
      "BRA",
      "Mar'26",
    ]);
    expect(getValueSeries(result)).toEqual([80, 20, 100]);
  });

  it("should map waterfall totals (rnk 0 / 99) to YTD'YY when period_type is YTD", async () => {
    const entries = [
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 99,
        period_type: "YTD",
        dt_end: "2026-03-15T00:00:00.000Z",
        delta: 100,
        ac_vs_ly: 2,
        ac_vs_bu: 1,
        variationDirectionVsLy: "up",
        variationDirectionVsBu: "up",
      }),
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 0,
        period_type: "YTD",
        dt_end: "2025-12-01T00:00:00.000Z",
        delta: 80,
        ac_vs_ly: 1,
        ac_vs_bu: 0.5,
        variationDirectionVsLy: "up",
        variationDirectionVsBu: "up",
      }),
      createEntry({
        country_iso_code_3: "BRA",
        rnk: 1,
        period_type: "YTD",
        dt_end: "2026-02-01T00:00:00.000Z",
        delta: 20,
        ac_vs_ly: 3,
        ac_vs_bu: -1,
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as MtdByCountryResult;

    expect(toPlainStringArray(result.labels)).toEqual([
      "YTD'25",
      "BRA",
      "YTD'26",
    ]);
  });

  it("should render comparison cells as dash when ac_vs_ly is null", async () => {
    const entries = [
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 0,
        dt_end: "2026-01-01T00:00:00.000Z",
        delta: 0,
        ac_vs_ly: 0,
        ac_vs_bu: 0,
      }),
      createEntry({
        country_iso_code_3: "DOM",
        rnk: 1,
        ac_vs_ly: null,
        ac_vs_bu: -17,
        delta: 0.5,
      }),
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 99,
        dt_end: "2026-02-01T00:00:00.000Z",
        delta: 1,
        ac_vs_ly: 2,
        ac_vs_bu: 3,
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as MtdByCountryResult;
    const vsLy = result.comparisonLine?.data.find((c) => c.title === "vs LY");

    expect(vsLy?.data[1]).toEqual({ value: "-" });
  });

  it("should coerce null delta to 0 via safeNumber", async () => {
    const entries = [
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 0,
        dt_end: "2026-01-01T00:00:00.000Z",
        delta: 0,
        ac_vs_ly: 0,
        ac_vs_bu: 0,
      }),
      createEntry({
        country_iso_code_3: "ZAF",
        rnk: 1,
        delta: null,
        ac_vs_ly: -2,
        ac_vs_bu: -3,
      }),
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 99,
        dt_end: "2026-02-01T00:00:00.000Z",
        delta: 5,
        ac_vs_ly: 1,
        ac_vs_bu: 2,
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as MtdByCountryResult;

    expect(getValueSeries(result)[1]).toBe(0);
    expect(getFormattedSeries(result)[1]).toMatch(/^0/);
  });

  it("should leave vs LY / vs BU empty for rnk 0 only", async () => {
    const entries = [
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 0,
        dt_end: "2026-01-01T00:00:00.000Z",
        delta: 50,
        ac_vs_ly: 10,
        ac_vs_bu: 20,
      }),
      createEntry({
        country_iso_code_3: "USA",
        rnk: 1,
        delta: 10,
        ac_vs_ly: 3.3,
        ac_vs_bu: -1.1,
      }),
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 99,
        dt_end: "2026-02-01T00:00:00.000Z",
        delta: 60,
        ac_vs_ly: 4.4,
        ac_vs_bu: 5.5,
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as MtdByCountryResult;
    const vsLy = result.comparisonLine?.data.find((c) => c.title === "vs LY");
    const vsBu = result.comparisonLine?.data.find((c) => c.title === "vs BU");

    expect(vsLy?.data[0]).toEqual({ value: "" });
    expect(vsBu?.data[0]).toEqual({ value: "" });
    expect(vsLy?.data[1].value).not.toBe("");
    expect(vsLy?.data[2].value).not.toBe("");
  });

  it("should expose period from first row after sort", async () => {
    const entries = [
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 99,
        period_type: "MTD",
        delta: 1,
        ac_vs_ly: 0,
        ac_vs_bu: 0,
      }),
      createEntry({
        country_iso_code_3: "ABI",
        rnk: 0,
        period_type: "YTD",
        delta: 1,
        ac_vs_ly: 0,
        ac_vs_bu: 0,
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as MtdByCountryResult;

    expect(result.period).toBe("YTD");
  });
});
