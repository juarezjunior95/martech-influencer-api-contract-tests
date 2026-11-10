import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { volumeBigNumbersSchema } from "@infrastructure/schema/components/volumeBigNumber.schema";
import { registerHelpers } from "../../../../../../../../src/infrastructure/repositories/helpers";

describe("Market Share Overtime Performance - big-numbers formatter", () => {
  let ajv: Ajv;
  let compiledExpression: any;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/performance-tool/drill-down/non-finance/market-share/big-numbers.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return 3 cards with empty data when datasource is empty", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance":
          [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].header).toEqual({
      title: "Market Share YTD",
      measure: "[ k hl ]",
    });
    expect(result[0].data).toEqual([]);
    expect(result[1].header).toEqual({
      title: "Market Share L3M",
      measure: "[ k hl ]",
    });
    expect(result[1].data).toEqual([]);
    expect(result[2].header.title).toMatch(
      /^Market Share [A-Z][a-z]{2}'[0-9]{2}$/,
    );
    expect(result[2].header.measure).toBe("[ k hl ]");
    expect(result[2].data).toEqual([]);
  });

  it("should return 3 cards with only YTD filled and L3M/MTD empty when only YTD is present", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 30.2,
              ac_vs_ly: -2.1,
              ac_vs_bu: 30.2,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "up",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].header.title).toBe("Market Share YTD");
    expect(result[0].header.measure).toBe("[ k hl ]");
    expect(result[0].data.length).toBe(1);
    expect(result[1].header.title).toBe("Market Share L3M");
    expect(result[1].data).toEqual([]);
    expect(result[2].header.title).toMatch(
      /^Market Share [A-Z][a-z]{2}'[0-9]{2}$/,
    );
    expect(result[2].data).toEqual([]);
  });

  it("should return 3 cards with YTD empty and L3M/MTD filled when only L3M and MTD are present", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance":
          [
            {
              period: "L3M",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 30.8,
              ac_vs_ly: -2.8,
              ac_vs_bu: 30.8,
              vs_ly_label_suffix: "L3M",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "up",
              refreshMonthLabel: "Dec'25",
            },
            {
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 30.4,
              ac_vs_ly: -3.3,
              ac_vs_bu: 30.4,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "up",
              refreshMonthLabel: "Mar'26",
            },
          ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].header.title).toBe("Market Share YTD");
    expect(result[0].data).toEqual([]);
    expect(result[1].header.title).toBe("Market Share L3M");
    expect(result[1].data.length).toBe(1);
    expect(result[2].header.title).toBe("Market Share Mar'26");
    expect(result[2].data.length).toBe(1);
  });

  it("should use formatCurrentPeriod when MTD period exists but refreshMonthLabel is missing or empty", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance":
          [
            {
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 30.4,
              ac_vs_ly: -3.3,
              ac_vs_bu: 30.4,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "up",
            },
          ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[2].header.title).toMatch(
      /^Market Share [A-Z][a-z]{2}'[0-9]{2}$/,
    );
    expect(result[2].data.length).toBe(1);
  });

  it("should return 3 cards (YTD, L3M, MTD) with valid structure when data is present", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance":
          [
            {
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 30.4,
              ac_vs_ly: -3.3,
              ac_vs_bu: 30.4,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "up",
              refreshMonthLabel: "Mar'26",
            },
            {
              period: "L3M",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 30.8,
              ac_vs_ly: -2.8,
              ac_vs_bu: 30.8,
              vs_ly_label_suffix: "L3M",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "up",
              refreshMonthLabel: "Dec'25",
            },
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 30.2,
              ac_vs_ly: -2.1,
              ac_vs_bu: 30.2,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "down",
              variationDirectionVsBu: "up",
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

    expect(result[0].header.title).toBe("Market Share YTD");
    expect(result[1].header.title).toBe("Market Share L3M");
    expect(result[2].header.title).toBe("Market Share Mar'26");
    expect(result[0].data[0].comparison.value).toBe("LY");
  });
});
