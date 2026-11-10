import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

type StrategyDriverRow = {
  kpi_name: string;
  dt_ini: string;
  dt_end: string;
  ac_vs_ly: number;
  variationDirectionVsLy: string;
  comp_unit_of_measure?: string;
  period?: string;
};

describe("mobile big-numbers formatter (value-creation home)", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/mobile/value-creation/home/big-numbers.jsonata",
  );

  const DATASOURCE_KEY = "value-creation_home_strategy-drivers_pos";

  const createMockInput = (rows: StrategyDriverRow[] = []) => ({
    datasources: {
      [DATASOURCE_KEY]: rows,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  describe("basic structure", () => {
    it("returns three strategy driver cards in fixed order", async () => {
      const rows: StrategyDriverRow[] = [
        {
          kpi_name: "p7d",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac_vs_ly: 2.4,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
          period: "YTD",
        },
        {
          kpi_name: "occasions",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac_vs_ly: -1.1,
          variationDirectionVsLy: "down",
          period: "YTD",
        },
        {
          kpi_name: "p4w",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac_vs_ly: 3.7,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
          period: "YTD",
        },
      ];

      const result: any = await evaluateExpression(createMockInput(rows));

      expect(result).toHaveLength(3);
      expect(result[0].chartHeader.title).toBe("ABI Lovers");
      expect(result[1].chartHeader.title).toBe("Occasions");
      expect(result[2].chartHeader.title).toBe("LDA-24 Participation");

      expect(result[0].bigNumberData[0].comparison).toEqual({
        label: "vs",
        value: "LY",
      });
      expect(result[1].bigNumberData[0].comparison).toEqual({
        label: "vs",
        value: "LY",
      });
      expect(result[2].bigNumberData[0].comparison).toEqual({
        label: "vs",
        value: "LY",
      });
    });
  });

  describe("measure and trend mapping", () => {
    it("uses comp_unit_of_measure when configured and defaults to % for occasions", async () => {
      const rows: StrategyDriverRow[] = [
        {
          kpi_name: "p7d",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac_vs_ly: 2,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
          period: "YTD",
        },
        {
          kpi_name: "occasions",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac_vs_ly: -0.5,
          variationDirectionVsLy: "down",
          period: "YTD",
        },
      ];

      const result: any = await evaluateExpression(createMockInput(rows));

      expect(result[0].bigNumberData[0].bigNumber.measure).toBe("pp");
      expect(result[0].bigNumberData[0].bigNumber.trend).toBe("positive");
      expect(result[1].bigNumberData[0].bigNumber.measure).toBe("%");
      expect(result[1].bigNumberData[0].bigNumber.trend).toBe("negative");
    });
  });

  describe("period formatting", () => {
    it("returns a single quarter for MTD/L3M periods", async () => {
      const rows: StrategyDriverRow[] = [
        {
          kpi_name: "p7d",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-03-31T00:00:00.000Z",
          ac_vs_ly: 1.2,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
          period: "MTD",
        },
      ];

      const result: any = await evaluateExpression(createMockInput(rows));

      expect(result[0].chartHeader.period).toBe("Q1'25");
    });

    it("returns quarter range for non-MTD/L3M periods", async () => {
      const rows: StrategyDriverRow[] = [
        {
          kpi_name: "p7d",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac_vs_ly: 1.2,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
          period: "YTD",
        },
      ];

      const result: any = await evaluateExpression(createMockInput(rows));

      expect(result[0].chartHeader.period).toBe("Q1-Q4'25");
    });
  });

  describe("empty data", () => {
    it("returns notice cards when datasource is empty", async () => {
      const result: any = await evaluateExpression(createMockInput([]));

      expect(result).toHaveLength(3);

      for (const card of result) {
        expect(card.noticeMessage).toBe("Data not available");
        expect(card.bigNumberData).toEqual([]);
        expect(card.chartHeader.period).toBe("");
      }
    });
  });
});
