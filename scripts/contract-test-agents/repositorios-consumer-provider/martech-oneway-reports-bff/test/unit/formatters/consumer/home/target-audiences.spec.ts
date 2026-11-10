import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "node:fs";
import * as path from "node:path";
import jsonata from "jsonata";
import {
  targetAudiencesSchema,
  targetAudiencesBigNumberDataItemSchema,
} from "../../../../../src/infrastructure/schema/components/targetAudiences.schema";

describe("target-audiences formatter", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/consumer/home/target-audiences.jsonata",
    );

    const expression = fs.readFileSync(jsonataPath, "utf8");

    return jsonata(expression);
  };

  it("should return the complete expected structure and pass schema validation", async () => {
    const mockInput = {
      datasources: {
        "consumer_home_target-audiences": [
          {
            dt_ini: "2024-12-01T00:00:00.000Z",
            dt_end: "2025-11-01T00:00:00.000Z",
            core_audience: 17.7,
            core_audience_vs_total: 140.4,
            total: 13.5,
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    const validateStructure = ajv.compile(targetAudiencesSchema);
    const isStructureValid = validateStructure(result);
    if (!isStructureValid) {
      console.log("Structure validation errors:", validateStructure.errors);
    }
    expect(isStructureValid).toBe(true);

    const validateDataItem = ajv.compile(
      targetAudiencesBigNumberDataItemSchema,
    );
    result.bigNumberData.forEach((item: unknown) => {
      const isItemValid = validateDataItem(item);
      expect(isItemValid).toBe(true);
    });

    expect(result.title).toBe("Participation index");
    expect(result.description).toBe("Core Audience vs Total");
    expect(result.period).toBe("Q4'25 - R12M");

    expect(result.bigNumberData).toHaveLength(1);
    const item = result.bigNumberData[0];
    expect(item.bigNumber.value).toBe("140.4");
    expect(item.bigNumber.measure).toBe("");
    expect(item.bigNumber.trend).toBe("positive");
    expect(item.comparison.label).toBe("vs");
    expect(item.comparison.value).toBe("Dec'24");
    expect(item.secondaryInfo.label).toBe("");
    expect(item.secondaryInfo.value).toBe("");
  });

  it("should resolve trend correctly", async () => {
    const cases = [
      { core_audience_vs_total: 3.8, expectedTrend: "positive" },
      { core_audience_vs_total: -2.3, expectedTrend: "negative" },
      { core_audience_vs_total: 0, expectedTrend: "positive" },
    ];

    for (const { core_audience_vs_total, expectedTrend } of cases) {
      const mockInput = {
        datasources: {
          "consumer_home_target-audiences": [
            {
              dt_ini: "2024-12-01T00:00:00.000Z",
              dt_end: "2025-11-01T00:00:00.000Z",
              core_audience_vs_total,
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result.bigNumberData[0].bigNumber.trend).toBe(expectedTrend);
    }
  });

  it("should build period from dt_end with correct quarter and year", async () => {
    const cases = [
      { dt_end: "2025-02-01T00:00:00.000Z", expectedPeriod: "Q1'25 - R12M" },
      { dt_end: "2025-05-01T00:00:00.000Z", expectedPeriod: "Q2'25 - R12M" },
      { dt_end: "2025-09-01T00:00:00.000Z", expectedPeriod: "Q3'25 - R12M" },
      { dt_end: "2025-11-01T00:00:00.000Z", expectedPeriod: "Q4'25 - R12M" },
    ];

    for (const { dt_end, expectedPeriod } of cases) {
      const mockInput = {
        datasources: {
          "consumer_home_target-audiences": [
            {
              dt_ini: "2024-12-01T00:00:00.000Z",
              dt_end,
              core_audience_vs_total: 100,
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result.period).toBe(expectedPeriod);
    }
  });

  it("should round correctly the core_audience_vs_total value", async () => {
    const cases = [
      { core_audience_vs_total: 1.15, expected: "1.2" },
      { core_audience_vs_total: -0.76, expected: "-0.8" },
      { core_audience_vs_total: 14, expected: "14.0" },
      { core_audience_vs_total: 100, expected: "100.0" },
    ];

    for (const { core_audience_vs_total, expected } of cases) {
      const mockInput = {
        datasources: {
          "consumer_home_target-audiences": [
            {
              dt_ini: "2024-12-01T00:00:00.000Z",
              dt_end: "2025-11-01T00:00:00.000Z",
              core_audience_vs_total,
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result.bigNumberData[0].bigNumber.value).toBe(expected);
    }
  });

  it("should return '-' when core_audience_vs_total is missing", async () => {
    const mockInput = {
      datasources: {
        "consumer_home_target-audiences": [
          {
            dt_ini: "2024-12-01T00:00:00.000Z",
            dt_end: "2025-11-01T00:00:00.000Z",
            core_audience: 17.7,
            total: 13.5,
          },
        ],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.bigNumberData[0].bigNumber.value).toBe("-");
  });

  it("should format comparison.value from dt_ini correctly", async () => {
    const cases = [
      { dt_ini: "2024-01-01T00:00:00.000Z", expected: "Jan'24" },
      { dt_ini: "2024-06-01T00:00:00.000Z", expected: "Jun'24" },
      { dt_ini: "2024-12-01T00:00:00.000Z", expected: "Dec'24" },
    ];

    for (const { dt_ini, expected } of cases) {
      const mockInput = {
        datasources: {
          "consumer_home_target-audiences": [
            {
              dt_ini,
              dt_end: "2025-11-01T00:00:00.000Z",
              core_audience_vs_total: 100,
            },
          ],
        },
      };

      const compiledExpression = await getCompiledExpression();
      const result = await compiledExpression.evaluate(mockInput);

      expect(result.bigNumberData[0].comparison.value).toBe(expected);
    }
  });

  it("should return empty values when datasource returns empty array", async () => {
    const mockInput = {
      datasources: {
        "consumer_home_target-audiences": [],
      },
    };

    const compiledExpression = await getCompiledExpression();
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.title).toBe("Participation index");
    expect(result.description).toBe("");
    expect(result.period).toBe("");
    expect(result.bigNumberData).toEqual([]);
  });
});
