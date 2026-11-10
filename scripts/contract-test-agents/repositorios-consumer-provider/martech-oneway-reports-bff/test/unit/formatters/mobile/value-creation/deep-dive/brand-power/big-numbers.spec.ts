import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("mobile deep-dive brand-power big-numbers formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/infrastructure/formatters/mobile/value-creation/deep-dive/brand-power/big-numbers.jsonata",
      ),
      "utf8",
    );
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it(
    "reads the delta from `variation_vs_ly` — the actual field name " +
      "shipped by the non-finance overtime-performance datasource " +
      "(matches the web `non-finance/big-numbers` formatter)",
    async () => {
      const result: any = await compiledExpression.evaluate({
        datasources: {
          bigNumbers: [
            {
              period_type: "YTD",
              dt_end: "2026-03-31T00:00:00.000Z",
              value: 53.1,
              variation_vs_ly: 0.8,
              variation_direction_vs_ly: "up",
              comp_unit_of_measure: "pp",
            },
            {
              period_type: "2026 QTD",
              dt_end: "2026-03-31T00:00:00.000Z",
              value: 52.4,
              variation_vs_ly: -0.3,
              variation_direction_vs_ly: "down",
              comp_unit_of_measure: "pp",
            },
          ],
        },
      });

      expect(result.chartHeader.title).toBe("Brand Power");
      expect(result.cards).toHaveLength(2);
      expect(result.cards[0]).toMatchObject({
        id: "ytd",
        absoluteValue: "53.1",
      });
      expect(result.cards[0].deltas[0]).toMatchObject({
        formattedValue: "0.8pp",
        comparisonLabel: "LY",
        tone: "positive",
      });
      expect(result.cards[1].deltas[0]).toMatchObject({
        formattedValue: "-0.3pp",
        comparisonLabel: "LY",
        tone: "negative",
      });
    },
  );

  it(
    "falls back to legacy `ac_vs_ly` when only that field is set — " +
      "keeps mocked fixtures and any future datasource re-keying " +
      "from breaking the screen",
    async () => {
      const result: any = await compiledExpression.evaluate({
        datasources: {
          bigNumbers: [
            {
              period_type: "YTD",
              dt_end: "2026-03-31T00:00:00.000Z",
              value: 53.1,
              ac_vs_ly: 0.8,
              variation_direction_vs_ly: "up",
              comp_unit_of_measure: "pp",
            },
          ],
        },
      });

      expect(result.cards[0].deltas[0]).toMatchObject({
        formattedValue: "0.8pp",
        tone: "positive",
      });
    },
  );

  it(
    "falls back to the bare period suffix (`YTD` / `LQ`) when the " +
      "row is missing `dt_end` — matches the real shape returned by " +
      "the non-finance overtime-performance handler today (which " +
      "does not emit `dt_end`) and mirrors the web " +
      "`non-finance/big-numbers` formatter that titles the card " +
      "`Power YTD` / `Power LQ` without a date prefix",
    async () => {
      const result: any = await compiledExpression.evaluate({
        datasources: {
          bigNumbers: [
            {
              period_type: "YTD",
              value: 53.1,
              variation_vs_ly: 0.8,
              variation_direction_vs_ly: "up",
              comp_unit_of_measure: "pp",
            },
            {
              period_type: "2026 QTD",
              value: 53.7,
              variation_vs_ly: 0.1,
              variation_direction_vs_ly: "up",
              comp_unit_of_measure: "pp",
            },
          ],
        },
      });

      expect(result.cards[0]).toMatchObject({
        id: "ytd",
        periodLabel: "YTD",
        periodChipLabel: "YTD",
        absoluteValue: "53.1",
      });
      expect(result.cards[1]).toMatchObject({
        id: "lq",
        periodLabel: "LQ",
        periodChipLabel: "LQ",
        absoluteValue: "53.7",
      });
      expect(result.cards[1].deltas[0]).toMatchObject({
        formattedValue: "0.1pp",
        tone: "positive",
      });
    },
  );

  it(
    "renders a quarter-aligned chip when the row has `dt_end` — " +
      "mirrors Home `$formatHeaderTag` with `$isQuarter = true`",
    async () => {
      const result: any = await compiledExpression.evaluate({
        datasources: {
          bigNumbers: [
            {
              period_type: "YTD",
              dt_ini: "2026-01-01T00:00:00.000Z",
              dt_end: "2026-03-31T00:00:00.000Z",
              value: 53.1,
              variation_vs_ly: 0.8,
              variation_direction_vs_ly: "up",
              comp_unit_of_measure: "pp",
            },
          ],
        },
      });

      expect(result.cards[0]).toMatchObject({
        id: "ytd",
        periodLabel: "YTD",
        periodChipLabel: "Q1'26 YTD",
      });
    },
  );

  it("emits negative tone when zero delta arrives with direction 'down'", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        bigNumbers: [
          {
            period_type: "YTD",
            dt_end: "2026-03-31T00:00:00.000Z",
            value: 53.1,
            variation_vs_ly: 0,
            variation_direction_vs_ly: "down",
            comp_unit_of_measure: "pp",
          },
        ],
      },
    });

    expect(result.cards[0].deltas[0]).toMatchObject({
      formattedValue: "0.0pp",
      tone: "negative",
    });
  });

  it("emits a noticeMessage when the datasource is empty", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: { bigNumbers: [] },
    });

    expect(result.noticeMessage).toBe("Data not available");
    expect(result.cards).toHaveLength(2);
  });
});
