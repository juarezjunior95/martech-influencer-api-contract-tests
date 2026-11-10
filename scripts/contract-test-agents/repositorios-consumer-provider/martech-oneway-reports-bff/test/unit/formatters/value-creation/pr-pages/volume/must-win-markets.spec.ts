import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("must-win-markets formatter (pr-pages volume)", () => {
  let compiledExpression: jsonata.Expression;

  const DS_NAME = "value-creation_pr-pages_volume_must-win-markets";

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/must-win-markets.jsonata",
  );

  type DatasourceEntry = {
    priorities: string;
    period: "M" | "L3M" | "YTD";
    ac_vs_ly: number | null;
    comp_unit_of_measure: string;
    variationDirectionVsLy: "up" | "down";
    countriesImages: string[];
  };

  const createRow = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    priorities: "BRA",
    period: "M",
    ac_vs_ly: 2.5,
    comp_unit_of_measure: "%",
    variationDirectionVsLy: "up",
    countriesImages: ["https://example.com/brazil.png"],
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

  type TableCell =
    | { value: string }
    | { value: string; unitMeasure: string; trend: string };

  type TableRow = {
    markets: { value: string; images: string[] };
    mtd: TableCell;
    l3m: TableCell;
    ytd: TableCell;
  };

  type MustWinResult =
    | { empty: true }
    | {
        header: Array<{ id: string; title: string; subtitle?: string }>;
        rows: TableRow[][] | Iterable<Iterable<TableRow>>;
      };

  const getTableRows = (result: MustWinResult): TableRow[] => {
    if ("empty" in result && result.empty) return [];
    const rows = (result as Exclude<MustWinResult, { empty: true }>).rows;
    if (rows == null) return [];
    const outer = Array.isArray(rows) ? rows : Array.from(rows);
    if (outer.length === 0) return [];
    const inner = outer[0];
    return Array.isArray(inner) ? [...inner] : Array.from(inner);
  };

  const expectedHeader = [
    { id: "markets", title: "Markets", subtitle: "vs LY" },
    { id: "mtd", title: "Month" },
    { id: "l3m", title: "L3M" },
    { id: "ytd", title: "YTD" },
  ];

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return empty when datasource has no rows", async () => {
    const result = (await evaluateExpression(
      createMockInput([]),
    )) as MustWinResult;

    expect(result).toEqual({ empty: true });
  });

  it("should return header, markets images, and mtd / l3m / ytd cells on the golden path", async () => {
    const entries: DatasourceEntry[] = [
      createRow({
        priorities: "BRA",
        period: "M",
        ac_vs_ly: 1.2,
        variationDirectionVsLy: "up",
        countriesImages: ["https://example.com/brazil.png"],
      }),
      createRow({
        priorities: "BRA",
        period: "L3M",
        ac_vs_ly: -3.4,
        variationDirectionVsLy: "down",
        countriesImages: ["https://example.com/brazil.png"],
      }),
      createRow({
        priorities: "BRA",
        period: "YTD",
        ac_vs_ly: 0.5,
        variationDirectionVsLy: "up",
        countriesImages: ["https://example.com/brazil.png"],
      }),
      createRow({
        priorities: "MEX",
        period: "M",
        ac_vs_ly: 10,
        variationDirectionVsLy: "down",
        countriesImages: ["https://example.com/mexico.png"],
      }),
      createRow({
        priorities: "MEX",
        period: "L3M",
        ac_vs_ly: 2.3,
        variationDirectionVsLy: "up",
        countriesImages: ["https://example.com/mexico.png"],
      }),
      createRow({
        priorities: "MEX",
        period: "YTD",
        ac_vs_ly: 7,
        variationDirectionVsLy: "down",
        countriesImages: ["https://example.com/mexico.png"],
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Exclude<MustWinResult, { empty: true }>;

    expect(result.header).toEqual(expectedHeader);

    const rows = getTableRows(result as MustWinResult);
    expect(rows).toHaveLength(2);

    expect(rows[0].markets).toEqual({
      value: "BRA",
      images: ["https://example.com/brazil.png"],
    });
    expect(rows[0].mtd).toEqual({
      value: "1.2",
      unitMeasure: "%",
      trend: "positive",
    });
    expect(rows[0].l3m).toEqual({
      value: "-3.4",
      unitMeasure: "%",
      trend: "negative",
    });
    expect(rows[0].ytd).toEqual({
      value: "0.5",
      unitMeasure: "%",
      trend: "positive",
    });

    expect(rows[1].markets).toEqual({
      value: "MEX",
      images: ["https://example.com/mexico.png"],
    });
    expect(rows[1].mtd).toEqual({
      value: "10.0",
      unitMeasure: "%",
      trend: "negative",
    });
    expect(rows[1].l3m).toEqual({
      value: "2.3",
      unitMeasure: "%",
      trend: "positive",
    });
    expect(rows[1].ytd).toEqual({
      value: "7.0",
      unitMeasure: "%",
      trend: "negative",
    });
  });

  it('should use minimal "-" cell when period row is missing or ac_vs_ly is null (0 is formatted)', async () => {
    const entries: DatasourceEntry[] = [
      createRow({
        priorities: "BRA",
        period: "M",
        ac_vs_ly: 1,
        countriesImages: ["https://example.com/brazil.png"],
      }),
      // L3M intentionally omitted → l3m cell only { value: "-" }
      createRow({
        priorities: "BRA",
        period: "YTD",
        ac_vs_ly: 2,
        countriesImages: ["https://example.com/brazil.png"],
      }),
      createRow({
        priorities: "MEX",
        period: "M",
        ac_vs_ly: null,
        countriesImages: ["https://example.com/mexico.png"],
      }),
      createRow({
        priorities: "MEX",
        period: "L3M",
        ac_vs_ly: 5,
        countriesImages: ["https://example.com/mexico.png"],
      }),
      createRow({
        priorities: "MEX",
        period: "YTD",
        ac_vs_ly: 6,
        countriesImages: ["https://example.com/mexico.png"],
      }),
      createRow({
        priorities: "COL",
        period: "M",
        ac_vs_ly: 0,
        countriesImages: ["https://example.com/colombia.png"],
      }),
      createRow({
        priorities: "COL",
        period: "L3M",
        ac_vs_ly: 3,
        countriesImages: ["https://example.com/colombia.png"],
      }),
      createRow({
        priorities: "COL",
        period: "YTD",
        ac_vs_ly: 4,
        countriesImages: ["https://example.com/colombia.png"],
      }),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Exclude<MustWinResult, { empty: true }>;

    const rows = getTableRows(result as MustWinResult);
    expect(rows[0].l3m).toEqual({ value: "-" });

    expect(rows[1].mtd).toEqual({ value: "-" });

    expect(rows[2].mtd).toEqual({
      value: "0.0",
      unitMeasure: "%",
      trend: "positive",
    });
  });
});
