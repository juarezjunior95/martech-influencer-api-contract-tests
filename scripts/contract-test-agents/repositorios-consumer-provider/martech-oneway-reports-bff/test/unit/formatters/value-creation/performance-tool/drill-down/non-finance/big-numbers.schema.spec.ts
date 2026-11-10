import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { generalBigNumbersSchema } from "@infrastructure/schema/components/generalBigNumbers.schema";

describe("big-numbers performance-tool formatter - JSONata Output", () => {
  let ajv: Ajv;
  let compiledExpression: any;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/performance-tool/drill-down/non-finance/big-numbers.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return array of BigNumber cards compliant with schema when YTD and QTD data are available", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "YTD",
            value: 45.6,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: 2.3,
            variation_direction_vs_ly: "up",
          },
          {
            period_type: "QTD",
            value: 42.1,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: -1.5,
            variation_direction_vs_ly: "down",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    const ytdCard = result[0];
    expect(ytdCard.header.title).toBe("Power YTD");
    expect(ytdCard.header.measure).toBe("[ % ]");
    expect(ytdCard.data.length).toBe(1);
    expect(ytdCard.data[0].bigNumber.value).toBe("2.3");
    expect(ytdCard.data[0].bigNumber.measure).toBe("pp");
    expect(ytdCard.data[0].bigNumber.trend).toBe("positive");
    expect(ytdCard.data[0].secondaryInfo.value).toBe("45.6");
    expect(ytdCard.data[0].secondaryInfo.label).toBe("[ % ]");
    expect(ytdCard.data[0].comparison.label).toBe("vs");
    expect(ytdCard.data[0].comparison.value).toBe("LY");

    const qtdCard = result[1];
    expect(qtdCard.header.title).toBe("Power LQ");
    expect(qtdCard.header.measure).toBe("[ % ]");
    expect(qtdCard.data.length).toBe(1);
    expect(qtdCard.data[0].bigNumber.value).toBe("-1.5");
    expect(qtdCard.data[0].bigNumber.measure).toBe("pp");
    expect(qtdCard.data[0].bigNumber.trend).toBe("negative");
    expect(qtdCard.data[0].secondaryInfo.value).toBe("42.1");
    expect(qtdCard.data[0].secondaryInfo.label).toBe("[ % ]");
    expect(qtdCard.data[0].comparison.label).toBe("vs");
    expect(qtdCard.data[0].comparison.value).toBe("LY");
  });

  it("should return empty state cards when no data available", async () => {
    const mockInput = {
      datasources: {},
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].header.title).toBe("Power YTD");
    expect(result[0].header.measure).toBe("");
    expect(result[0].data).toEqual([]);

    expect(result[1].header.title).toBe("Power LQ");
    expect(result[1].header.measure).toBe("");
    expect(result[1].data).toEqual([]);
  });

  it("should handle mixed data (YTD present, QTD empty)", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "YTD",
            value: 55.8,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: 4.7,
            variation_direction_vs_ly: "up",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].header.title).toBe("Power YTD");
    expect(result[0].data.length).toBe(1);
    expect(result[0].data[0].bigNumber.value).toBe("4.7");
    expect(result[0].data[0].bigNumber.trend).toBe("positive");

    expect(result[1].header.title).toBe("Power LQ");
    expect(result[1].data.length).toBe(0);
  });

  it("should handle mixed data (QTD present, YTD empty)", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "QTD",
            value: 38.2,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: -2.8,
            variation_direction_vs_ly: "down",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].header.title).toBe("Power YTD");
    expect(result[0].data.length).toBe(0);

    expect(result[1].header.title).toBe("Power LQ");
    expect(result[1].data.length).toBe(1);
    expect(result[1].data[0].bigNumber.value).toBe("-2.8");
    expect(result[1].data[0].bigNumber.trend).toBe("negative");
  });

  it("should handle negative variation values", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "YTD",
            value: 40.0,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: -5.5,
            variation_direction_vs_ly: "down",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].bigNumber.value).toBe("-5.5");
    expect(result[0].data[0].bigNumber.trend).toBe("negative");
  });

  it("should correctly assign measure as 'pp' for all cards", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "YTD",
            value: 45.0,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: 2.5,
            variation_direction_vs_ly: "up",
          },
          {
            period_type: "QTD",
            value: 42.0,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: -1.2,
            variation_direction_vs_ly: "down",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].bigNumber.measure).toBe("pp");
    expect(result[1].data[0].bigNumber.measure).toBe("pp");
  });

  it("should correctly assign comparison value as 'vs LY'", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "YTD",
            value: 45.0,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: 2.5,
            variation_direction_vs_ly: "up",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].comparison.value).toBe("LY");
    expect(result[0].data[0].comparison.label).toBe("vs");
  });

  it("should correctly assign secondaryInfo label based on value_measure", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "YTD",
            value: 1500,
            value_measure: "units",
            comp_unit_of_measure: "number",
            variation_vs_ly: 150,
            variation_direction_vs_ly: "up",
          },
          {
            period_type: "QTD",
            value: 85.5,
            value_measure: "index",
            comp_unit_of_measure: "number",
            variation_vs_ly: 5.2,
            variation_direction_vs_ly: "up",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].secondaryInfo.label).toBe("[ units ]");
    expect(result[1].data[0].secondaryInfo.label).toBe("[ index ]");
  });

  it("should handle zero values", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "YTD",
            value: 0,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: 0,
            variation_direction_vs_ly: "up",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].bigNumber.value).toBe("0.0");
    expect(result[0].data[0].secondaryInfo.value).toBe("0.0");
  });

  it("should correctly map direction 'up' to trend 'positive'", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "YTD",
            value: 50.0,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: 3.5,
            variation_direction_vs_ly: "up",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].bigNumber.trend).toBe("positive");
  });

  it("should correctly map direction 'down' to trend 'negative'", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_big-numbers": [
          {
            period_type: "QTD",
            value: 35.0,
            value_measure: "%",
            comp_unit_of_measure: "pp",
            variation_vs_ly: -4.2,
            variation_direction_vs_ly: "down",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(generalBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[1].data[0].bigNumber.trend).toBe("negative");
  });
});
