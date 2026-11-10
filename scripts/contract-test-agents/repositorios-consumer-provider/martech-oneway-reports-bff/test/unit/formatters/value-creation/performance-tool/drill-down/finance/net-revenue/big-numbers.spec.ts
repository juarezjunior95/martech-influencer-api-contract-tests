import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { volumeBigNumbersSchema } from "@infrastructure/schema/components/volumeBigNumber.schema";
import { registerHelpers } from "../../../../../../../../src/infrastructure/repositories/helpers";

describe("Net Revenue Overtime Performance - big-numbers formatter", () => {
  let ajv: Ajv;
  let compiledExpression: any;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/net-revenue/big-numbers.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return 3 cards with empty data when datasources is empty", async () => {
    const mockInput = { datasources: {} };
    const result = await compiledExpression.evaluate(mockInput);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].header).toEqual({ title: "Net Revenue YTD", measure: "" });
    expect(result[0].data).toEqual([]);
    expect(result[1].header).toEqual({ title: "Net Revenue L3M", measure: "" });
    expect(result[1].data).toEqual([]);
    expect(result[2].header).toEqual({ title: "Net Revenue MTD", measure: "" });
    expect(result[2].data).toEqual([]);
  });

  it("should return 3 cards with empty data when datasource array is empty", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-performance":
          [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].header).toEqual({ title: "Net Revenue YTD", measure: "" });
    expect(result[0].data).toEqual([]);
    expect(result[1].header).toEqual({ title: "Net Revenue L3M", measure: "" });
    expect(result[1].data).toEqual([]);
    expect(result[2].header).toEqual({ title: "Net Revenue MTD", measure: "" });
    expect(result[2].data).toEqual([]);
  });

  it("should return 3 cards with only YTD filled and L3M/MTD empty when only YTD is present", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 59319.6,
              ac_vs_ly: 2.2,
              ac_vs_bu: -3.5,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].header.title).toBe("Net Revenue YTD");
    expect(result[0].header.measure).toBe("[ k hl ]");
    expect(result[0].data.length).toBe(2);
    expect(result[1].header.title).toBe("Net Revenue L3M");
    expect(result[1].data).toEqual([]);
    expect(result[2].header.title).toBe("Net Revenue MTD");
    expect(result[2].data).toEqual([]);
  });

  it("should return 3 cards with YTD empty and L3M/MTD filled when only L3M and MTD are present", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-performance":
          [
            {
              period: "L3M",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 15555.2,
              ac_vs_ly: 2.7,
              ac_vs_bu: -3.9,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
            },
            {
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 5775.2,
              ac_vs_ly: 6.4,
              ac_vs_bu: 0.8,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "up",
              refreshMonthLabel: "Dec'25",
            },
          ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].header.title).toBe("Net Revenue YTD");
    expect(result[0].data).toEqual([]);
    expect(result[1].header.title).toBe("Net Revenue L3M");
    expect(result[1].data.length).toBe(2);
    expect(result[2].header.title).toBe("Net Revenue Dec'25");
    expect(result[2].data.length).toBe(2);
  });

  it("should set trend to positive when ac_vs_ly or ac_vs_bu are zero", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-performance":
          [
            {
              period: "YTD",
              unit_of_measure: "$Mio",
              comp_unit_of_measure: "%",
              ac: 41921.5,
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
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    const ytdCard = result[0];
    expect(ytdCard.data.length).toBe(2);
    expect(ytdCard.data[0].bigNumber.value).toBe("0.0");
    expect(ytdCard.data[0].bigNumber.trend).toBe("positive");
    expect(ytdCard.data[1].bigNumber.value).toBe("0.0");
    expect(ytdCard.data[1].bigNumber.trend).toBe("positive");
  });

  it("should return 3 cards (YTD, L3M, MTD) with valid structure when data is present", async () => {
    const mockInput = {
      datasources: {
        "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-performance":
          [
            {
              period: "MTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 5775.2,
              ac_vs_ly: 6.4,
              ac_vs_bu: 0.8,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "up",
              refreshMonthLabel: "Dec'25",
              lyMonthLabel: "Dec'24",
            },
            {
              period: "L3M",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 15555.2,
              ac_vs_ly: 2.7,
              ac_vs_bu: -3.9,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "up",
              variationDirectionVsBu: "down",
              refreshMonthLabel: "Dec'25",
              lyMonthLabel: "Dec'24",
            },
            {
              period: "YTD",
              unit_of_measure: "k hl",
              comp_unit_of_measure: "%",
              ac: 59319.6,
              ac_vs_ly: 2.2,
              ac_vs_bu: -3.5,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "up",
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

    expect(result[0].header.title).toBe("Net Revenue YTD");
    expect(result[1].header.title).toBe("Net Revenue L3M");
    expect(result[2].header.title).toBe("Net Revenue Dec'25");
    expect(result[0].data[0].comparison.value).toBe("LY");
    expect(result[0].data[1].comparison.value).toBe("BU");
  });
});
