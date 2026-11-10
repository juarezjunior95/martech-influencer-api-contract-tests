import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

type PortfolioHealthEntry = {
  dt_ini: string;
  dt_end: string;
  country_iso_code_3: string;
  abi_zone: string;
  level_1: string;
  unit_of_measure: string;
  comp_unit_of_measure: string;
  ac: number | null;
  ac_vs_ly: number | null;
  comp_direction: string;
  vs_ly_label_suffix: string;
  variationDirectionVsLy: string;
  refreshMonthLabel: string;
  lyMonthLabel: string;
};

type PillarEntry = {
  dt_ini: string;
  dt_end: string;
  country_iso_code_3: string;
  abi_zone: string;
  kpi_name: string;
  level_1: string;
  unit_of_measure: string;
  comp_unit_of_measure: string;
  ac: number | null;
  ac_vs_ly: number | null;
  average_line: number;
  comp_direction: string;
  vs_ly_label_suffix: string;
  variationDirectionVsLy: string;
  refreshMonthLabel: string;
  lyMonthLabel: string;
  country: string;
  average_line_direction: string;
};

describe("Innovation Home Big Numbers Formatter", () => {
  let compiledExpression: jsonata.Expression;

  const PORTFOLIO_HEALTH_DATASOURCE_KEY =
    "innovation_innovation_overview_portfolio-health-phi";
  const PACK_PRICE_DATASOURCE_KEY = "strategic-innovation-pillars-pack-price";
  const RENOVATION_DATASOURCE_KEY = "strategic-innovation-pillars-renovation";
  const NEW_OPPORTUNITIES_DATASOURCE_KEY =
    "strategic-innovation-pillars-new-opportunities";
  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/innovation/home/big-numbers.jsonata",
  );

  // Helper function to create a portfolio health entry
  const createPortfolioHealthEntry = (
    overrides: Partial<PortfolioHealthEntry>,
  ): PortfolioHealthEntry => ({
    dt_ini: "2025-07-01T00:00:00.000Z",
    dt_end: "2025-12-01T00:00:00.000Z",
    country_iso_code_3: "ABI",
    abi_zone: "ABI",
    level_1: "innovation",
    unit_of_measure: "%",
    comp_unit_of_measure: "pp",
    ac: 85.4,
    ac_vs_ly: 2.5,
    comp_direction: "down",
    vs_ly_label_suffix: "YTD",
    variationDirectionVsLy: "up",
    refreshMonthLabel: "Dec'25",
    lyMonthLabel: "Dec'24",
    ...overrides,
  });

  // Helper function to create a pillar entry
  const createPillarEntry = (overrides: Partial<PillarEntry>): PillarEntry => ({
    dt_ini: "2025-01-01T00:00:00.000Z",
    dt_end: "2025-12-01T00:00:00.000Z",
    country_iso_code_3: "ABI",
    abi_zone: "ABI",
    kpi_name: "innovation_volume",
    level_1: "pack_price",
    unit_of_measure: "k hl",
    comp_unit_of_measure: "%",
    ac: 36930,
    ac_vs_ly: 18.1,
    average_line: 23.5,
    comp_direction: "down",
    vs_ly_label_suffix: "YTD",
    variationDirectionVsLy: "up",
    refreshMonthLabel: "Dec'25",
    lyMonthLabel: "Dec'24",
    country: "ABI",
    average_line_direction: "up",
    ...overrides,
  });

  // Helper function to create mock input
  const createMockInput = (
    portfolioHealthEntries: PortfolioHealthEntry[] = [],
    packPriceEntries: PillarEntry[] = [],
    renovationEntries: PillarEntry[] = [],
    newOpportunitiesEntries: PillarEntry[] = [],
  ) => ({
    datasources: {
      [PORTFOLIO_HEALTH_DATASOURCE_KEY]: portfolioHealthEntries,
      [PACK_PRICE_DATASOURCE_KEY]: packPriceEntries,
      [RENOVATION_DATASOURCE_KEY]: renovationEntries,
      [NEW_OPPORTUNITIES_DATASOURCE_KEY]: newOpportunitiesEntries,
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
    it("should return all four big number objects", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [createPillarEntry({ level_1: "pack_price" })],
        [
          createPillarEntry({
            level_1: "renovation",
            kpi_name: "innovation_superiority",
          }),
        ],
        [createPillarEntry({ level_1: "new_opportunities" })],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result).toHaveProperty("portfolioHealthBigNumber");
      expect(result).toHaveProperty("packPriceBigNumber");
      expect(result).toHaveProperty("brandRenovationBigNumber");
      expect(result).toHaveProperty("newInnovationsBigNumber");
    });

    it("should have correct titles for each big number", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [createPillarEntry({ level_1: "pack_price" })],
        [createPillarEntry({ level_1: "renovation" })],
        [createPillarEntry({ level_1: "new_opportunities" })],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.portfolioHealthBigNumber.title).toBe("PHI");
      expect(result.packPriceBigNumber.title).toBe(
        "Pack & Price Driven Volume",
      );
      expect(result.brandRenovationBigNumber.title).toBe("Superior Brands");
      expect(result.newInnovationsBigNumber.title).toBe(
        "New Innovations Driven Volume",
      );
    });
  });

  describe("Portfolio Health Big Number", () => {
    it("should filter by level_1 = innovation", async () => {
      const mockInput = createMockInput(
        [
          createPortfolioHealthEntry({ level_1: "other", ac_vs_ly: 99.9 }),
          createPortfolioHealthEntry({ level_1: "innovation", ac_vs_ly: 2.5 }),
        ],
        [],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.portfolioHealthBigNumber.bigNumberData[0].bigNumber.value,
      ).toBe("2.5");
    });

    it("should use correct period from refreshMonthLabel", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({ refreshMonthLabel: "Dec'25" })],
        [],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.portfolioHealthBigNumber.period).toBe("Dec'25");
    });

    it("should format bigNumber correctly when ac_vs_ly is valid", async () => {
      const mockInput = createMockInput(
        [
          createPortfolioHealthEntry({
            ac_vs_ly: 2.5,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          }),
        ],
        [],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const bigNumber =
        result.portfolioHealthBigNumber.bigNumberData[0].bigNumber;

      expect(bigNumber.value).toBe("2.5");
      expect(bigNumber.measure).toBe("");
      expect(bigNumber.trend).toBe("positive");
    });

    it("should format comparison correctly with hardcoded LY", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const comparison =
        result.portfolioHealthBigNumber.bigNumberData[0].comparison;

      expect(comparison.label).toBe("vs");
      expect(comparison.value).toBe("LY");
    });

    it("should format secondaryInfo correctly when ac_vs_ly is valid", async () => {
      const mockInput = createMockInput(
        [
          createPortfolioHealthEntry({
            unit_of_measure: "%",
            ac: 85.4,
            ac_vs_ly: 2.5,
          }),
        ],
        [],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const secondaryInfo =
        result.portfolioHealthBigNumber.bigNumberData[0].secondaryInfo;

      expect(secondaryInfo.label).toBe("");
      expect(secondaryInfo.value).toBe("85.4");
    });

    describe("PHI reversion logic when ac_vs_ly is null or empty", () => {
      it("should use ac value as bigNumber value when ac_vs_ly is null", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac: 85.4,
              ac_vs_ly: null,
              refreshMonthLabel: "Dec'25",
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const bigNumberData = result.portfolioHealthBigNumber.bigNumberData[0];

        expect(bigNumberData.bigNumber.value).toBe("85.4");
        expect(bigNumberData.bigNumber.measure).toBe("");
        expect(bigNumberData.bigNumber.trend).toBe("");
      });

      it("should have empty comparison when ac_vs_ly is null", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac: 85.4,
              ac_vs_ly: null,
              lyMonthLabel: "Dec'24",
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const comparison =
          result.portfolioHealthBigNumber.bigNumberData[0].comparison;

        expect(comparison.label).toBe("");
        expect(comparison.value).toBe("");
      });

      it("should have empty secondaryInfo when ac_vs_ly is null", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac: 85.4,
              ac_vs_ly: null,
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const secondaryInfo =
          result.portfolioHealthBigNumber.bigNumberData[0].secondaryInfo;

        expect(secondaryInfo.label).toBe("");
        expect(secondaryInfo.value).toBe("");
      });

      it("should show full data when ac_vs_ly has valid value", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac: 85.4,
              ac_vs_ly: 2.5,
              variationDirectionVsLy: "up",
              lyMonthLabel: "Dec'24",
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const bigNumberData = result.portfolioHealthBigNumber.bigNumberData[0];

        // bigNumber should use ac_vs_ly
        expect(bigNumberData.bigNumber.value).toBe("2.5");
        expect(bigNumberData.bigNumber.measure).toBe("");
        expect(bigNumberData.bigNumber.trend).toBe("positive");

        // comparison should be populated with hardcoded LY
        expect(bigNumberData.comparison.label).toBe("vs");
        expect(bigNumberData.comparison.value).toBe("LY");

        // secondaryInfo should show ac value
        expect(bigNumberData.secondaryInfo.label).toBe("");
        expect(bigNumberData.secondaryInfo.value).toBe("85.4");
      });

      it("should handle negative trend when ac_vs_ly is valid", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac_vs_ly: -1.5,
              variationDirectionVsLy: "down",
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const bigNumber =
          result.portfolioHealthBigNumber.bigNumberData[0].bigNumber;

        expect(bigNumber.value).toBe("-1.5");
        expect(bigNumber.trend).toBe("negative");
      });

      it("should format large ac values correctly when ac_vs_ly is null", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac: 1234.5,
              ac_vs_ly: null,
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const bigNumber =
          result.portfolioHealthBigNumber.bigNumberData[0].bigNumber;

        expect(bigNumber.value).toBe("1,234.5");
        expect(bigNumber.measure).toBe("");
      });
    });

    describe("variationDirectionVsLy trend mapping", () => {
      it("should return 'positive' when variationDirectionVsLy is 'up'", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac_vs_ly: 2.5,
              variationDirectionVsLy: "up",
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const bigNumber =
          result.portfolioHealthBigNumber.bigNumberData[0].bigNumber;

        expect(bigNumber.trend).toBe("positive");
      });

      it("should return 'negative' when variationDirectionVsLy is 'down'", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac_vs_ly: -1.5,
              variationDirectionVsLy: "down",
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const bigNumber =
          result.portfolioHealthBigNumber.bigNumberData[0].bigNumber;

        expect(bigNumber.trend).toBe("negative");
      });

      it("should return empty string when variationDirectionVsLy is empty", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac_vs_ly: 2.5,
              variationDirectionVsLy: "",
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const bigNumber =
          result.portfolioHealthBigNumber.bigNumberData[0].bigNumber;

        expect(bigNumber.trend).toBe("");
      });

      it("should return empty string when ac_vs_ly is null (regardless of variationDirectionVsLy)", async () => {
        const mockInput = createMockInput(
          [
            createPortfolioHealthEntry({
              ac: 85.4,
              ac_vs_ly: null,
              variationDirectionVsLy: "up",
            }),
          ],
          [],
          [],
          [],
        );

        const result: any = await evaluateExpression(mockInput);
        const bigNumber =
          result.portfolioHealthBigNumber.bigNumberData[0].bigNumber;

        expect(bigNumber.trend).toBe("");
      });
    });
  });

  describe("Data selection", () => {
    it("should use the first (most recent) item from each pillar datasource", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [
          createPillarEntry({
            level_1: "pack_price",
            dt_end: "2025-12-01T00:00:00.000Z",
            ac_vs_ly: 18.1,
          }),
          createPillarEntry({
            level_1: "pack_price",
            dt_end: "2025-06-01T00:00:00.000Z",
            ac_vs_ly: 10.0,
          }),
        ],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      // Should use the first item (index 0) regardless of PHI's dt_end
      expect(result.packPriceBigNumber.bigNumberData[0].bigNumber.value).toBe(
        "18.1",
      );
    });

    it("should show data from different periods for each big number independently", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({ refreshMonthLabel: "Dec'25" })],
        [
          createPillarEntry({
            level_1: "pack_price",
            refreshMonthLabel: "Dec'25",
            ac_vs_ly: 18.1,
          }),
        ],
        [
          createPillarEntry({
            level_1: "renovation",
            refreshMonthLabel: "Dec'24",
            ac_vs_ly: 12.5,
          }),
        ],
        [
          createPillarEntry({
            level_1: "new_opportunities",
            refreshMonthLabel: "Dec'25",
            ac_vs_ly: 25.3,
          }),
        ],
      );

      const result: any = await evaluateExpression(mockInput);

      // Each big number shows its own period
      expect(result.portfolioHealthBigNumber.period).toBe("Dec'25");
      expect(result.packPriceBigNumber.period).toBe("Dec'25");
      expect(result.brandRenovationBigNumber.period).toBe("Dec'24");
      expect(result.newInnovationsBigNumber.period).toBe("Dec'25");

      // All should have data
      expect(result.brandRenovationBigNumber.bigNumberData).toHaveLength(1);
      expect(
        result.brandRenovationBigNumber.bigNumberData[0].bigNumber.value,
      ).toBe("12.5");
    });
  });

  describe("Value formatting", () => {
    it("should format numbers with thousands separator", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [createPillarEntry({ level_1: "pack_price", ac: 36930 })],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.packPriceBigNumber.bigNumberData[0].secondaryInfo.value,
      ).toBe("36,930.0");
    });

    it("should return '-' for null ac_vs_ly values (non-PHI big numbers)", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [createPillarEntry({ level_1: "pack_price", ac_vs_ly: null })],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.packPriceBigNumber.bigNumberData[0].bigNumber.value).toBe(
        "-",
      );
    });

    it("should return '-' for null ac values (non-PHI big numbers)", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [createPillarEntry({ level_1: "pack_price", ac: null })],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.packPriceBigNumber.bigNumberData[0].secondaryInfo.value,
      ).toBe("-");
    });

    it("should handle negative values correctly", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [createPillarEntry({ level_1: "pack_price", ac_vs_ly: -5.3 })],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.packPriceBigNumber.bigNumberData[0].bigNumber.value).toBe(
        "-5.3",
      );
    });

    it("should format large numbers correctly", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [createPillarEntry({ level_1: "pack_price", ac: 1234567.89 })],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(
        result.packPriceBigNumber.bigNumberData[0].secondaryInfo.value,
      ).toBe("1,234,567.9");
    });
  });

  describe("Empty datasources", () => {
    it("should handle all empty datasources", async () => {
      const mockInput = createMockInput([], [], [], []);

      const result: any = await evaluateExpression(mockInput);

      expect(result.portfolioHealthBigNumber.bigNumberData).toEqual([]);
      expect(result.packPriceBigNumber.bigNumberData).toEqual([]);
      expect(result.brandRenovationBigNumber.bigNumberData).toEqual([]);
      expect(result.newInnovationsBigNumber.bigNumberData).toEqual([]);
    });

    it("should handle empty portfolioHealth datasource", async () => {
      const mockInput = createMockInput(
        [],
        [createPillarEntry({ level_1: "pack_price" })],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.portfolioHealthBigNumber.bigNumberData).toEqual([]);
    });

    it("should handle partial empty datasources", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [createPillarEntry({ level_1: "pack_price" })],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);

      expect(result.portfolioHealthBigNumber.bigNumberData).toHaveLength(1);
      expect(result.packPriceBigNumber.bigNumberData).toHaveLength(1);
      expect(result.brandRenovationBigNumber.bigNumberData).toEqual([]);
      expect(result.newInnovationsBigNumber.bigNumberData).toEqual([]);
    });
  });

  describe("Pack Price Big Number", () => {
    it("should format packPrice bigNumber correctly", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [
          createPillarEntry({
            level_1: "pack_price",
            ac_vs_ly: 18.1,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "up",
          }),
        ],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const bigNumber = result.packPriceBigNumber.bigNumberData[0].bigNumber;

      expect(bigNumber.value).toBe("18.1");
      expect(bigNumber.measure).toBe("%");
      expect(bigNumber.trend).toBe("positive");
    });

    it("should format packPrice secondaryInfo with unit_of_measure", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [
          createPillarEntry({
            level_1: "pack_price",
            unit_of_measure: "k hl",
            ac: 36930,
          }),
        ],
        [],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const secondaryInfo =
        result.packPriceBigNumber.bigNumberData[0].secondaryInfo;

      expect(secondaryInfo.label).toBe("[ k hl ]");
      expect(secondaryInfo.value).toBe("36,930.0");
    });
  });

  describe("Brand Renovation Big Number", () => {
    it("should format brandRenovation bigNumber correctly", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [],
        [
          createPillarEntry({
            level_1: "renovation",
            ac_vs_ly: 12.5,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "down",
          }),
        ],
        [],
      );

      const result: any = await evaluateExpression(mockInput);
      const bigNumber =
        result.brandRenovationBigNumber.bigNumberData[0].bigNumber;

      expect(bigNumber.value).toBe("12.5");
      expect(bigNumber.measure).toBe("%");
      expect(bigNumber.trend).toBe("negative");
    });
  });

  describe("New Innovations Big Number", () => {
    it("should format newInnovations bigNumber correctly", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [],
        [],
        [
          createPillarEntry({
            level_1: "new_opportunities",
            ac_vs_ly: 25.3,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "up",
          }),
        ],
      );

      const result: any = await evaluateExpression(mockInput);
      const bigNumber =
        result.newInnovationsBigNumber.bigNumberData[0].bigNumber;

      expect(bigNumber.value).toBe("25.3");
      expect(bigNumber.measure).toBe("%");
      expect(bigNumber.trend).toBe("positive");
    });

    it("should handle negative trend correctly", async () => {
      const mockInput = createMockInput(
        [createPortfolioHealthEntry({})],
        [],
        [],
        [
          createPillarEntry({
            level_1: "new_opportunities",
            variationDirectionVsLy: "down",
          }),
        ],
      );

      const result: any = await evaluateExpression(mockInput);
      const bigNumber =
        result.newInnovationsBigNumber.bigNumberData[0].bigNumber;

      expect(bigNumber.trend).toBe("negative");
    });
  });
});
