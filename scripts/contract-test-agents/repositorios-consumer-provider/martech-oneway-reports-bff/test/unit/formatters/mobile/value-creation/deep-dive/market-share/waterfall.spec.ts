import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("mobile deep-dive market-share waterfall formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/infrastructure/formatters/mobile/value-creation/deep-dive/market-share/waterfall.jsonata",
      ),
      "utf8",
    );
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("emits flat rows from the single waterfall datasource; caps use `ac`, middle uses `delta`", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: [
          {
            label_value: "YTD'25",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 28.4,
            unit_of_measure: "%",
          },
          {
            label_value: "Brazil",
            dt_end: "2026-03-31T00:00:00.000Z",
            delta: 1.4,
            vs_ly: 0.3,
            vs_ly_direction: "up",
            comp_unit_of_measure: "pp",
          },
          {
            label_value: "YTD'26",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 29.8,
          },
        ],
      },
    });

    expect(result.chartHeader.title).toBe("Market Share");
    expect(result.tabs).toBeUndefined();
    expect(result.rows).toHaveLength(3);
    // Cap uses `ac` (28.4), not `delta`.
    expect(result.rows[0]).toMatchObject({ title: "YTD'25", value: 28.4 });
    // Middle uses `delta` (1.4), not `ac`.
    expect(result.rows[1]).toMatchObject({
      title: "Brazil",
      value: 1.4,
      formattedDelta: "0.3pp",
      deltaTone: "positive",
    });
    expect(result.rows[2]).toMatchObject({ title: "YTD'26", value: 29.8 });
  });

  it("emits a noticeMessage when the datasource is empty", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: { waterfall: [] },
    });

    expect(result.noticeMessage).toBe("Data not available");
    expect(result.rows).toEqual([]);
  });
});
