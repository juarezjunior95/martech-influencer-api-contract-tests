import jsonata from "jsonata";
import { loadCompiledJsonata } from "../../../../../helpers/jsonata";

describe("PR Pages Volume - big-numbers formatter - JSONata Output", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = loadCompiledJsonata(
      "src/infrastructure/formatters/value-creation/pr-pages/volume/big-numbers.jsonata",
    );
  });

  const createMockData = (overrides: Record<string, any> = {}) => ({
    dt_ini: "2026-03-01T00:00:00.000Z",
    dt_end: "2026-03-01T00:00:00.000Z",
    period: "MTD",
    ac: 51448.11,
    ac_vs_ly: 2.82,
    variationDirectionVsLy: "up",
    ac_vs_bu: -1.7,
    variationDirectionVsBu: "down",
    ...overrides,
  });

  const createFullInput = (data: any[]) => ({
    datasources: {
      "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
        data,
    },
  });

  it("should return 3 cards (MTD, L3M, YTD) with vs LY + vs BU when all data present", async () => {
    const mockInput = createFullInput([
      createMockData({
        dt_ini: "2026-03-01T00:00:00.000Z",
        dt_end: "2026-03-01T00:00:00.000Z",
        period: "MTD",
        ac: 51448.11,
        ac_vs_ly: 2.82,
        variationDirectionVsLy: "up",
        ac_vs_bu: -1.7,
        variationDirectionVsBu: "down",
      }),
      createMockData({
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-03-01T00:00:00.000Z",
        period: "L3M",
        ac: 139165.88,
        ac_vs_ly: -1.6,
        variationDirectionVsLy: "down",
        ac_vs_bu: -4.61,
        variationDirectionVsBu: "down",
      }),
      createMockData({
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-03-01T00:00:00.000Z",
        period: "YTD",
        ac: 561100.19,
        ac_vs_ly: -2.36,
        variationDirectionVsLy: "down",
        ac_vs_bu: -3.82,
        variationDirectionVsBu: "down",
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    const mtdCard = result[0];
    expect(mtdCard.header.title).toBe("Month");
    expect(mtdCard.header.period).toBe("Mar'26");
    expect(mtdCard.data.length).toBe(2);

    expect(mtdCard.data[0].bigNumber.value).toEqual(["2.8"]);
    expect(mtdCard.data[0].bigNumber.measure).toBe("%");
    expect(mtdCard.data[0].bigNumber.color).toBe("#007800");
    expect(mtdCard.bottomInfo.secondaryInfo.value).toBe("51,448.1");
    expect(mtdCard.bottomInfo.secondaryInfo.label).toBe("[k hl]");
    expect(mtdCard.data[0].comparison.label).toBe("vs");
    expect(mtdCard.data[0].comparison.value).toBe("LY");

    expect(mtdCard.data[1].bigNumber.value).toEqual(["-1.7"]);
    expect(mtdCard.data[1].bigNumber.measure).toBe("%");
    expect(mtdCard.data[1].bigNumber.color).toBe("#B91C1C");
    expect(mtdCard.data[1].comparison.label).toBe("vs");
    expect(mtdCard.data[1].comparison.value).toBe("BU");

    const l3mCard = result[1];
    expect(l3mCard.header.title).toBe("L3M");
    expect(l3mCard.data.length).toBe(2);
    expect(l3mCard.data[0].bigNumber.value).toEqual(["-1.6"]);
    expect(l3mCard.data[0].bigNumber.color).toBe("#B91C1C");
    expect(l3mCard.data[1].bigNumber.value).toEqual(["-4.6"]);
    expect(l3mCard.data[1].comparison.value).toBe("BU");

    const ytdCard = result[2];
    expect(ytdCard.header.title).toBe("YTD");
    expect(ytdCard.header.period).toContain("Jan'26");
    expect(ytdCard.data.length).toBe(2);
    expect(ytdCard.data[0].bigNumber.value).toEqual(["-2.4"]);
    expect(ytdCard.data[1].bigNumber.value).toEqual(["-3.8"]);
  });

  it("should return cards with vs LY + vs BU dash when ac_vs_bu is absent", async () => {
    const mockInput = createFullInput([
      createMockData({
        period: "MTD",
        ac_vs_bu: undefined,
        variationDirectionVsBu: undefined,
      }),
      createMockData({
        dt_ini: "2026-01-01T00:00:00.000Z",
        period: "L3M",
        ac_vs_bu: undefined,
        variationDirectionVsBu: undefined,
      }),
      createMockData({
        dt_ini: "2026-01-01T00:00:00.000Z",
        period: "YTD",
        ac_vs_bu: undefined,
        variationDirectionVsBu: undefined,
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.length).toBe(3);
    result.forEach((card: any) => {
      expect(card.data.length).toBe(2);
      expect(card.data[0].comparison.value).toBe("LY");
      expect(card.data[1].comparison.value).toBe("BU");
      expect(card.data[1].bigNumber.value).toEqual(["-"]);
    });
  });

  it("should return empty data when no datasource available", async () => {
    const mockInput = { datasources: {} };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    expect(result[0].header.title).toBe("Month");
    expect(result[0].header.period).toBe("");
    expect(result[0].data).toEqual([]);

    expect(result[1].header.title).toBe("L3M");
    expect(result[1].data).toEqual([]);

    expect(result[2].header.title).toBe("YTD");
    expect(result[2].data).toEqual([]);
  });

  it("should handle partial periods - only MTD present", async () => {
    const mockInput = createFullInput([
      createMockData({
        period: "MTD",
        ac_vs_bu: 1.5,
        variationDirectionVsBu: "up",
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.length).toBe(3);

    expect(result[0].header.title).toBe("Month");
    expect(result[0].data.length).toBe(2);
    expect(result[0].data[0].comparison.value).toBe("LY");
    expect(result[0].data[1].comparison.value).toBe("BU");

    expect(result[1].data).toEqual([]);
    expect(result[2].data).toEqual([]);
  });

  it("should handle null ac_vs_bu gracefully (vs BU shows dash)", async () => {
    const mockInput = createFullInput([
      createMockData({
        period: "MTD",
        ac_vs_bu: null,
        variationDirectionVsBu: null,
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].data.length).toBe(2);
    expect(result[0].data[0].comparison.value).toBe("LY");
    expect(result[0].data[1].comparison.value).toBe("BU");
    expect(result[0].data[1].bigNumber.value).toEqual(["-"]);
  });

  it("should format positive and negative variations correctly", async () => {
    const mockInput = createFullInput([
      createMockData({
        period: "YTD",
        dt_ini: "2026-01-01T00:00:00.000Z",
        ac_vs_ly: 5.5,
        variationDirectionVsLy: "up",
        ac_vs_bu: -2.3,
        variationDirectionVsBu: "down",
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    const ytdCard = result[2];
    expect(ytdCard.data[0].bigNumber.value).toEqual(["5.5"]);
    expect(ytdCard.data[0].bigNumber.color).toBe("#007800");
    expect(ytdCard.data[1].bigNumber.value).toEqual(["-2.3"]);
    expect(ytdCard.data[1].bigNumber.color).toBe("#B91C1C");
  });

  it("should format large secondary values with thousands separator", async () => {
    const mockInput = createFullInput([
      createMockData({
        period: "MTD",
        ac: 1234567.89,
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].bottomInfo.secondaryInfo.value).toBe("1,234,567.9");
  });

  it("should show dash for non-numeric ac value", async () => {
    const mockInput = createFullInput([
      createMockData({
        period: "MTD",
        ac: null,
        ac_vs_bu: -1.0,
        variationDirectionVsBu: "down",
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].bottomInfo.secondaryInfo.value).toBe("-");
    expect(result[0].data.length).toBe(2);
  });

  it("should generate correct YTD period label", async () => {
    const mockInput = createFullInput([
      createMockData({
        period: "YTD",
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-03-01T00:00:00.000Z",
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result[2].header.period).toBe("Jan'26-Mar'26");
  });

  it("should generate correct L3M period label", async () => {
    const mockInput = createFullInput([
      createMockData({
        period: "L3M",
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-03-01T00:00:00.000Z",
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result[1].header.period).toBe("Jan'26-Mar'26");
  });
});
