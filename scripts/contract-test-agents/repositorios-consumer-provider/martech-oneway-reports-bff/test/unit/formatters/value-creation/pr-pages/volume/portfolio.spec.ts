import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("PR Pages Volume - portfolio formatter - JSONata Output", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/portfolio.jsonata",
  );

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  const DS_NAME = "value-creation_pr-pages_volume_global_table_portfolio";

  function buildSegmentRows(
    segments: string[],
    options?: { acVsLy?: number; direction?: string },
  ) {
    const periods = ["M", "L3M", "YTD"];
    const acVsLy = options?.acVsLy ?? 1.5;
    const direction = options?.direction ?? "up";

    return segments.flatMap((segment) =>
      periods.map((period) => ({
        segment,
        period,
        ac_vs_ly: acVsLy,
        variationDirectionVsLy: direction,
      })),
    );
  }

  function createInput(data: any[]) {
    return { datasources: { [DS_NAME]: data } };
  }

  it("should format 4 segments + Total with Total as last row", async () => {
    const segments = ["Megabrands", "Expansion", "Sustain", "Tail"];
    const rows = [
      ...buildSegmentRows(segments),
      ...buildSegmentRows(["Total"]),
    ];
    const input = createInput(rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.rows[0].length).toBe(5);
    expect(result.rows[0][0].portfolio.value).toBe("Megabrands");
    expect(result.rows[0][1].portfolio.value).toBe("Expansion");
    expect(result.rows[0][2].portfolio.value).toBe("Sustain");
    expect(result.rows[0][3].portfolio.value).toBe("Tail");
    expect(result.rows[0][4].portfolio.value).toBe("Total");
  });

  it("should include subtitle '(Beer + Adj)' on the Total row", async () => {
    const rows = [
      ...buildSegmentRows(["Megabrands"]),
      ...buildSegmentRows(["Total"]),
    ];
    const input = createInput(rows);
    const result = await compiledExpression.evaluate(input);

    const totalRow = result.rows[0].find(
      (r: any) => r.portfolio.value === "Total",
    );
    expect(totalRow.portfolio.subtitle).toBe("Beer + Adj");
  });

  it("should not include subtitle on regular segment rows", async () => {
    const rows = [
      ...buildSegmentRows(["Megabrands"]),
      ...buildSegmentRows(["Total"]),
    ];
    const input = createInput(rows);
    const result = await compiledExpression.evaluate(input);

    const megabrandsRow = result.rows[0].find(
      (r: any) => r.portfolio.value === "Megabrands",
    );
    expect(megabrandsRow.portfolio.subtitle).toBeUndefined();
  });

  it("should map cell data with correct variation colors", async () => {
    const rows = [
      {
        segment: "Megabrands",
        period: "M",
        ac_vs_ly: 3.2,
        variationDirectionVsLy: "up",
      },
      {
        segment: "Megabrands",
        period: "L3M",
        ac_vs_ly: -1.5,
        variationDirectionVsLy: "down",
      },
      {
        segment: "Megabrands",
        period: "YTD",
        ac_vs_ly: 0.8,
        variationDirectionVsLy: "up",
      },
    ];
    const input = createInput(rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.rows[0][0].mtd.value).toBe(3.2);
    expect(result.rows[0][0].mtd.unitMeasure).toBe("%");
    expect(result.rows[0][0].mtd.variationDirection).toBe("#007800");
    expect(result.rows[0][0].l3m.value).toBe(-1.5);
    expect(result.rows[0][0].l3m.variationDirection).toBe("#B91C1C");
    expect(result.rows[0][0].ytd.value).toBe(0.8);
    expect(result.rows[0][0].ytd.variationDirection).toBe("#007800");
  });

  it("should return empty object when datasource has no rows", async () => {
    const input = createInput([]);
    const result = await compiledExpression.evaluate(input);

    expect(result.empty).toBe(true);
  });

  it("should work without Total row (only regular segments)", async () => {
    const segments = ["Megabrands", "Expansion", "Sustain", "Tail"];
    const rows = buildSegmentRows(segments);
    const input = createInput(rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.rows[0].length).toBe(4);
    expect(result.rows[0][0].portfolio.value).toBe("Megabrands");
    expect(result.rows[0][3].portfolio.value).toBe("Tail");
  });

  it("should show dash for missing period data", async () => {
    const rows = [
      {
        segment: "Megabrands",
        period: "M",
        ac_vs_ly: 1.0,
        variationDirectionVsLy: "up",
      },
    ];
    const input = createInput(rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.rows[0][0].mtd.value).toBe(1.0);
    expect(result.rows[0][0].l3m.value).toBe("-");
    expect(result.rows[0][0].ytd.value).toBe("-");
  });

  it("should return correct headers", async () => {
    const rows = buildSegmentRows(["Megabrands"]);
    const input = createInput(rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.header).toEqual([
      { id: "portfolio", title: "Portfolio", subtitle: "vs LY" },
      { id: "mtd", title: "Month" },
      { id: "l3m", title: "L3M" },
      { id: "ytd", title: "YTD" },
    ]);
  });

  it("should preserve segment order from SQL with Total at the end", async () => {
    const rows = [
      ...buildSegmentRows(["Megabrands", "Expansion", "Sustain", "Tail"]),
      ...buildSegmentRows(["Total"]),
    ];
    const input = createInput(rows);
    const result = await compiledExpression.evaluate(input);

    const rowValues = result.rows[0].map((r: any) => r.portfolio.value);
    expect(rowValues).toEqual([
      "Megabrands",
      "Expansion",
      "Sustain",
      "Tail",
      "Total",
    ]);
  });
});
