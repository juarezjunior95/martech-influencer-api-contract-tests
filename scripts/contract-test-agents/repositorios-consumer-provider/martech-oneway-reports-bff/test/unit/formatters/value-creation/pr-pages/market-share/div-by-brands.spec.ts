import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("div-by-brands formatter (pr-pages market-share)", () => {
  let compiledExpression: jsonata.Expression;

  const DS_NAME = "value-creation_pr-pages_market-share_div-by-brands";

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/market-share/div-by-brands.jsonata",
  );

  const UP_COLOR = "#49764B";
  const DOWN_COLOR = "#A20A0A";

  type DatasourceEntry = {
    country: string;
    raw_brand: string | null;
    brand: { imageSquare: string; imageTable?: string };
    segment:
      | "Mega Brand"
      | "Expansion Brand"
      | "Sustain Brand"
      | "Tail Brand"
      | null;
    ac: number | null;
    vs_ly_pp: number | null;
    vol_ac_vs_ly: number | null;
    vs_ly_label_suffix: "MTD" | "YTD";
    variationDirectionAc: "up" | "down";
    period_type: "MTD" | "YTD";
    refreshMonthLabel?: string;
    lyMonthLabel?: string;
  };

  const createBrandRow = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    country: "BRA",
    raw_brand: "Brahma",
    brand: {
      imageSquare: "https://example.com/brahma.png",
      imageTable: "https://example.com/brahma.svg",
    },
    segment: "Mega Brand",
    ac: 18.7,
    vs_ly_pp: -1.2,
    vol_ac_vs_ly: null,
    vs_ly_label_suffix: "YTD",
    variationDirectionAc: "down",
    period_type: "YTD",
    refreshMonthLabel: "",
    lyMonthLabel: "",
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

  const toArray = <T = unknown>(value: unknown): T[] => {
    if (value == null) return [];
    if (Array.isArray(value)) return value as T[];
    if (typeof value === "object" && Symbol.iterator in (value as object)) {
      return Array.from(value as Iterable<T>);
    }
    return [value as T];
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return empty state when datasource has no rows", async () => {
    const result = await evaluateExpression(createMockInput([]));

    expect(result).toEqual({ empty: true });
  });

  it("should build chart payload with period, datasets, labels and formatted data", async () => {
    const entries = [
      createBrandRow({
        raw_brand: "Brahma",
        ac: 18.7,
        vs_ly_pp: -1.2,
        variationDirectionAc: "down",
        segment: "Mega Brand",
      }),
      createBrandRow({
        raw_brand: "Original",
        ac: 6.6,
        vs_ly_pp: 1.4,
        variationDirectionAc: "up",
        segment: "Mega Brand",
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Record<string, unknown>;

    expect(result.empty).toBeUndefined();
    expect(result.period).toBe("YTD");

    expect([...toArray<string>(result.labels)]).toEqual(["Brahma", "Original"]);

    const datasets = toArray<{ data: unknown; backgroundColor: unknown }>(
      result.datasets,
    );
    expect(datasets).toHaveLength(1);
    expect([...toArray<number>(datasets[0].data)]).toEqual([18.7, 6.6]);
    expect([...toArray<string>(datasets[0].backgroundColor)]).toEqual([
      DOWN_COLOR,
      UP_COLOR,
    ]);

    const formattedRow = toArray<string[]>(result.formattedData)[0];
    expect([...toArray<string>(formattedRow)]).toEqual(["18.7", "6.6"]);
  });

  it("should map raw_brand null to 'Others' label and avatar title", async () => {
    const entries = [
      createBrandRow({
        raw_brand: null,
        brand: { imageSquare: "", imageTable: "" },
        segment: null,
        ac: 2.5,
        vs_ly_pp: 0.4,
        variationDirectionAc: "up",
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Record<string, unknown>;

    expect([...toArray<string>(result.labels)]).toEqual(["Others"]);

    const avatar = toArray<{ title: string; mainBrand: { alt: string } }>(
      (result.brandsAvatar as { data: unknown }).data,
    )[0];
    expect(avatar.title).toBe("Others");
    expect(avatar.mainBrand.alt).toBe("Others FLAG");
  });

  it("should build brandsAvatar without badgeFlag", async () => {
    const entries = [
      createBrandRow({
        raw_brand: "Pepsi",
        brand: {
          imageSquare: "https://example.com/pepsi.png",
          imageTable: "",
        },
        segment: "Expansion Brand",
        ac: 2.6,
        vs_ly_pp: 2.6,
        variationDirectionAc: "up",
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Record<string, unknown>;

    const avatar = toArray<Record<string, unknown>>(
      (result.brandsAvatar as { data: unknown }).data,
    )[0];

    expect(avatar.title).toBe("Pepsi");
    expect(avatar.mainBrand).toEqual({
      src: "https://example.com/pepsi.png",
      alt: "Pepsi FLAG",
    });
    expect(avatar).not.toHaveProperty("badgeFlag");
    expect(avatar).not.toHaveProperty("description");
  });

  it("should build comparison lines with color on 'vs LY' and dash for null values", async () => {
    const entries = [
      createBrandRow({
        raw_brand: "Brahma",
        vs_ly_pp: -1.2,
        vol_ac_vs_ly: null,
        variationDirectionAc: "down",
      }),
      createBrandRow({
        raw_brand: "Original",
        vs_ly_pp: 1.4,
        vol_ac_vs_ly: 3.5,
        variationDirectionAc: "up",
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Record<string, unknown>;

    const comparisonData = toArray<{ title: string; data: unknown }>(
      (result.comparisonLine as { data: unknown }).data,
    );
    expect(comparisonData.map((line) => line.title)).toEqual([
      "vs LY",
      "Vol. vs LY",
    ]);

    const vsLy = toArray<Record<string, unknown>>(comparisonData[0].data);
    expect(vsLy[0]).toEqual({
      value: "-1.2",
      measure: "pp",
      color: DOWN_COLOR,
    });
    expect(vsLy[1]).toEqual({
      value: "1.4",
      measure: "pp",
      color: UP_COLOR,
    });

    const volVsLy = toArray<Record<string, unknown>>(comparisonData[1].data);
    expect(volVsLy[0]).toEqual({ value: "-" });
    expect(volVsLy[1]).toEqual({
      value: "3.5",
      measure: "%",
      color: UP_COLOR,
    });
  });

  it("should map segment to baseChartColors and return null for unknown/null segments", async () => {
    const entries = [
      createBrandRow({ raw_brand: "Brahma", segment: "Mega Brand" }),
      createBrandRow({ raw_brand: "Pepsi", segment: "Expansion Brand" }),
      createBrandRow({ raw_brand: "Skol", segment: "Sustain Brand" }),
      createBrandRow({ raw_brand: "Tail", segment: "Tail Brand" }),
      createBrandRow({ raw_brand: "Other", segment: null }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Record<string, unknown>;

    expect([...toArray<string | null>(result.baseChartColors)]).toEqual([
      "Megabrands",
      "Expansion",
      "Sustain",
      "Tail",
      null,
    ]);
  });

  it("should fall back to 0 for non-numeric ac and '-' for non-numeric vs_ly_pp in formattedData", async () => {
    const entries = [
      createBrandRow({
        raw_brand: "Brahma",
        ac: null,
        vs_ly_pp: null,
        variationDirectionAc: "up",
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Record<string, unknown>;

    const datasets = toArray<{ data: unknown }>(result.datasets);
    expect([...toArray<number>(datasets[0].data)]).toEqual([0]);

    const formattedRow = toArray<string[]>(result.formattedData)[0];
    expect([...toArray<string>(formattedRow)]).toEqual(["-"]);
  });
});
