import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("strategy-drivers/growth-levers formatter (value-creation home)", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/home/strategy-drivers/growth-levers.jsonata",
  );

  type GrowthLeverRow = {
    growth_lever: string;
    volume_weight: number;
    unit_of_measure: string;
    ac_vs_ly: number;
    comp_unit_of_measure?: string;
    variationDirectionVsLy: string;
  };

  const createMockInput = (opts: { growth_levers?: GrowthLeverRow[] }) => ({
    datasources: {
      growth_levers: opts.growth_levers ?? [],
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  describe("when growth_levers datasource is received with data for all 4 cards", () => {
    it("should return an object with 4 cards (superiorCore, leadPremium, balancedChoices, beyondBeer) with titles and rows", async () => {
      const oneRow: Omit<GrowthLeverRow, "growth_lever"> = {
        volume_weight: 42.5,
        unit_of_measure: "hl",
        ac_vs_ly: 3.2,
        comp_unit_of_measure: "%",
        variationDirectionVsLy: "up",
      };

      const mockInput = createMockInput({
        growth_levers: [
          {
            ...oneRow,
            growth_lever: "Superior Core",
            volume_weight: 10,
            ac_vs_ly: 1.1,
          },
          {
            ...oneRow,
            growth_lever: "Lead Premium",
            volume_weight: 20,
            ac_vs_ly: 2.2,
            variationDirectionVsLy: "down",
          },
          {
            ...oneRow,
            growth_lever: "Balanced Choices",
            volume_weight: 30,
            ac_vs_ly: 3.3,
          },
          {
            ...oneRow,
            growth_lever: "Beyond Beer",
            volume_weight: 40,
            ac_vs_ly: 4.4,
          },
        ],
      });

      const result = await evaluateExpression(mockInput);

      expect(result).not.toBeNull();
      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("superiorCore");
      expect(result).toHaveProperty("leadPremium");
      expect(result).toHaveProperty("balancedChoices");
      expect(result).toHaveProperty("beyondBeer");
      expect(Object.keys(result)).toHaveLength(4);

      // Superior Core
      expect(result.superiorCore.title).toBe("Superior Core");
      expect(result.superiorCore.rows).toHaveLength(2);
      expect(result.superiorCore.rows[0].label).toBe("Vol. Weight");
      expect(result.superiorCore.rows[0].bigNumberData[0].bigNumber).toEqual({
        value: "10.0",
        measure: "hl",
      });
      expect(result.superiorCore.rows[1].label).toBe("Vol. vs LY");
      expect(result.superiorCore.rows[1].bigNumberData[0].bigNumber).toEqual({
        value: "1.1",
        measure: "%",
        trend: "positive",
      });
      expect(result.superiorCore.noticeMessage).toBeUndefined();

      // Lead Premium (down = negative trend)
      expect(result.leadPremium.title).toBe("Lead Premium");
      expect(result.leadPremium.rows[1].bigNumberData[0].bigNumber.trend).toBe(
        "negative",
      );
      expect(result.leadPremium.noticeMessage).toBeUndefined();

      // Balanced Choices
      expect(result.balancedChoices.title).toBe("Balanced Choices");
      expect(
        result.balancedChoices.rows[0].bigNumberData[0].bigNumber.value,
      ).toBe("30.0");
      expect(result.balancedChoices.noticeMessage).toBeUndefined();

      // Beyond Beer
      expect(result.beyondBeer.title).toBe("Beyond Beer");
      expect(result.beyondBeer.rows[0].bigNumberData[0].bigNumber.value).toBe(
        "40.0",
      );
      expect(result.beyondBeer.noticeMessage).toBeUndefined();
    });
  });

  describe("when data is not complete", () => {
    it("should return 4 cards with noticeMessage and empty rows when growth_levers is empty", async () => {
      const mockInput = createMockInput({ growth_levers: [] });

      const result = await evaluateExpression(mockInput);

      expect(result).not.toBeNull();
      expect(Object.keys(result)).toHaveLength(4);

      const errorMessage = "Data not available.";
      const cardKeys = [
        "superiorCore",
        "leadPremium",
        "balancedChoices",
        "beyondBeer",
      ] as const;
      const expectedTitles = [
        "Superior Core",
        "Lead Premium",
        "Balanced Choices",
        "Beyond Beer",
      ];

      cardKeys.forEach((key, index) => {
        expect(result[key]).toHaveProperty("title", expectedTitles[index]);
        expect(result[key]).toHaveProperty("rows");
        expect(result[key].rows).toEqual([]);
        expect(result[key]).toHaveProperty("noticeMessage", errorMessage);
      });
    });

    it("should return 4 cards with mix of data and error: some with rows, some with noticeMessage", async () => {
      const mockInput = createMockInput({
        growth_levers: [
          {
            growth_lever: "Superior Core",
            volume_weight: 15,
            unit_of_measure: "hl",
            ac_vs_ly: 2,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "up",
          },
          {
            growth_lever: "Balanced Choices",
            volume_weight: 25,
            unit_of_measure: "hl",
            ac_vs_ly: -1,
            variationDirectionVsLy: "down",
          },
        ],
      });

      const result = await evaluateExpression(mockInput);

      expect(Object.keys(result)).toHaveLength(4);

      expect(result.superiorCore.title).toBe("Superior Core");
      expect(result.superiorCore.rows).toHaveLength(2);
      expect(result.superiorCore.noticeMessage).toBeUndefined();

      expect(result.leadPremium.title).toBe("Lead Premium");
      expect(result.leadPremium.rows).toEqual([]);
      expect(result.leadPremium.noticeMessage).toBe("Data not available.");

      expect(result.balancedChoices.title).toBe("Balanced Choices");
      expect(result.balancedChoices.rows).toHaveLength(2);
      expect(result.balancedChoices.noticeMessage).toBeUndefined();

      expect(result.beyondBeer.title).toBe("Beyond Beer");
      expect(result.beyondBeer.rows).toEqual([]);
      expect(result.beyondBeer.noticeMessage).toBe("Data not available.");
    });
  });
});
