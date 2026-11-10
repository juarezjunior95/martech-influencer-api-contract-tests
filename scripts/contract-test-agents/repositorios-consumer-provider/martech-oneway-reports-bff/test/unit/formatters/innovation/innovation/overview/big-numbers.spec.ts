import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import {
  innovationBigNumbersSchema,
  innovationBigNumbersArraySchema,
  innovationBigNumberCardSchema,
  innovationBigNumberDataItemSchema,
} from "../../../../../../src/infrastructure/schema/components/big-number";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("innovation big-numbers formatter", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/innovation/innovation/overview/big-numbers.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);

    registerHelpers(compiledExpression);
  });

  it("should return array of cards when all datasources have data", async () => {
    const mockInput = {
      datasources: {
        "innovation_innovation_overview_big-numbers": [
          {
            kpi_name: "innovation_volume",
            ac_vs_ly: 5.2,
            le_vs_ly: 3.1,
            comp_ac_vs_ly_direction: "up",
            comp_le_vs_ly_direction: "down",
            ac: 12345.6,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            secondary_measure: null,
            refreshMonthLabel: "Oct'25",
          },
          {
            kpi_name: "innovation_volume_mix",
            ac_vs_ly: 2.5,
            comp_ac_vs_ly_direction: "up",
            ac: 9876.5,
            dt_end: "2025-10-01",
            dt_ini: "2025-10-01",
            measure: "pp",
            secondary_measure: "%",
            refreshMonthLabel: "Oct'25",
          },
          {
            kpi_name: "innovation_nr",
            ac_vs_ly: 8.5,
            le_vs_ly: 4.2,
            comp_ac_vs_ly_direction: "up",
            comp_le_vs_ly_direction: "up",
            ac: 8765.4,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            secondary_measure: null,
            refreshMonthLabel: "Oct'25",
          },
          {
            kpi_name: "innovation_maco",
            ac_vs_ly: 7.3,
            le_vs_ly: 2.8,
            comp_ac_vs_ly_direction: "down",
            comp_le_vs_ly_direction: "up",
            ac: 6543.2,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            secondary_measure: null,
            refreshMonthLabel: "Oct'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(4);

    // Validate schema
    const validate = ajv.compile(innovationBigNumbersArraySchema);
    expect(validate(result)).toBe(true);

    // Validate volume card
    const volumeCard = result.find((card) => card.id === "volume");
    expect(volumeCard).toBeDefined();
    expect(volumeCard.period).toBeDefined();
    expect(Array.isArray(volumeCard.data)).toBe(true);
    expect(volumeCard.data.length).toBe(2);

    // Validate first data item (ac_vs_ly)
    const volumeData1 = volumeCard.data[0];
    expect(volumeData1.bigNumber).toBeDefined();
    expect(volumeData1.bigNumber.value).toBe("5.2");
    expect(volumeData1.bigNumber.measure).toBe("%");
    expect(volumeData1.bigNumber.color).toBe("#007800"); // up direction
    expect(volumeData1.secondaryInfo).toBeDefined();
    expect(volumeData1.secondaryInfo.value).toContain("#: ");
    expect(volumeData1.secondaryInfo.value).toContain("12,345.6");
    expect(volumeData1.comparison).toBeDefined();
    expect(volumeData1.comparison.value).toBe("YTD VS LY");

    // Validate second data item (le_vs_ly)
    const volumeData2 = volumeCard.data[1];
    expect(volumeData2.bigNumber.value).toBe("3.1");
    expect(volumeData2.bigNumber.color).toBe("#B91C1C"); // down direction
    expect(volumeData2.comparison.value).toBe("LE VS LY");

    // Validate volumeMix card
    const volumeMixCard = result.find((card) => card.id === "volumeMix");
    expect(volumeMixCard).toBeDefined();
    expect(volumeMixCard.data).toBeDefined();
    // Handle both array and single object cases
    const volumeMixData = volumeMixCard.data[0];
    expect(volumeMixData.bigNumber.measure).toBe("pp");
    expect(volumeMixData.secondaryInfo.measure).toBe(" [ % ]");

    // Validate nr card
    const nrCard = result.find((card) => card.id === "nr");
    expect(nrCard).toBeDefined();
    expect(nrCard.data.length).toBe(2);

    // Validate maco card
    const macoCard = result.find((card) => card.id === "maco");
    expect(macoCard).toBeDefined();
    expect(macoCard.data.length).toBe(2);
    expect(macoCard.data[0].bigNumber.color).toBe("#B91C1C"); // down direction
  });

  it("should handle empty datasources", async () => {
    const mockInput = {
      datasources: {
        "innovation_innovation_overview_big-numbers": [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(4);

    // Validate schema
    const validate = ajv.compile(innovationBigNumbersArraySchema);
    expect(validate(result)).toBe(true);
  });

  it("should handle missing data for some cards", async () => {
    const mockInput = {
      datasources: {
        "innovation_innovation_overview_big-numbers": [
          {
            kpi_name: "innovation_volume",
            ac_vs_ly: 5.2,
            le_vs_ly: 3.1,
            comp_ac_vs_ly_direction: "up",
            comp_le_vs_ly_direction: "down",
            ac: 12345.6,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            refreshMonthLabel: "Oct'25",
          },
          {
            kpi_name: "innovation_nr",
            ac_vs_ly: 8.5,
            le_vs_ly: 4.2,
            comp_ac_vs_ly_direction: "up",
            comp_le_vs_ly_direction: "up",
            ac: 8765.4,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            refreshMonthLabel: "Oct'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(4);

    // Cards with data should have data arrays
    const volumeCard = result.find((card) => card.id === "volume");
    expect(volumeCard.data.length).toBe(2);

    const nrCard = result.find((card) => card.id === "nr");
    expect(nrCard.data.length).toBe(2);

    // Cards without data should have empty data arrays
    const volumeMixCard = result.find((card) => card.id === "volumeMix");
    expect(volumeMixCard).toBeDefined();
    if (volumeMixCard && volumeMixCard.data) {
      const dataItems = volumeMixCard.data;
      expect(dataItems.length).toBe(0);
    }

    const macoCard = result.find((card) => card.id === "maco");
    expect(macoCard).toBeDefined();
    if (macoCard && macoCard.data) {
      const dataItems = macoCard.data;
      expect(dataItems.length).toBe(0);
    }
  });

  it("should handle negative values correctly", async () => {
    const mockInput = {
      datasources: {
        "innovation_innovation_overview_big-numbers": [
          {
            kpi_name: "innovation_volume",
            ac_vs_ly: -3.5,
            le_vs_ly: -2.1,
            comp_ac_vs_ly_direction: "down",
            comp_le_vs_ly_direction: "down",
            ac: 10000,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            refreshMonthLabel: "Oct'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const volumeCard = result.find((card) => card.id === "volume");
    expect(volumeCard.data[0].bigNumber.value).toBe("-3.5");
    expect(volumeCard.data[0].bigNumber.color).toBe("#B91C1C"); // down direction
    expect(volumeCard.data[1].bigNumber.value).toBe("-2.1");
    expect(volumeCard.data[1].bigNumber.color).toBe("#B91C1C"); // down direction
  });

  it("should format numbers with thousands separator", async () => {
    const mockInput = {
      datasources: {
        "innovation_innovation_overview_big-numbers": [
          {
            kpi_name: "innovation_volume",
            ac_vs_ly: 5.2,
            comp_ac_vs_ly_direction: "up",
            ac: 1234567.89,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            refreshMonthLabel: "Oct'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const volumeCard = result.find((card) => card.id === "volume");
    expect(volumeCard.data[0].secondaryInfo.value).toContain("1,234,567.9");
  });

  it("should format period correctly", async () => {
    const mockInput = {
      datasources: {
        "innovation_innovation_overview_big-numbers": [
          {
            kpi_name: "innovation_volume",
            ac_vs_ly: 5.2,
            comp_ac_vs_ly_direction: "up",
            ac: 12345.6,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            refreshMonthLabel: "Oct'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const volumeCard = result.find((card) => card.id === "volume");
    expect(volumeCard.period).toBeDefined();
    expect(typeof volumeCard.period).toBe("string");
    // Period should be formatted as "Oct'25 YTD" or "Oct'25 MTD" based on refreshMonthLabel
    expect(volumeCard.period).toMatch(/^Oct'25 (YTD|MTD)$/);
  });

  it("should handle missing or null values gracefully", async () => {
    const mockInput = {
      datasources: {
        "innovation_innovation_overview_big-numbers": [
          {
            kpi_name: "innovation_volume",
            ac_vs_ly: null,
            le_vs_ly: undefined,
            comp_ac_vs_ly_direction: "up",
            comp_le_vs_ly_direction: "down",
            ac: null,
            dt_end: "2025-10-01",
            dt_ini: "2025-01-01",
            measure: "%",
            refreshMonthLabel: "Oct'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const volumeCard = result.find((card) => card.id === "volume");
    expect(volumeCard.data[0].bigNumber.value).toBe("-"); // null value should format to "-"
    expect(volumeCard.data[0].secondaryInfo.value).toContain("-");
  });

  describe("Schema validation", () => {
    it("should validate complete result array against innovationBigNumbersArraySchema", async () => {
      const mockInput = {
        datasources: {
          "innovation_innovation_overview_big-numbers": [
            {
              kpi_name: "innovation_volume",
              ac_vs_ly: -22.1,
              le_vs_ly: -23.4,
              comp_ac_vs_ly_direction: "down",
              comp_le_vs_ly_direction: "down",
              ac: 5573.4,
              dt_end: "2025-09-01",
              dt_ini: "2025-01-01",
              measure: "%",
              refreshMonthLabel: "Sep'25",
            },
            {
              kpi_name: "innovation_nr",
              ac_vs_ly: -22.1,
              le_vs_ly: -23.4,
              comp_ac_vs_ly_direction: "down",
              comp_le_vs_ly_direction: "down",
              ac: 5573.4,
              dt_end: "2025-09-01",
              dt_ini: "2025-01-01",
              measure: "%",
              refreshMonthLabel: "Sep'25",
            },
            {
              kpi_name: "innovation_maco",
              ac_vs_ly: -22.1,
              le_vs_ly: -23.4,
              comp_ac_vs_ly_direction: "down",
              comp_le_vs_ly_direction: "down",
              ac: 5573.4,
              dt_end: "2025-09-01",
              dt_ini: "2025-01-01",
              measure: "%",
              refreshMonthLabel: "Sep'25",
            },
          ],
        },
      };

      const result = await compiledExpression.evaluate(mockInput);

      const validate = ajv.compile(innovationBigNumbersArraySchema);
      const isValid = validate(result);

      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }

      expect(isValid).toBe(true);
    });

    it("should validate result against main innovationBigNumbersSchema", async () => {
      const mockInput = {
        datasources: {
          "innovation_innovation_overview_big-numbers": [
            {
              kpi_name: "innovation_volume",
              ac_vs_ly: 5.2,
              le_vs_ly: 3.1,
              comp_ac_vs_ly_direction: "up",
              comp_le_vs_ly_direction: "down",
              ac: 12345.6,
              dt_end: "2025-10-01",
              dt_ini: "2025-01-01",
              measure: "%",
              refreshMonthLabel: "Oct'25",
            },
          ],
        },
      };

      const result = await compiledExpression.evaluate(mockInput);

      const validate = ajv.compile(innovationBigNumbersSchema);
      const isValid = validate(result);

      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }

      expect(isValid).toBe(true);
    });

    it("should validate each card against innovationBigNumberCardSchema", async () => {
      const mockInput = {
        datasources: {
          "innovation_innovation_overview_big-numbers": [
            {
              kpi_name: "innovation_volume",
              ac_vs_ly: -22.1,
              le_vs_ly: -23.4,
              comp_ac_vs_ly_direction: "down",
              comp_le_vs_ly_direction: "down",
              ac: 5573.4,
              dt_end: "2025-09-01",
              measure: "%",
            },
            {
              kpi_name: "innovation_volume_mix",
              ac_vs_ly: 2.5,
              comp_ac_vs_ly_direction: "up",
              ac: 9876.5,
              dt_end: "2025-09-01",
              dt_ini: "2025-09-01",
              measure: "pp",
              refreshMonthLabel: "Sep'25",
            },
          ],
        },
      };

      const result = await compiledExpression.evaluate(mockInput);

      const validate = ajv.compile(innovationBigNumberCardSchema);

      result.forEach((card) => {
        const isValid = validate(card);
        if (!isValid) {
          console.log(`Card ${card.id} validation errors:`, validate.errors);
        }
        expect(isValid).toBe(true);
      });
    });

    it("should validate data items against innovationBigNumberDataItemSchema", async () => {
      const mockInput = {
        datasources: {
          "innovation_innovation_overview_big-numbers": [
            {
              kpi_name: "innovation_volume",
              ac_vs_ly: -22.1,
              le_vs_ly: -23.4,
              comp_ac_vs_ly_direction: "down",
              comp_le_vs_ly_direction: "down",
              ac: 5573.4,
              dt_end: "2025-09-01",
              dt_ini: "2025-01-01",
              measure: "%",
              refreshMonthLabel: "Sep'25",
            },
          ],
        },
      };

      const result = await compiledExpression.evaluate(mockInput);

      const validate = ajv.compile(innovationBigNumberDataItemSchema);

      const volumeCard = result.find((card) => card.id === "volume");
      expect(volumeCard).toBeDefined();

      const dataItems = volumeCard.data;

      dataItems.forEach((dataItem, index) => {
        const isValid = validate(dataItem);
        if (!isValid) {
          console.log(`Data item ${index} validation errors:`, validate.errors);
        }
        expect(isValid).toBe(true);
      });
    });
  });
});
