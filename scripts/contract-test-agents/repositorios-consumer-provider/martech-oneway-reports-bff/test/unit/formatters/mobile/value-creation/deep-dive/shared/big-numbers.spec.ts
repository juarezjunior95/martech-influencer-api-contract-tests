import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("mobile deep-dive big-numbers formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/infrastructure/formatters/mobile/value-creation/deep-dive/shared/big-numbers.jsonata",
      ),
      "utf8",
    );
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("returns cards with LY and BU deltas when the datasource has budget", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        bigNumbers: [
          {
            kpi_name: "volume",
            period: "YTD",
            dt_ini: "2026-01-01T00:00:00.000Z",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 136411.8,
            ac_vs_ly: 0.8,
            ac_vs_bu: 1.8,
            variationDirectionVsLy: "up",
            variationDirectionVsBu: "up",
            unit_of_measure: "K/hL",
            comp_unit_of_measure: "%",
          },
        ],
      },
    });

    expect(result.chartHeader.title).toBe("Volume");
    expect(result.cards[0]).toMatchObject({
      id: "ytd",
      periodLabel: "YTD",
      periodChipLabel: "Jan-Mar'26 YTD",
      absoluteValue: "136,411.8",
    });
    expect(result.cards[0].deltas).toHaveLength(2);
    expect(result.cards[0].deltas[0]).toMatchObject({
      formattedValue: "0.8%",
      comparisonLabel: "LY",
      tone: "positive",
    });
  });

  it("returns only LY deltas when the datasource has no budget", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        bigNumbers: [
          {
            kpi_name: "market_share",
            period: "YTD",
            dt_ini: "2026-01-01T00:00:00.000Z",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 52.1,
            ac_vs_ly: -0.2,
            variationDirectionVsLy: "down",
            unit_of_measure: "%",
            comp_unit_of_measure: "pp",
          },
        ],
      },
    });

    expect(result.chartHeader.title).toBe("Market Share");
    expect(result.cards[0].deltas).toEqual([
      {
        formattedValue: "-0.2pp",
        comparisonLabel: "LY",
        tone: "negative",
      },
    ]);
  });

  it("reads KPI title from kpi when kpi_name is absent", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        bigNumbers: [
          {
            kpi: "nr",
            period: "YTD",
            dt_ini: "2026-01-01T00:00:00.000Z",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 2500,
            ac_vs_ly: 8.4,
            variationDirectionVsLy: "up",
            unit_of_measure: "$Mio",
          },
        ],
      },
    });

    expect(result.chartHeader.title).toBe("Net Revenue");
  });

  it("emits positive tone for zero deltas (web $getTrend parity)", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        bigNumbers: [
          {
            kpi_name: "volume",
            period: "YTD",
            dt_ini: "2026-01-01T00:00:00.000Z",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 1000,
            ac_vs_ly: 0,
            ac_vs_bu: 0,
            variationDirectionVsLy: "up",
            variationDirectionVsBu: "up",
            unit_of_measure: "K/hL",
            comp_unit_of_measure: "%",
          },
        ],
      },
    });

    expect(result.cards[0].deltas[0]).toMatchObject({
      formattedValue: "0.0%",
      tone: "positive",
    });
    expect(result.cards[0].deltas[1]).toMatchObject({
      formattedValue: "0.0%",
      tone: "positive",
    });
  });

  it("emits a noticeMessage when the datasource is empty", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: { bigNumbers: [] },
    });

    expect(result.noticeMessage).toBe("Data not available");
    expect(result.cards).toHaveLength(3);
    expect(result.cards[0]).toMatchObject({ id: "ytd", deltas: [] });
  });

  it("omits noticeMessage when at least one period has data", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        bigNumbers: [
          {
            kpi_name: "volume",
            period: "YTD",
            dt_ini: "2026-01-01T00:00:00.000Z",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 100,
            ac_vs_ly: 1,
            variationDirectionVsLy: "up",
            comp_unit_of_measure: "%",
          },
        ],
      },
    });

    expect(result.noticeMessage).toBeUndefined();
  });
});
