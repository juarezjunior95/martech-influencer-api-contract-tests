import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { volumeBigNumbersSchema } from "@infrastructure/schema/components/volumeBigNumber.schema";

describe("Volume Overtime Performance - big-numbers formatter - JSONata Output", () => {
  let ajv: Ajv;
  let compiledExpression: any;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/volume/big-numbers.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return array of 3 BigNumber cards (YTD, L3M, MTD) compliant with schema when all data are available", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              dt_ini: "2025-12-01T00:00:00.000Z",
              dt_end: "2025-12-01T00:00:00.000Z",
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 51448.11,
              ac_vs_ly: 2.82,
              ac_vs_bu: -1.7,
              comp_direction: "down",
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
              lyMonthLabel: "Dec'24",
            },
            {
              dt_ini: "2025-10-01T00:00:00.000Z",
              dt_end: "2025-12-01T00:00:00.000Z",
              period: "L3M",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 139165.88,
              ac_vs_ly: -1.6,
              ac_vs_bu: -4.61,
              comp_direction: "down",
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
              lyMonthLabel: "Dec'24",
            },
            {
              dt_ini: "2025-01-01T00:00:00.000Z",
              dt_end: "2025-12-01T00:00:00.000Z",
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 561100.19,
              ac_vs_ly: -2.36,
              ac_vs_bu: -3.82,
              comp_direction: "down",
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
              lyMonthLabel: "Dec'24",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    const validate = ajv.compile(volumeBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // Validate YTD card (first in order)
    const ytdCard = result[0];
    expect(ytdCard.header.title).toBe("Volume YTD");
    expect(ytdCard.header.measure).toBe("[ k hl ]");
    expect(ytdCard.data.length).toBe(2);

    // YTD - vs LY
    expect(ytdCard.data[0].bigNumber.value).toBe("-2.4");
    expect(ytdCard.data[0].bigNumber.measure).toBe("%");
    expect(ytdCard.data[0].bigNumber.trend).toBe("negative");
    expect(ytdCard.data[0].secondaryInfo.value).toBe("561,100.2");
    expect(ytdCard.data[0].secondaryInfo.label).toBe("[ k hl ]");
    expect(ytdCard.data[0].comparison.label).toBe("vs");
    expect(ytdCard.data[0].comparison.value).toBe("LY");

    // YTD - vs BU
    expect(ytdCard.data[1].bigNumber.value).toBe("-3.8");
    expect(ytdCard.data[1].bigNumber.measure).toBe("%");
    expect(ytdCard.data[1].bigNumber.trend).toBe("negative");
    expect(ytdCard.data[1].comparison.label).toBe("vs");
    expect(ytdCard.data[1].comparison.value).toBe("BU");

    // Validate L3M card (second in order)
    const r3mCard = result[1];
    expect(r3mCard.header.title).toBe("Volume L3M");
    expect(r3mCard.header.measure).toBe("[ k hl ]");
    expect(r3mCard.data.length).toBe(2);
    expect(r3mCard.data[0].bigNumber.value).toBe("-1.6");
    expect(r3mCard.data[0].bigNumber.trend).toBe("negative");
    expect(r3mCard.data[0].secondaryInfo.value).toBe("139,165.9");

    // Validate MTD card (third in order)
    const mthCard = result[2];
    expect(mthCard.header.title).toBe("Volume Dec'25");
    expect(mthCard.header.measure).toBe("[ k hl ]");
    expect(mthCard.data.length).toBe(2);
    expect(mthCard.data[0].bigNumber.value).toBe("2.8");
    expect(mthCard.data[0].bigNumber.trend).toBe("positive");
    expect(mthCard.data[0].secondaryInfo.value).toBe("51,448.1");
    expect(mthCard.data[1].bigNumber.value).toBe("-1.7");
    expect(mthCard.data[1].bigNumber.trend).toBe("negative");
  });

  it("should return empty state cards when no datasource available", async () => {
    const mockInput = {
      datasources: {},
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    const validate = ajv.compile(volumeBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // All cards should have empty data arrays
    expect(result[0].header.title).toBe("Volume YTD");
    expect(result[0].header.measure).toBe("[ k hl ]");
    expect(result[0].data).toEqual([]);

    expect(result[1].header.title).toBe("Volume L3M");
    expect(result[1].header.measure).toBe("[ k hl ]");
    expect(result[1].data).toEqual([]);

    expect(result[2].header.title).toBe("Volume MTD");
    expect(result[2].header.measure).toBe("[ k hl ]");
    expect(result[2].data).toEqual([]);
  });

  it("should handle mixed data - only YTD present", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 561100.19,
              ac_vs_ly: -2.36,
              ac_vs_bu: -3.82,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    const validate = ajv.compile(volumeBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // YTD should have data
    expect(result[0].header.title).toBe("Volume YTD");
    expect(result[0].data.length).toBe(2);
    expect(result[0].data[0].bigNumber.value).toBe("-2.4");

    // L3M should be empty
    expect(result[1].header.title).toBe("Volume L3M");
    expect(result[1].data.length).toBe(0);

    // MTD should be empty
    expect(result[2].header.title).toBe("Volume MTD");
    expect(result[2].data.length).toBe(0);
  });

  it("should handle mixed data - only L3M and MTD present", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              period: "L3M",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 139165.88,
              ac_vs_ly: -1.6,
              ac_vs_bu: -4.61,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
            {
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 51448.11,
              ac_vs_ly: 2.82,
              ac_vs_bu: -1.7,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Nov'25",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    const validate = ajv.compile(volumeBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // YTD should be empty
    expect(result[0].data.length).toBe(0);

    // L3M should have data
    expect(result[1].header.title).toBe("Volume L3M");
    expect(result[1].data.length).toBe(2);
    expect(result[1].data[0].bigNumber.value).toBe("-1.6");

    // MTD should have data
    expect(result[2].header.title).toBe("Volume Nov'25");
    expect(result[2].data.length).toBe(2);
    expect(result[2].data[0].bigNumber.value).toBe("2.8");
    expect(result[2].data[0].bigNumber.trend).toBe("positive");
  });

  it("should handle null or missing ac values", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: null,
              ac_vs_ly: -2.36,
              ac_vs_bu: -3.82,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
            {
              period: "L3M",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 139165.88,
              ac_vs_ly: -1.6,
              ac_vs_bu: -4.61,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    const validate = ajv.compile(volumeBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // YTD with null ac should have empty data
    expect(result[0].data.length).toBe(0);

    // L3M with valid ac should have data
    expect(result[1].data.length).toBe(2);
  });

  it("should handle positive and negative variation values correctly", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 100000,
              ac_vs_ly: 5.5,
              ac_vs_bu: -2.3,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(volumeBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].bigNumber.value).toBe("5.5");
    expect(result[0].data[0].bigNumber.trend).toBe("positive");
    expect(result[0].data[1].bigNumber.value).toBe("-2.3");
    expect(result[0].data[1].bigNumber.trend).toBe("negative");
  });

  it("should format large numbers with thousands separator", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 1234567.89,
              ac_vs_ly: 2.5,
              ac_vs_bu: -1.2,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(volumeBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].secondaryInfo.value).toBe("1,234,567.9");
  });

  it("should handle zero values", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 0,
              ac_vs_ly: 0,
              ac_vs_bu: 0,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "up",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(volumeBigNumbersSchema);
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

  it("should maintain correct order: YTD -> L3M -> MTD regardless of datasource order", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            // Intentionally out of order in datasource
            {
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 51448.11,
              ac_vs_ly: 2.82,
              ac_vs_bu: -1.7,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 561100.19,
              ac_vs_ly: -2.36,
              ac_vs_bu: -3.82,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
            {
              period: "L3M",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 139165.88,
              ac_vs_ly: -1.6,
              ac_vs_bu: -4.61,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    // Verify order: YTD -> L3M -> MTD
    expect(result[0].header.title).toBe("Volume YTD");
    expect(result[1].header.title).toBe("Volume L3M");
    expect(result[2].header.title).toBe("Volume Dec'25");
  });

  it("should use dynamic month label from refreshMonthLabel", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 51448.11,
              ac_vs_ly: 2.82,
              ac_vs_bu: -1.7,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Jan'26",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result[2].header.title).toBe("Volume Jan'26");
  });

  it("should correctly assign comparison values", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_volume_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 100000,
              ac_vs_ly: 2.5,
              ac_vs_bu: -1.2,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const validate = ajv.compile(volumeBigNumbersSchema);
    const isValid = validate(result);
    if (!isValid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    expect(result[0].data[0].comparison.label).toBe("vs");
    expect(result[0].data[0].comparison.value).toBe("LY");
    expect(result[0].data[1].comparison.label).toBe("vs");
    expect(result[0].data[1].comparison.value).toBe("BU");
  });
});
