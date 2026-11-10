import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("strategy-drivers/pos formatter (value-creation home)", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/home/strategy-drivers/pos.jsonata",
  );

  type StrategyDriverRow = {
    kpi_name: string;
    dt_ini: string;
    dt_end: string;
    ac_vs_ly: number;
    variationDirectionVsLy: string;
    comp_unit_of_measure?: string;
    period?: string;
  };

  const createMockInput = (dataRows: StrategyDriverRow[]) => ({
    datasources: {
      "value-creation_home_strategy-drivers_pos": dataRows,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return 3 cards with chartHeader and bigNumberData when all KPIs have data", async () => {
    const dataRows: StrategyDriverRow[] = [
      {
        kpi_name: "p7d",
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        ac_vs_ly: 8.0,
        variationDirectionVsLy: "up",
        comp_unit_of_measure: "pp",
      },
      {
        kpi_name: "occasions",
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-09-30T00:00:00.000Z",
        ac_vs_ly: 3.2,
        variationDirectionVsLy: "down",
      },
      {
        kpi_name: "p4w",
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-31T00:00:00.000Z",
        ac_vs_ly: 12.5,
        variationDirectionVsLy: "up",
        comp_unit_of_measure: "%",
      },
    ];

    const mockInput = createMockInput(dataRows);
    const result = await evaluateExpression(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);

    // Card 1: ABI Lovers (p7d)
    expect(result[0].chartHeader).toEqual({
      title: "ABI Lovers",
      period: "Q2-Q2'25",
    });
    expect(result[0].bigNumberData).toHaveLength(1);
    expect(result[0].bigNumberData[0].bigNumber).toEqual({
      value: "8.0",
      measure: "pp",
      trend: "positive",
    });
    expect(result[0].bigNumberData[0].comparison).toEqual({
      label: "vs",
      value: "LY",
    });
    expect(result[0].noticeMessage).toBeUndefined();

    // Card 2: Occasions
    expect(result[1].chartHeader).toEqual({
      title: "Occasions",
      period: "Q1-Q3'25",
    });
    expect(result[1].bigNumberData).toHaveLength(1);
    expect(result[1].bigNumberData[0].bigNumber).toEqual({
      value: "3.2",
      measure: "%",
      trend: "negative",
    });
    expect(result[1].noticeMessage).toBeUndefined();

    // Card 3: LDA-24 Participation (p4w)
    expect(result[2].chartHeader).toEqual({
      title: "LDA-24 Participation",
      period: "Q1-Q4'25",
    });
    expect(result[2].bigNumberData).toHaveLength(1);
    expect(result[2].bigNumberData[0].bigNumber).toEqual({
      value: "12.5",
      measure: "%",
      trend: "positive",
    });
    expect(result[2].noticeMessage).toBeUndefined();
  });

  it("should return chartHeader + empty bigNumberData for missing KPI, empty period when no KPI row", async () => {
    const dataRows: StrategyDriverRow[] = [
      {
        kpi_name: "p7d",
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac_vs_ly: 5.5,
        variationDirectionVsLy: "down",
        comp_unit_of_measure: "pp",
      },
      {
        kpi_name: "p4w",
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-31T00:00:00.000Z",
        ac_vs_ly: 10.0,
        variationDirectionVsLy: "up",
        comp_unit_of_measure: "%",
      },
    ];

    const mockInput = createMockInput(dataRows);
    const result = await evaluateExpression(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);

    // Card 1: ABI Lovers – has data (p7d)
    expect(result[0].chartHeader.title).toBe("ABI Lovers");
    expect(result[0].chartHeader.period).toBe("Q1-Q1'25");
    expect(result[0].bigNumberData).toHaveLength(1);
    expect(result[0].bigNumberData[0].bigNumber.value).toBe("5.5");
    expect(result[0].noticeMessage).toBeUndefined();

    // Card 2: Occasions – no row; period stays empty (no KPI row)
    expect(result[1].chartHeader).toEqual({
      title: "Occasions",
      period: "",
    });
    expect(result[1].noticeMessage).toBe("Data not available");
    expect(result[1].bigNumberData).toEqual([]);

    // Card 3: LDA-24 Participation – has data (p4w)
    expect(result[2].chartHeader.title).toBe("LDA-24 Participation");
    expect(result[2].chartHeader.period).toBe("Q1-Q4'25");
    expect(result[2].bigNumberData).toHaveLength(1);
    expect(result[2].bigNumberData[0].bigNumber.value).toBe("10.0");
    expect(result[2].noticeMessage).toBeUndefined();
  });

  it("should return 3 cards with empty bigNumberData and empty period when datasource is empty", async () => {
    const mockInput = createMockInput([]);
    const result = await evaluateExpression(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);

    result.forEach(
      (card: {
        chartHeader: { title: string; period: string };
        noticeMessage: string;
        bigNumberData: unknown[];
      }) => {
        expect(card.chartHeader.period).toBe("");
        expect(card.noticeMessage).toBe("Data not available");
        expect(card.bigNumberData).toEqual([]);
      },
    );

    expect(result[0].chartHeader.title).toBe("ABI Lovers");
    expect(result[1].chartHeader.title).toBe("Occasions");
    expect(result[2].chartHeader.title).toBe("LDA-24 Participation");
  });

  it("should match mixed-card mock shape when only one KPI has rows", async () => {
    const dataRows: StrategyDriverRow[] = [
      {
        kpi_name: "occasions",
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-03-31T00:00:00.000Z",
        ac_vs_ly: 0.3,
        variationDirectionVsLy: "up",
      },
    ];

    const result = await evaluateExpression(createMockInput(dataRows));

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      chartHeader: { title: "ABI Lovers", period: "" },
      noticeMessage: "Data not available",
      bigNumberData: [],
    });

    expect(result[1].chartHeader).toEqual({
      title: "Occasions",
      period: "Q1-Q1'26",
    });
    expect(result[1].bigNumberData).toHaveLength(1);
    expect(result[1].bigNumberData[0].bigNumber).toEqual({
      value: "0.3",
      measure: "%",
      trend: "positive",
    });
    expect(result[1].bigNumberData[0].comparison).toEqual({
      label: "vs",
      value: "LY",
    });
    expect(result[1].noticeMessage).toBeUndefined();

    expect(result[2]).toEqual({
      chartHeader: { title: "LDA-24 Participation", period: "" },
      noticeMessage: "Data not available",
      bigNumberData: [],
    });
  });
});
