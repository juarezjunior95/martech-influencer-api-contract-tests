import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "node:fs";
import * as path from "node:path";
import jsonata from "jsonata";
import {
  increaseParticipationSparkLineSchema,
  increaseParticipationBigNumberDataItemSchema,
} from "../../../../../src/infrastructure/schema/components/increaseParticipationSparkLine.schema";

describe("increase-participation formatter", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/consumer/home/increase-participation.jsonata",
    );

    const expression = fs.readFileSync(jsonataPath, "utf8");

    return jsonata(expression);
  };

  it("should return the complete expected structure and pass schema validation", async () => {
    const mockInput = {
      datasources: {
        "consumer_home_increase-participation": [
          { period_label: "Q1-25", ac: 10 },
          { period_label: "Q2-25", ac: 11.5 },
          { period_label: "Q3-25", ac: 13 },
          {
            period_label: "R12M",
            ac: 52.3,
            ac_vs_ly: 1.5,
            comp_unit_of_measure: "pp",
            unit_of_measure: "%",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const validateStructure = ajv.compile(increaseParticipationSparkLineSchema);
    const isStructureValid = validateStructure(result);
    if (!isStructureValid) {
      console.log("Structure validation errors:", validateStructure.errors);
    }
    expect(isStructureValid).toBe(true);

    const validateDataItem = ajv.compile(
      increaseParticipationBigNumberDataItemSchema,
    );
    result.bigNumberData.forEach((item: unknown) => {
      const isItemValid = validateDataItem(item);
      expect(isItemValid).toBe(true);
    });

    expect(result.chartTitle).toBe("P4W Participation");
    expect(result.chartPeriod).toBe("Q3'25 - R12M");

    expect(result.bigNumberData).toHaveLength(1);
    const item = result.bigNumberData[0];
    expect(item.bigNumber.value).toBe("1.5");
    expect(item.bigNumber.measure).toBe("pp");
    expect(item.bigNumber.trend).toBe("positive");
    expect(item.comparison.label).toBe("vs");
    expect(item.comparison.value).toBe("LY");
    expect(item.secondaryInfo.label).toBe("[ % ]");
    expect(item.secondaryInfo.value).toBe("52.3");

    expect(result.chartLineData).toHaveLength(3);
    expect(Number(result.chartLineData[0])).toBe(10);
    expect(Number(result.chartLineData[1])).toBe(11.5);
    expect(Number(result.chartLineData[2])).toBe(13);
  });

  it("should resolve trend correctly", async () => {
    const cases = [
      { ac_vs_ly: 3.8, expectedTrend: "positive" },
      { ac_vs_ly: -2.3, expectedTrend: "negative" },
      { ac_vs_ly: 0, expectedTrend: "positive" },
    ];

    for (const { ac_vs_ly, expectedTrend } of cases) {
      const mockInput = {
        datasources: {
          "consumer_home_increase-participation": [
            { period_label: "Q1-25", ac: 20 },
            {
              period_label: "R12M",
              ac: 50,
              ac_vs_ly,
              comp_unit_of_measure: "pp",
              unit_of_measure: "%",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result.bigNumberData[0].bigNumber.trend).toBe(expectedTrend);
    }
  });

  it("should build chartPeriod from last sparkline item with formatted label", async () => {
    const mockInput = {
      datasources: {
        "consumer_home_increase-participation": [
          { period_label: "Q1-24", ac: 10 },
          { period_label: "Q2-24", ac: 11 },
          { period_label: "Q3-24", ac: 12 },
          {
            period_label: "R12M",
            ac: 48,
            ac_vs_ly: 0.5,
            comp_unit_of_measure: "pp",
            unit_of_measure: "%",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.chartPeriod).toBe("Q3'24 - R12M");
  });

  it("should round correctly the ac_vs_ly value", async () => {
    const cases = [
      { ac_vs_ly: 1.15, expected: "1.2" },
      { ac_vs_ly: -0.76, expected: "-0.8" },
      { ac_vs_ly: 14, expected: "14.0" },
      { ac_vs_ly: 100, expected: "100.0" },
    ];
    for (const { ac_vs_ly, expected } of cases) {
      const mockInput = {
        datasources: {
          "consumer_home_increase-participation": [
            { period_label: "Q1-25", ac: 10 },
            {
              period_label: "R12M",
              ac: 50,
              ac_vs_ly,
              comp_unit_of_measure: "pp",
              unit_of_measure: "%",
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result.bigNumberData[0].bigNumber.value).toBe(expected);
    }
  });

  it("should return '-' when ac_vs_ly is missing", async () => {
    const mockInput = {
      datasources: {
        "consumer_home_increase-participation": [
          { period_label: "Q1-25", ac: 10 },
          {
            period_label: "R12M",
            ac: 50,
            comp_unit_of_measure: "pp",
            unit_of_measure: "%",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.bigNumberData[0].bigNumber.value).toBe("-");
  });

  it("should build chartLineData from sparkline items only, excluding the big number item", async () => {
    const mockInput = {
      datasources: {
        "consumer_home_increase-participation": [
          { period_label: "Q1-25", ac: 10.1 },
          { period_label: "Q2-25", ac: 12.3 },
          { period_label: "Q3-25", ac: 5.5 },
          { period_label: "Q4-25", ac: 6.7 },
          {
            period_label: "R12M",
            ac: 50,
            ac_vs_ly: 1,
            comp_unit_of_measure: "pp",
            unit_of_measure: "%",
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.chartLineData).toHaveLength(4);
    expect(Number(result.chartLineData[0])).toBe(10.1);
    expect(Number(result.chartLineData[1])).toBe(12.3);
    expect(Number(result.chartLineData[2])).toBe(5.5);
    expect(Number(result.chartLineData[3])).toBe(6.7);
  });
});
