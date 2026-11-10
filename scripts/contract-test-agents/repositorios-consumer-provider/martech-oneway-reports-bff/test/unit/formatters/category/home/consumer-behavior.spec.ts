import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import {
  consumerBehaviorBigNumbersSchema,
  consumerBehaviorBigNumbersArraySchema,
  consumerBehaviorCardSchema,
  consumerBehaviorBigNumberDataItemSchema,
} from "../../../../../src/infrastructure/schema/components/big-number";

describe("consumer-behavior formatter", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/category/home/consumer-behavior.jsonata",
    );

    const expression = fs.readFileSync(jsonataPath, "utf8");

    return jsonata(expression);
  };

  it("should return array with two cards when datasource has complete data", async () => {
    const mockInput = {
      datasources: {
        "category-home_consumer-behavior": [
          {
            dt_ini: "2024-01-01",
            dt_end: "2024-12-31",
            ac: 56.8,
            ac_vs_ly: -0.7,
            unit_of_measure: "%",
            card_view: "BEER_PARTICIPATION",
            kpi_name: "Beer Participation",
            measure: "pp",
            variationDirectionVsLy: "down",
            period: "R12M",
          },
          {
            dt_ini: "2024-01-01",
            dt_end: "2024-12-31",
            ac: 43.8,
            ac_vs_ly: -0.6,
            unit_of_measure: "%",
            card_view: "ABI_PARTICIPATION",
            kpi_name: "ABI Participation",
            measure: "pp",
            variationDirectionVsLy: "down",
            period: "R12M",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    const validate = ajv.compile(consumerBehaviorBigNumbersArraySchema);
    expect(validate(result)).toBe(true);

    const beerCard = result[0];
    expect(beerCard.title).toBe("Beer Participation");
    expect(beerCard.period).toBe("Q4'24 - R12M");
    expect(beerCard.bigNumberData).toHaveLength(1);
    expect(beerCard.bigNumberData[0].bigNumber.value).toBe("-0.7");
    expect(beerCard.bigNumberData[0].bigNumber.measure).toBe("pp");
    expect(beerCard.bigNumberData[0].bigNumber.trend).toBe("negative");
    expect(beerCard.bigNumberData[0].comparison.label).toBe("vs");
    expect(beerCard.bigNumberData[0].comparison.value).toBe("LY");
    expect(beerCard.bigNumberData[0].secondaryInfo.label).toBe("[ % ]");
    expect(beerCard.bigNumberData[0].secondaryInfo.value).toBe("56.8");

    const abiCard = result[1];
    expect(abiCard.title).toBe("ABI Participation");
    expect(abiCard.period).toBe("Q4'24 - R12M");
    expect(abiCard.bigNumberData[0].bigNumber.value).toBe("-0.6");
    expect(abiCard.bigNumberData[0].comparison.value).toBe("Q4'23");
    expect(abiCard.bigNumberData[0].secondaryInfo.value).toBe("43.8");
  });

  it("should return empty array when datasource is empty", async () => {
    const mockInput = {
      datasources: {
        "category-home_consumer-behavior": [],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("should handle negative values correctly", async () => {
    const mockInput = {
      datasources: {
        "category-home_consumer-behavior": [
          {
            dt_ini: "2025-01-01",
            dt_end: "2025-09-30",
            ac: 56.8,
            ac_vs_ly: -0.7,
            card_view: "BEER_PARTICIPATION",
            kpi_name: "Beer Participation",
            measure: "pp",
            unit_of_measure: "%",
            variationDirectionVsLy: "down",
            period: "R12M",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-0.7");
    expect(result[0].bigNumberData[0].bigNumber.trend).toBe("negative");
  });

  it("should handle positive values correctly", async () => {
    const mockInput = {
      datasources: {
        "category-home_consumer-behavior": [
          {
            dt_ini: "2025-01-01",
            dt_end: "2025-09-30",
            ac: 58.5,
            ac_vs_ly: 1.2,
            card_view: "BEER_PARTICIPATION",
            kpi_name: "Beer Participation",
            measure: "pp",
            unit_of_measure: "%",
            variationDirectionVsLy: "up",
            period: "YTD",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("1.2");
    expect(result[0].bigNumberData[0].bigNumber.trend).toBe("positive");
  });

  it("should format period correctly for different quarters", async () => {
    const testCases = [
      { dt_end: "2025-03-31", expected: "Q1'25" },
      { dt_end: "2025-06-30", expected: "Q2'25" },
      { dt_end: "2025-09-30", expected: "Q3'25" },
      { dt_end: "2025-12-31", expected: "Q4'25" },
    ];

    for (const testCase of testCases) {
      const mockInput = {
        datasources: {
          "category-home_consumer-behavior": [
            {
              dt_ini: "2025-01-01",
              dt_end: testCase.dt_end,
              ac: 56.8,
              ac_vs_ly: -0.7,
              card_view: "BEER_PARTICIPATION",
              kpi_name: "Beer Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "R12M",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result[0].period).toBe(`${testCase.expected} - R12M`);
    }
  });

  it("should use LY for Beer Participation comparison", async () => {
    const mockInput = {
      datasources: {
        "category-home_consumer-behavior": [
          {
            dt_ini: "2025-01-01",
            dt_end: "2025-09-30",
            ac: 56.8,
            ac_vs_ly: -0.7,
            card_view: "BEER_PARTICIPATION",
            kpi_name: "Beer Participation",
            measure: "pp",
            unit_of_measure: "%",
            variationDirectionVsLy: "down",
            period: "R12M",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].bigNumberData[0].comparison.value).toBe("LY");
  });

  it("should use previous year quarter for ABI Participation comparison", async () => {
    const mockInput = {
      datasources: {
        "category-home_consumer-behavior": [
          {
            dt_ini: "2025-01-01",
            dt_end: "2025-09-30",
            ac: 43.8,
            ac_vs_ly: -0.6,
            card_view: "ABI_PARTICIPATION",
            kpi_name: "ABI Participation",
            measure: "pp",
            unit_of_measure: "%",
            variationDirectionVsLy: "down",
            period: "R12M",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].bigNumberData[0].comparison.value).toBe("Q3'24");
  });

  it("should handle missing or null values gracefully", async () => {
    const mockInput = {
      datasources: {
        "category-home_consumer-behavior": [
          {
            dt_ini: "2025-01-01",
            dt_end: "2025-09-30",
            ac: null,
            ac_vs_ly: null,
            card_view: "BEER_PARTICIPATION",
            kpi_name: "Beer Participation",
            measure: "pp",
            unit_of_measure: "%",
            variationDirectionVsLy: "down",
            period: "R12M",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-");
    expect(result[0].bigNumberData[0].secondaryInfo.value).toBe("-");
  });

  it("should order cards with Beer Participation first", async () => {
    const mockInput = {
      datasources: {
        "category-home_consumer-behavior": [
          {
            dt_ini: "2025-01-01",
            dt_end: "2025-09-30",
            ac: 43.8,
            ac_vs_ly: -0.6,
            card_view: "ABI_PARTICIPATION",
            kpi_name: "ABI Participation",
            measure: "pp",
            unit_of_measure: "%",
            variationDirectionVsLy: "down",
            period: "R12M",
          },
          {
            dt_ini: "2025-01-01",
            dt_end: "2025-09-30",
            ac: 56.8,
            ac_vs_ly: -0.7,
            card_view: "BEER_PARTICIPATION",
            kpi_name: "Beer Participation",
            measure: "pp",
            unit_of_measure: "%",
            variationDirectionVsLy: "down",
            period: "R12M",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].title).toBe("Beer Participation");
    expect(result[1].title).toBe("ABI Participation");
  });

  describe("Schema validation", () => {
    it("should validate complete result against consumerBehaviorBigNumbersArraySchema", async () => {
      const mockInput = {
        datasources: {
          "category-home_consumer-behavior": [
            {
              dt_ini: "2025-01-01",
              dt_end: "2025-09-30",
              ac: 56.8,
              ac_vs_ly: -0.7,
              card_view: "BEER_PARTICIPATION",
              kpi_name: "Beer Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "R12M",
            },
            {
              dt_ini: "2025-01-01",
              dt_end: "2025-09-30",
              ac: 43.8,
              ac_vs_ly: -0.6,
              card_view: "ABI_PARTICIPATION",
              kpi_name: "ABI Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "R12M",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      const validate = ajv.compile(consumerBehaviorBigNumbersArraySchema);
      const isValid = validate(result);

      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }

      expect(isValid).toBe(true);
    });

    it("should validate result against main consumerBehaviorBigNumbersSchema", async () => {
      const mockInput = {
        datasources: {
          "category-home_consumer-behavior": [
            {
              dt_ini: "2025-01-01",
              dt_end: "2025-09-30",
              ac: 56.8,
              ac_vs_ly: -0.7,
              card_view: "BEER_PARTICIPATION",
              kpi_name: "Beer Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "R12M",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      const validate = ajv.compile(consumerBehaviorBigNumbersSchema);
      const isValid = validate(result);

      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }

      expect(isValid).toBe(true);
    });

    it("should validate each card against consumerBehaviorCardSchema", async () => {
      const mockInput = {
        datasources: {
          "category-home_consumer-behavior": [
            {
              dt_ini: "2025-01-01",
              dt_end: "2025-09-30",
              ac: 56.8,
              ac_vs_ly: -0.7,
              card_view: "BEER_PARTICIPATION",
              kpi_name: "Beer Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "R12M",
            },
            {
              dt_ini: "2025-01-01",
              dt_end: "2025-09-30",
              ac: 43.8,
              ac_vs_ly: -0.6,
              card_view: "ABI_PARTICIPATION",
              kpi_name: "ABI Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "R12M",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      const validate = ajv.compile(consumerBehaviorCardSchema);

      result.forEach((card) => {
        const isValid = validate(card);
        if (!isValid) {
          console.log(`Card ${card.title} validation errors:`, validate.errors);
        }
        expect(isValid).toBe(true);
      });
    });

    it("should validate data items against consumerBehaviorBigNumberDataItemSchema", async () => {
      const mockInput = {
        datasources: {
          "category-home_consumer-behavior": [
            {
              dt_ini: "2025-01-01",
              dt_end: "2025-09-30",
              ac: 56.8,
              ac_vs_ly: -0.7,
              card_view: "BEER_PARTICIPATION",
              kpi_name: "Beer Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "R12M",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      const validate = ajv.compile(consumerBehaviorBigNumberDataItemSchema);

      const beerCard = result.find(
        (card) => card.title === "Beer Participation",
      );
      expect(beerCard).toBeDefined();

      beerCard.bigNumberData.forEach((dataItem, index) => {
        const isValid = validate(dataItem);
        if (!isValid) {
          console.log(`Data item ${index} validation errors:`, validate.errors);
        }
        expect(isValid).toBe(true);
      });
    });
  });

  describe("Different timeperiod values", () => {
    it("should format period correctly with YTD timeperiod", async () => {
      const mockInput = {
        datasources: {
          "category-home_consumer-behavior": [
            {
              dt_ini: "2025-01-01",
              dt_end: "2025-09-30",
              ac: 56.8,
              ac_vs_ly: -0.7,
              card_view: "BEER_PARTICIPATION",
              kpi_name: "Beer Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "YTD",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result[0].period).toBe("Q3'25 - YTD");
    });

    it("should format period correctly with MTD timeperiod", async () => {
      const mockInput = {
        datasources: {
          "category-home_consumer-behavior": [
            {
              dt_ini: "2025-01-01",
              dt_end: "2025-09-30",
              ac: 56.8,
              ac_vs_ly: -0.7,
              card_view: "BEER_PARTICIPATION",
              kpi_name: "Beer Participation",
              measure: "pp",
              unit_of_measure: "%",
              variationDirectionVsLy: "down",
              period: "MTD",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result[0].period).toBe("Q3'25 - MTD");
    });
  });
});
