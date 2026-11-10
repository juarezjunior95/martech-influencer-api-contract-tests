import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("mobile deep-dive brand-power waterfall formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/infrastructure/formatters/mobile/value-creation/deep-dive/brand-power/waterfall.jsonata",
      ),
      "utf8",
    );
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("emits flat rows using Brand Power wire fields (ac_delta / ac_vs_ly)", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: [
          {
            label_value: "YTD'25",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac_delta: 0,
            ac_vs_ly: 0,
            unit_of_measure: "%",
          },
          {
            label_value: "Premium",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac_delta: 2.1,
            ac_vs_ly: 0.4,
            ac_vs_ly_direction: "up",
            comp_unit_of_measure: "pp",
          },
          {
            label_value: "YTD'26",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac_delta: 2.1,
            ac_vs_ly: 0,
          },
        ],
      },
    });

    expect(result.chartHeader.title).toBe("Brand Power");
    expect(result.tabs).toBeUndefined();
    expect(result.rows).toHaveLength(3);
    expect(result.rows[0].type).toBe("start");
    expect(result.rows[1]).toMatchObject({
      title: "Premium",
      value: 2.1,
      formattedBarLabel: "2.10",
      formattedDelta: "0.4pp",
      deltaTone: "positive",
    });
    expect(result.rows[2].type).toBe("end");
  });

  it("renders QTD period as 'LQ' in the header", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: [
          {
            label_value: "Q1'26",
            dt_ini: "2026-01-01T00:00:00.000Z",
            dt_end: "2026-03-31T00:00:00.000Z",
            period: "QTD",
            ac_delta: 0,
            ac_vs_ly: 0,
            unit_of_measure: "%",
          },
        ],
      },
    });

    expect(result.chartHeader.period).toContain("LQ");
  });

  it("emits negative tone when ac_delta is zero (zero treated as negative)", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: [
          {
            label_value: "YTD'25",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac_delta: 0,
            ac_vs_ly: 0,
            ac_vs_ly_direction: "up",
            comp_unit_of_measure: "pp",
          },
          {
            label_value: "Hoegaarden",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac_delta: 0,
            ac_vs_ly: 0,
            ac_vs_ly_direction: "up",
            comp_unit_of_measure: "pp",
          },
          {
            label_value: "YTD'26",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac_delta: 0,
            ac_vs_ly: 0,
            ac_vs_ly_direction: "up",
            comp_unit_of_measure: "pp",
          },
        ],
      },
    });

    expect(result.rows[1]).toMatchObject({
      title: "Hoegaarden",
      deltaTone: "negative",
    });
  });

  it("emits a noticeMessage when the datasource is empty", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: { waterfall: [] },
    });

    expect(result.noticeMessage).toBe("Data not available");
    expect(result.rows).toEqual([]);
  });
});
