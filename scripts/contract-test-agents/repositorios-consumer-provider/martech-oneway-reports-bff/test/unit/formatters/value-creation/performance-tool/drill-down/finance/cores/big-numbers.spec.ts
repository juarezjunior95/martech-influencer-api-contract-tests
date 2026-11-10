import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";
import { volumeBigNumbersSchema } from "@infrastructure/schema/components/volumeBigNumber.schema";

const DATASOURCE_NAME =
  "value-creation_performance-tool_drill-down_finance_cores_overtime-performance";

describe("Cores Overtime Performance - big-numbers formatter", () => {
  let ajv: Ajv;
  let compiledExpression: any;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/cores/big-numbers.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return 3 cards (YTD, L3M, MTD) with vs LY and vs BU when data is available", async () => {
    const mockInput = {
      datasources: {
        [DATASOURCE_NAME]: [
          {
            period: "YTD",
            unit_of_measure: "$Mio",
            comp_unit_of_measure: "%",
            ac: 27688.4,
            ac_vs_ly: 2.3,
            ac_vs_bu: -4,
            variationDirectionVsLy: "up",
            variationDirectionVsBu: "down",
            refreshMonthLabel: "Dec'25",
          },
          {
            period: "L3M",
            unit_of_measure: "$Mio",
            comp_unit_of_measure: "%",
            ac: 7186.9,
            ac_vs_ly: -0.1,
            ac_vs_bu: -7.7,
            variationDirectionVsLy: "down",
            variationDirectionVsBu: "down",
            refreshMonthLabel: "Dec'25",
          },
          {
            period: "MTD",
            unit_of_measure: "$Mio",
            comp_unit_of_measure: "%",
            ac: 2711,
            ac_vs_ly: 5.6,
            ac_vs_bu: -3.1,
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

    const validate = ajv.compile(volumeBigNumbersSchema);
    expect(validate(result)).toBe(true);

    expect(result[0].header.title).toBe("CORES YTD");
    expect(result[0].header.measure).toBe("[ $Mio ]");
    expect(result[0].data.length).toBe(2);
    expect(result[0].data[0].comparison.value).toBe("LY");
    expect(result[0].data[1].comparison.value).toBe("BU");

    expect(result[1].header.title).toBe("CORES L3M");
    expect(result[2].header.title).toBe("CORES Dec'25");
  });

  it("should return 3 cards with empty data when datasource is empty", async () => {
    const mockInput = { datasources: { [DATASOURCE_NAME]: [] } };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      header: { title: "CORES YTD", measure: "[ $Mio ]" },
      data: [],
    });
    expect(result[1]).toEqual({
      header: { title: "CORES L3M", measure: "[ $Mio ]" },
      data: [],
    });
    expect(result[2]).toEqual({
      header: { title: "CORES MTD", measure: "[ $Mio ]" },
      data: [],
    });
  });

  it("should return 3 cards with empty data when datasource is missing", async () => {
    const mockInput = { datasources: {} };

    const result = await compiledExpression.evaluate(mockInput);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result[0].header).toEqual({
      title: "CORES YTD",
      measure: "[ $Mio ]",
    });
    expect(result[1].header).toEqual({
      title: "CORES L3M",
      measure: "[ $Mio ]",
    });
    expect(result[2].header).toEqual({
      title: "CORES MTD",
      measure: "[ $Mio ]",
    });
    expect(result[0].data).toEqual([]);
    expect(result[1].data).toEqual([]);
    expect(result[2].data).toEqual([]);
  });

  it("should have YTD card with data and L3M/MTD cards with empty data when only YTD present", async () => {
    const mockInput = {
      datasources: {
        [DATASOURCE_NAME]: [
          {
            period: "YTD",
            unit_of_measure: "$Mio",
            comp_unit_of_measure: "%",
            ac: 1000,
            ac_vs_ly: 1.5,
            ac_vs_bu: -2,
            variationDirectionVsLy: "up",
            variationDirectionVsBu: "down",
            refreshMonthLabel: "Dec'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.length).toBe(3);
    expect(result[0].data.length).toBe(2);
    expect(result[1].data).toEqual([]);
    expect(result[2].data).toEqual([]);
  });

  it("should have L3M card with data and YTD/MTD cards with empty data when only L3M present", async () => {
    const mockInput = {
      datasources: {
        [DATASOURCE_NAME]: [
          {
            period: "L3M",
            unit_of_measure: "$Mio",
            comp_unit_of_measure: "%",
            ac: 5000,
            ac_vs_ly: -1.2,
            ac_vs_bu: 0.5,
            variationDirectionVsLy: "down",
            variationDirectionVsBu: "up",
            refreshMonthLabel: "Dec'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.length).toBe(3);
    expect(result[0].data).toEqual([]);
    expect(result[1].data.length).toBe(2);
    expect(result[2].data).toEqual([]);
  });

  it("should have MTD card with data and YTD/L3M cards with empty data when only MTD present", async () => {
    const mockInput = {
      datasources: {
        [DATASOURCE_NAME]: [
          {
            period: "MTD",
            unit_of_measure: "$Mio",
            comp_unit_of_measure: "%",
            ac: 500,
            ac_vs_ly: 3,
            ac_vs_bu: -1,
            variationDirectionVsLy: "up",
            variationDirectionVsBu: "down",
            refreshMonthLabel: "Feb'26",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.length).toBe(3);
    expect(result[0].data).toEqual([]);
    expect(result[1].data).toEqual([]);
    expect(result[2].data.length).toBe(2);
    expect(result[2].header.title).toBe("CORES Feb'26");
  });

  it("should set trend positive when value >= 0 or direction is up", async () => {
    const mockInput = {
      datasources: {
        [DATASOURCE_NAME]: [
          {
            period: "YTD",
            unit_of_measure: "$Mio",
            comp_unit_of_measure: "%",
            ac: 1000,
            ac_vs_ly: 5.5,
            ac_vs_bu: 0,
            variationDirectionVsLy: "up",
            variationDirectionVsBu: "up",
            refreshMonthLabel: "Dec'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].data[0].bigNumber.value).toBe("5.5");
    expect(result[0].data[0].bigNumber.trend).toBe("positive");
    expect(result[0].data[1].bigNumber.value).toBe("0.0");
    expect(result[0].data[1].bigNumber.trend).toBe("positive");
  });

  it("should set trend negative when value < 0 and direction is down", async () => {
    const mockInput = {
      datasources: {
        [DATASOURCE_NAME]: [
          {
            period: "YTD",
            unit_of_measure: "$Mio",
            comp_unit_of_measure: "%",
            ac: 1000,
            ac_vs_ly: -2.1,
            ac_vs_bu: -3.5,
            variationDirectionVsLy: "down",
            variationDirectionVsBu: "down",
            refreshMonthLabel: "Dec'25",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result[0].data[0].bigNumber.value).toBe("-2.1");
    expect(result[0].data[0].bigNumber.trend).toBe("negative");
    expect(result[0].data[1].bigNumber.value).toBe("-3.5");
    expect(result[0].data[1].bigNumber.trend).toBe("negative");
  });
});
