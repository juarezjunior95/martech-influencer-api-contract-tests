import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

type MegabrandsQwoaEntry = {
  dt_end: string;
  refreshMonthLabel: string;
  ac_vs_ly: number | null;
  variationDirectionVsLy: string;
  lyMonthLabel: string;
  ac: number | null;
};

type CampaignsQwoaEntry = {
  dt_end: string;
  refreshMonthLabel: string;
  ac_vs_ly: number | null;
  variationDirectionVsLy: string;
  lyMonthLabel: string;
  ac: number | null;
};

describe("Connections and Creativity Home Resource Allocation Formatter", () => {
  let compiledExpression: jsonata.Expression;

  const MEGABRANDS_QWOA_DATASOURCE_KEY = "megabrands-qwoa";
  const CAMPAIGNS_QWOA_DATASOURCE_KEY = "campaigns-qwoa";
  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/connections-and-creativity/home/resource-allocation.jsonata",
  );

  // Helper function to create a megabrands qwoa entry
  const createMegabrandsQwoaEntry = (
    overrides: Partial<MegabrandsQwoaEntry> = {},
  ): MegabrandsQwoaEntry => ({
    dt_end: "2025-12-01T00:00:00.000Z",
    refreshMonthLabel: "Dec'25",
    ac_vs_ly: 2.5,
    variationDirectionVsLy: "up",
    lyMonthLabel: "Dec'24",
    ac: 85.4,
    ...overrides,
  });

  // Helper function to create a campaigns qwoa entry
  const createCampaignsQwoaEntry = (
    overrides: Partial<CampaignsQwoaEntry> = {},
  ): CampaignsQwoaEntry => ({
    dt_end: "2025-12-01T00:00:00.000Z",
    refreshMonthLabel: "Dec'25",
    ac_vs_ly: 3.8,
    variationDirectionVsLy: "down",
    lyMonthLabel: "Dec'24",
    ac: 72.1,
    ...overrides,
  });

  // Helper function to create mock input
  const createMockInput = (
    megabrandsQwoaEntries: MegabrandsQwoaEntry[] = [],
    campaignsQwoaEntries: CampaignsQwoaEntry[] = [],
  ) => ({
    datasources: {
      [MEGABRANDS_QWOA_DATASOURCE_KEY]: megabrandsQwoaEntries,
      [CAMPAIGNS_QWOA_DATASOURCE_KEY]: campaignsQwoaEntries,
    },
  });

  // Helper function to evaluate expression
  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => {
    return await compiledExpression.evaluate(input);
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  describe("Basic structure", () => {
    it("should return both big number objects", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry()],
        [createCampaignsQwoaEntry()],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result).toHaveProperty("megabrandsQwoaBigNumber");
      expect(result).toHaveProperty("campaignsQwoaBigNumber");
    });

    it("should have correct titles for each big number", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry()],
        [createCampaignsQwoaEntry()],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.megabrandsQwoaBigNumber.title).toBe("Megabrands QWOA");
      expect(result.campaignsQwoaBigNumber.title).toBe("Campaigns QWOA");
    });
  });

  describe("Megabrands QWOA Big Number", () => {
    it("should use correct period from refreshMonthLabel", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ refreshMonthLabel: "Dec'25" })],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.megabrandsQwoaBigNumber.period).toBe("Dec'25");
    });

    it("should format bigNumber correctly", async () => {
      const mockInput = createMockInput(
        [
          createMegabrandsQwoaEntry({
            ac_vs_ly: 2.5,
            variationDirectionVsLy: "up",
          }),
        ],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const bigNumber =
        result.megabrandsQwoaBigNumber.bigNumberData[0].bigNumber;

      expect(bigNumber.value).toBe("2.5");
      expect(bigNumber.measure).toBe("pp");
      expect(bigNumber.trend).toBe("positive");
    });

    it("should format comparison correctly", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ lyMonthLabel: "Dec'24" })],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const comparison =
        result.megabrandsQwoaBigNumber.bigNumberData[0].comparison;

      expect(comparison.label).toBe("vs");
      expect(comparison.value).toBe("LY");
    });

    it("should format secondaryInfo correctly", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ ac: 85.4 })],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const secondaryInfo =
        result.megabrandsQwoaBigNumber.bigNumberData[0].secondaryInfo;

      expect(secondaryInfo.label).toBe("[ % ]");
      expect(secondaryInfo.value).toBe("85.4");
    });
  });

  describe("Campaigns QWOA Big Number", () => {
    it("should use correct period from refreshMonthLabel", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry()],
        [createCampaignsQwoaEntry({ refreshMonthLabel: "Nov'25" })],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.campaignsQwoaBigNumber.period).toBe("Nov'25");
    });

    it("should format bigNumber correctly", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry()],
        [
          createCampaignsQwoaEntry({
            ac_vs_ly: 3.8,
            variationDirectionVsLy: "down",
          }),
        ],
      );

      const result: any = await evaluateExpression(mockInput);
      const bigNumber =
        result.campaignsQwoaBigNumber.bigNumberData[0].bigNumber;

      expect(bigNumber.value).toBe("3.8");
      expect(bigNumber.measure).toBe("pp");
      expect(bigNumber.trend).toBe("negative");
    });

    it("should format comparison correctly", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry()],
        [createCampaignsQwoaEntry({ lyMonthLabel: "Nov'24" })],
      );

      const result: any = await evaluateExpression(mockInput);
      const comparison =
        result.campaignsQwoaBigNumber.bigNumberData[0].comparison;

      expect(comparison.label).toBe("vs");
      expect(comparison.value).toBe("LY");
    });

    it("should format secondaryInfo correctly", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry()],
        [createCampaignsQwoaEntry({ ac: 72.1 })],
      );

      const result: any = await evaluateExpression(mockInput);
      const secondaryInfo =
        result.campaignsQwoaBigNumber.bigNumberData[0].secondaryInfo;

      expect(secondaryInfo.label).toBe("[ % ]");
      expect(secondaryInfo.value).toBe("72.1");
    });
  });

  describe("Data filtering by dt_end", () => {
    it("should filter campaigns data by reference dt_end from megabrands", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ dt_end: "2025-12-01T00:00:00.000Z" })],
        [
          createCampaignsQwoaEntry({
            dt_end: "2025-06-01T00:00:00.000Z",
            ac_vs_ly: 10.0,
          }),
          createCampaignsQwoaEntry({
            dt_end: "2025-12-01T00:00:00.000Z",
            ac_vs_ly: 3.8,
          }),
        ],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.campaignsQwoaBigNumber.bigNumberData[0].bigNumber.value,
      ).toBe("3.8");
    });

    it("should return empty bigNumberData when no campaigns data matches dt_end filter", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ dt_end: "2025-12-01T00:00:00.000Z" })],
        [
          createCampaignsQwoaEntry({
            dt_end: "2025-06-01T00:00:00.000Z",
          }),
        ],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.campaignsQwoaBigNumber.bigNumberData).toEqual([]);
    });

    it("should filter megabrands data by its own dt_end", async () => {
      const mockInput = createMockInput(
        [
          createMegabrandsQwoaEntry({
            dt_end: "2025-12-01T00:00:00.000Z",
            ac_vs_ly: 2.5,
          }),
          createMegabrandsQwoaEntry({
            dt_end: "2025-06-01T00:00:00.000Z",
            ac_vs_ly: 1.0,
          }),
        ],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.megabrandsQwoaBigNumber.bigNumberData[0].bigNumber.value,
      ).toBe("2.5");
    });
  });

  describe("Trend mapping", () => {
    it("should map 'up' direction to 'positive' trend", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ variationDirectionVsLy: "up" })],
        [createCampaignsQwoaEntry({ variationDirectionVsLy: "up" })],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.megabrandsQwoaBigNumber.bigNumberData[0].bigNumber.trend,
      ).toBe("positive");
      expect(
        result.campaignsQwoaBigNumber.bigNumberData[0].bigNumber.trend,
      ).toBe("positive");
    });

    it("should map 'down' direction to 'negative' trend", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ variationDirectionVsLy: "down" })],
        [createCampaignsQwoaEntry({ variationDirectionVsLy: "down" })],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.megabrandsQwoaBigNumber.bigNumberData[0].bigNumber.trend,
      ).toBe("negative");
      expect(
        result.campaignsQwoaBigNumber.bigNumberData[0].bigNumber.trend,
      ).toBe("negative");
    });
  });

  describe("Value formatting", () => {
    it("should format numbers with thousands separator", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ ac: 1234567.8 })],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.megabrandsQwoaBigNumber.bigNumberData[0].secondaryInfo.value,
      ).toBe("1,234,567.8");
    });

    it("should return '-' for null ac_vs_ly values", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ ac_vs_ly: null })],
        [createCampaignsQwoaEntry({ ac_vs_ly: null })],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.megabrandsQwoaBigNumber.bigNumberData[0].bigNumber.value,
      ).toBe("-");
      expect(
        result.campaignsQwoaBigNumber.bigNumberData[0].bigNumber.value,
      ).toBe("-");
    });

    it("should return '-' for null ac values", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ ac: null })],
        [createCampaignsQwoaEntry({ ac: null })],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.megabrandsQwoaBigNumber.bigNumberData[0].secondaryInfo.value,
      ).toBe("-");
      expect(
        result.campaignsQwoaBigNumber.bigNumberData[0].secondaryInfo.value,
      ).toBe("-");
    });

    it("should handle negative values correctly", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ ac_vs_ly: -5.3 })],
        [createCampaignsQwoaEntry({ ac_vs_ly: -2.1 })],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.megabrandsQwoaBigNumber.bigNumberData[0].bigNumber.value,
      ).toBe("-5.3");
      expect(
        result.campaignsQwoaBigNumber.bigNumberData[0].bigNumber.value,
      ).toBe("-2.1");
    });

    it("should format large numbers correctly", async () => {
      const mockInput = createMockInput(
        [createMegabrandsQwoaEntry({ ac: 1234567.89 })],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.megabrandsQwoaBigNumber.bigNumberData[0].secondaryInfo.value,
      ).toBe("1,234,567.9");
    });
  });

  describe("Empty datasources", () => {
    it("should handle all empty datasources", async () => {
      const mockInput = createMockInput([], []);

      const result: any = await evaluateExpression(mockInput);

      expect(result.megabrandsQwoaBigNumber.bigNumberData).toEqual([]);
      expect(result.campaignsQwoaBigNumber.bigNumberData).toEqual([]);
    });

    it("should handle empty megabrands datasource", async () => {
      const mockInput = createMockInput([], [createCampaignsQwoaEntry()]);

      const result: any = await evaluateExpression(mockInput);

      expect(result.megabrandsQwoaBigNumber.bigNumberData).toEqual([]);
    });

    it("should handle empty campaigns datasource", async () => {
      const mockInput = createMockInput([createMegabrandsQwoaEntry()], []);

      const result: any = await evaluateExpression(mockInput);

      expect(result.megabrandsQwoaBigNumber.bigNumberData).toHaveLength(1);
      expect(result.campaignsQwoaBigNumber.bigNumberData).toEqual([]);
    });
  });
});
