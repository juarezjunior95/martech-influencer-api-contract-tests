import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("mobile deep-dive waterfall-finance formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/infrastructure/formatters/mobile/value-creation/deep-dive/shared/waterfall-finance.jsonata",
      ),
      "utf8",
    );
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("emits flat rows from the single waterfall datasource (Volume)", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: [
          {
            kpi_name: "volume",
            step_name: "YTD'25",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 100,
            ac_vs_ly: 0,
            unit_of_measure: "K/hL",
          },
          {
            kpi_name: "volume",
            step_name: "Megabrands",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 12.5,
            ac_vs_ly: 1.2,
            variationDirectionVsLy: "up",
            comp_unit_of_measure: "%",
          },
          {
            kpi_name: "volume",
            step_name: "Tail",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: -5,
            ac_vs_ly: -0.4,
            variationDirectionVsLy: "down",
            comp_unit_of_measure: "%",
          },
          {
            kpi_name: "volume",
            step_name: "YTD'26",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 107.5,
            ac_vs_ly: 0,
          },
        ],
      },
    });

    expect(result.chartHeader.title).toBe("Volume");
    expect(result.tabs).toBeUndefined();
    expect(result.rows).toHaveLength(4);
    expect(result.rows[0]).toMatchObject({
      title: "YTD'25",
      type: "start",
      value: 100,
    });
    expect(result.rows[1]).toMatchObject({
      title: "Megabrands",
      type: "positive",
      value: 12.5,
      formattedDelta: "1.2%",
      deltaTone: "positive",
    });
    expect(result.rows[2]).toMatchObject({
      title: "Tail",
      type: "negative",
      formattedDelta: "-0.4%",
      deltaTone: "negative",
    });
    expect(result.rows[3].type).toBe("end");
  });

  it("unwraps the data-service { large } envelope when present", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: {
          large: [
            {
              kpi_name: "nr",
              step_name: "YTD'26",
              dt_end: "2026-03-31T00:00:00.000Z",
              ac: 1000,
              ac_vs_ly: 1.4,
              variationDirectionVsLy: "up",
              unit_of_measure: "$Mio",
            },
          ],
          small: [],
        },
      },
    });

    expect(result.chartHeader.title).toBe("Net Revenue");
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].value).toBe(1000);
  });

  it("falls back to `small` when `large` is empty", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: {
          large: [],
          small: [
            {
              kpi_name: "cores",
              step_name: "YTD'26",
              dt_end: "2026-03-31T00:00:00.000Z",
              ac: 50,
              ac_vs_ly: -0.1,
            },
          ],
        },
      },
    });

    expect(result.chartHeader.title).toBe("CORES");
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].value).toBe(50);
  });

  it("reads KPI title from kpi when kpi_name is absent", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: [
          {
            kpi: "nr",
            step_name: "YTD'26",
            ac: 1000,
            ac_vs_ly: 1.4,
            variationDirectionVsLy: "up",
          },
        ],
      },
    });

    expect(result.chartHeader.title).toBe("Net Revenue");
  });

  it("emits positive tone for zero deltas (web $getTrend parity)", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: [
          {
            kpi_name: "volume",
            step_name: "Segment",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 0,
            ac_vs_ly: 0,
            variationDirectionVsLy: "up",
          },
        ],
      },
    });

    expect(result.rows[0]).toMatchObject({
      formattedDelta: "0.0%",
      deltaTone: "positive",
    });
  });

  it("labels rows from the Net Revenue data-service shape (label_value + period, no step_name)", async () => {
    // Mirrors the output of
    // `data-service/.../drill-down/finance/net-revenue/waterfall.handler.ts`,
    // which renames `step_name` → `period` and replaces the raw label
    // columns with `label_value` (string or string[]). See
    // `docs/bff_deep_dive_performance_tool.md`.
    const result: any = await compiledExpression.evaluate({
      datasources: {
        waterfall: {
          large: [
            {
              waterfall_filter: "portfolio",
              period: "YTD'25",
              label_value: "",
              ac: 18211,
              ac_vs_ly: 0,
              unit_of_measure: "$Mio",
            },
            {
              waterfall_filter: "portfolio",
              period: "Megabrands",
              label_value: "Megabrands",
              ac: 754.7,
              ac_vs_ly: 7.5,
              ac_vs_ly_direction: "up",
              comp_unit_of_measure: "%",
            },
            {
              waterfall_filter: "brand",
              period: "Brahma",
              label_value: ["Brahma"],
              ac: 12.3,
              ac_vs_ly: 4.8,
              ac_vs_ly_direction: "up",
              comp_unit_of_measure: "%",
            },
            {
              waterfall_filter: "portfolio",
              period: "Premium",
              label_value: ["Premium", "USA"],
              ac: -425.4,
              ac_vs_ly: -18.6,
              ac_vs_ly_direction: "down",
              comp_unit_of_measure: "%",
            },
            {
              waterfall_filter: "country",
              period: "GBR",
              label_value: "GBR",
              ac: 750,
              ac_vs_ly: 3.2,
              ac_vs_ly_direction: "up",
              comp_unit_of_measure: "%",
            },
            {
              waterfall_filter: "portfolio",
              period: "YTD'26",
              label_value: "",
              ac: 20456.4,
              ac_vs_ly: 0,
            },
          ],
          small: [],
        },
      },
    });

    expect(result.rows).toHaveLength(6);
    expect(result.rows[0].title).toBe("YTD'25");
    expect(result.rows[1].title).toBe("Megabrands");
    expect(result.rows[2].title).toBe("Brahma");
    expect(result.rows[3].title).toBe("Premium");
    expect(result.rows[4].title).toBe("GBR");
    expect(result.rows[5].title).toBe("YTD'26");
  });

  it("emits a noticeMessage when the datasource is empty", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: { waterfall: [] },
    });

    expect(result.noticeMessage).toBe("Data not available");
    expect(result.rows).toEqual([]);
  });
});
