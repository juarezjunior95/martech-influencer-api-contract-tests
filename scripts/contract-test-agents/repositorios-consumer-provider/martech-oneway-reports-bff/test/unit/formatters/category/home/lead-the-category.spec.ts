import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import {
  categoryHomeSparkLineCardSchema,
  categoryHomeSparkLineArraySchema,
  categoryHomeSparkLineSchema,
  categoryHomeSparkLineBigNumberDataItemSchema,
} from "../../../../../src/infrastructure/schema/components/big-number";

describe("lead-the-category formatter", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/category/home/lead-the-category.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    return jsonata(expression);
  };

  const evaluate = async (data: object[]) => {
    const compiled = await getCompiledExpression();
    return compiled.evaluate({
      datasources: { "category_home_lead-the-category": data },
    });
  };

  const realData = [
    {
      country_iso_code_3: "BRA",
      dt_ini: "2025-04-01T00:00:00.000Z",
      dt_end: "2025-04-30T00:00:00.000Z",
      comp_value: "0.3",
      value: "61.2",
      display_type: "LINE_CHART",
      vs_ly_label_suffix: "MTD",
      refreshMonthLabel: "Apr'25",
      lyMonthLabel: "Apr'24",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
    },
    {
      country_iso_code_3: "BRA",
      dt_ini: "2025-05-01T00:00:00.000Z",
      dt_end: "2025-05-31T00:00:00.000Z",
      comp_value: "-0.1",
      value: "60.8",
      display_type: "LINE_CHART",
      vs_ly_label_suffix: "MTD",
      refreshMonthLabel: "May'25",
      lyMonthLabel: "May'24",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
    },
    {
      country_iso_code_3: "BRA",
      dt_ini: "2025-06-01T00:00:00.000Z",
      dt_end: "2025-06-30T00:00:00.000Z",
      comp_value: "0.5",
      value: "61.5",
      display_type: "LINE_CHART",
      vs_ly_label_suffix: "MTD",
      refreshMonthLabel: "Jun'25",
      lyMonthLabel: "Jun'24",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
    },
    {
      country_iso_code_3: "BRA",
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-09-30T00:00:00.000Z",
      comp_value: "-1.1",
      value: "61.0",
      display_type: "BIG_NUMBER",
      vs_ly_label_suffix: "YTD",
      refreshMonthLabel: "Sep'25",
      lyMonthLabel: "Sep'24",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
    },
  ];

  it("should return array with one card from real data", async () => {
    const result: any = await evaluate(realData);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].chartTitle).toBe("ABI Market Share");
    expect(result[0].chartPeriod).toBe("Sep'25 YTD");

    expect(result[0].bigNumberData).toHaveLength(1);
    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-1.1");
    expect(result[0].bigNumberData[0].bigNumber.measure).toBe("pp");
    expect(result[0].bigNumberData[0].bigNumber.trend).toBe("negative");
    expect(result[0].bigNumberData[0].comparison).toEqual({
      label: "vs",
      value: "LY",
    });
    expect(result[0].bigNumberData[0].secondaryInfo.label).toBe("[ % ]");
    expect(result[0].bigNumberData[0].secondaryInfo.value).toBe("61.0");

    expect(result[0].chartLineData).toHaveLength(3);
    expect(result[0].chartLineData).toEqual([61.2, 60.8, 61.5]);
  });

  it("should return empty array for empty datasource", async () => {
    const result: any = await evaluate([]);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  it("should separate data correctly by display_type", async () => {
    const result: any = await evaluate(realData);

    expect(result[0].chartLineData).toHaveLength(3);
    expect(result[0].bigNumberData[0].secondaryInfo.value).toBe("61.0");
  });

  it("should handle positive comp_value correctly", async () => {
    const positiveData = [
      {
        ...realData[3],
        comp_value: "2.5",
        value: "63.0",
      },
    ];
    const result: any = await evaluate(positiveData);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("2.5");
    expect(result[0].bigNumberData[0].bigNumber.trend).toBe("positive");
  });

  it("should handle negative comp_value correctly", async () => {
    const negativeData = [
      {
        ...realData[3],
        comp_value: "-3.5",
        value: "58.0",
      },
    ];
    const result: any = await evaluate(negativeData);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-3.5");
    expect(result[0].bigNumberData[0].bigNumber.trend).toBe("negative");
  });

  it("should handle null comp_value and value gracefully", async () => {
    const dataWithNulls = [
      {
        ...realData[3],
        comp_value: null,
        value: null,
      },
    ];
    const result: any = await evaluate(dataWithNulls);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-");
    expect(result[0].bigNumberData[0].secondaryInfo.value).toBe("-");
  });

  it("should sort sparkline data by dt_end ascending", async () => {
    const unsortedData = [realData[2], realData[0], realData[1], realData[3]];
    const result: any = await evaluate(unsortedData);

    expect(result[0].chartLineData).toEqual([61.2, 60.8, 61.5]);
  });

  it("should use comp_unit_of_measure for market share measure", async () => {
    const result: any = await evaluate(realData);

    expect(result[0].bigNumberData[0].bigNumber.measure).toBe("pp");
  });

  it("should use comparison label 'vs' and value 'LY'", async () => {
    const result: any = await evaluate(realData);

    expect(result[0].bigNumberData[0].comparison.label).toBe("vs");
    expect(result[0].bigNumberData[0].comparison.value).toBe("LY");
  });

  it("should handle only BIG_NUMBER record (no sparkline points)", async () => {
    const onlyBigNumber = [realData[3]];
    const result: any = await evaluate(onlyBigNumber);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].chartTitle).toBe("ABI Market Share");
    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-1.1");
    expect(result[0].chartLineData).toEqual([]);
  });

  it("should handle data with more LINE_CHART points (up to 6)", async () => {
    const extendedData = [
      {
        ...realData[0],
        dt_end: "2025-01-31T00:00:00.000Z",
        value: "60.0",
      },
      {
        ...realData[0],
        dt_end: "2025-02-28T00:00:00.000Z",
        value: "60.5",
      },
      {
        ...realData[0],
        dt_end: "2025-03-31T00:00:00.000Z",
        value: "61.0",
      },
      ...realData,
    ];
    const result: any = await evaluate(extendedData);

    expect(result[0].chartLineData).toHaveLength(6);
  });

  describe("Schema validation", () => {
    it("should validate result item against categoryHomeSparkLineCardSchema", async () => {
      const result: any = await evaluate(realData);

      const validate = ajv.compile(categoryHomeSparkLineCardSchema);
      const isValid = validate(result[0]);

      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }

      expect(isValid).toBe(true);
    });

    it("should validate result against categoryHomeSparkLineArraySchema", async () => {
      const result: any = await evaluate(realData);

      const validate = ajv.compile(categoryHomeSparkLineArraySchema);
      const isValid = validate(result);

      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }

      expect(isValid).toBe(true);
    });

    it("should validate result against main categoryHomeSparkLineSchema", async () => {
      const result: any = await evaluate(realData);

      const validate = ajv.compile(categoryHomeSparkLineSchema);
      const isValid = validate(result);

      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }

      expect(isValid).toBe(true);
    });

    it("should validate bigNumberData items against categoryHomeSparkLineBigNumberDataItemSchema", async () => {
      const result: any = await evaluate(realData);

      const validate = ajv.compile(
        categoryHomeSparkLineBigNumberDataItemSchema,
      );

      result[0].bigNumberData.forEach((dataItem: any, index: number) => {
        const isValid = validate(dataItem);
        if (!isValid) {
          console.log(`Data item ${index} validation errors:`, validate.errors);
        }
        expect(isValid).toBe(true);
      });
    });
  });
});
