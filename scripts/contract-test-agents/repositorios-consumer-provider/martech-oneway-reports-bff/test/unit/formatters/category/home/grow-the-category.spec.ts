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

describe("grow-the-category formatter", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/category/home/grow-the-category.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    return jsonata(expression);
  };

  const evaluate = async (data: object[]) => {
    const compiled = await getCompiledExpression();
    return compiled.evaluate({
      datasources: { "category_home_grow-the-category": data },
    });
  };

  const realData = [
    {
      dt_ini: "2023-10-01T00:00:00.000Z",
      dt_end: "2023-12-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "51.8",
      ac_vs_ly: "51.8",
      ly: 0,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Dec'23",
      lyMonthLabel: "Dec'22",
    },
    {
      dt_ini: "2024-01-01T00:00:00.000Z",
      dt_end: "2024-03-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "53.2",
      ac_vs_ly: "53.2",
      ly: 0,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Mar'24",
      lyMonthLabel: "Mar'23",
    },
    {
      dt_ini: "2024-04-01T00:00:00.000Z",
      dt_end: "2024-06-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "51.2",
      ac_vs_ly: "0.0",
      ly: 51.2,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Jun'24",
      lyMonthLabel: "Jun'23",
    },
    {
      dt_ini: "2024-07-01T00:00:00.000Z",
      dt_end: "2024-09-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "49.5",
      ac_vs_ly: "-2.6",
      ly: 52.1,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "down",
      refreshMonthLabel: "Sep'24",
      lyMonthLabel: "Sep'23",
    },
    {
      dt_ini: "2024-10-01T00:00:00.000Z",
      dt_end: "2024-12-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "52.0",
      ac_vs_ly: "0.3",
      ly: 51.8,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Dec'24",
      lyMonthLabel: "Dec'23",
    },
    {
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-03-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "54.3",
      ac_vs_ly: "1.1",
      ly: 53.2,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Mar'25",
      lyMonthLabel: "Mar'24",
    },
    {
      dt_ini: "2025-04-01T00:00:00.000Z",
      dt_end: "2025-06-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "49.6",
      ac_vs_ly: "-1.6",
      ly: 51.2,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "down",
      refreshMonthLabel: "Jun'25",
      lyMonthLabel: "Jun'24",
    },
    {
      dt_ini: "2025-07-01T00:00:00.000Z",
      dt_end: "2025-09-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "50.6",
      ac_vs_ly: "1.1",
      ly: 49.5,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Sep'25",
      lyMonthLabel: "Sep'24",
    },
    {
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-12-01T00:00:00.000Z",
      country_iso_code_3: "BRA",
      category: "Beer",
      ac: "50.9",
      ac_vs_ly: "-0.6",
      ly: 51.5,
      kpi_name: "p4w",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      period: "R12M",
      variationDirectionVsLy: "down",
      refreshMonthLabel: "Dec'25",
      lyMonthLabel: "Dec'24",
    },
  ];

  it("should return array with one card from real data", async () => {
    const result: any = await evaluate(realData);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].chartTitle).toBe("Beer Category Participation");
    expect(result[0].chartPeriod).toBe("Q4'25 - R12M");

    expect(result[0].bigNumberData).toHaveLength(1);
    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-0.6");
    expect(result[0].bigNumberData[0].bigNumber.measure).toBe("pp");
    expect(result[0].bigNumberData[0].bigNumber.trend).toBe("negative");
    expect(result[0].bigNumberData[0].comparison).toEqual({
      label: "vs",
      value: "LY",
    });
    expect(result[0].bigNumberData[0].secondaryInfo.label).toBe("[ % ]");
    expect(result[0].bigNumberData[0].secondaryInfo.value).toBe("50.9");

    expect(result[0].chartLineData).toHaveLength(8);
    expect(result[0].chartLineData).toEqual([
      51.8, 53.2, 51.2, 49.5, 52.0, 54.3, 49.6, 50.6,
    ]);
  });

  it("should return empty array for empty datasource", async () => {
    const result: any = await evaluate([]);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  it("should handle single record (only big number, no sparkline)", async () => {
    const singleRecord = [realData[8]];
    const result: any = await evaluate(singleRecord);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].chartTitle).toBe("Beer Category Participation");
    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-0.6");
    expect(result[0].chartLineData).toEqual([]);
  });

  it("should handle positive values correctly", async () => {
    const positiveData = [
      {
        ...realData[0],
        ac: "58.5",
        ac_vs_ly: "1.2",
        variationDirectionVsLy: "up",
        period: "R12M",
        refreshMonthLabel: "Sep'25",
        dt_end: "2025-09-01T00:00:00.000Z",
      },
    ];
    const result: any = await evaluate(positiveData);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("1.2");
    expect(result[0].bigNumberData[0].bigNumber.trend).toBe("positive");
    expect(result[0].chartPeriod).toBe("Q3'25 - R12M");
  });

  it("should handle negative values correctly", async () => {
    const negativeData = [
      {
        ...realData[0],
        ac: "48.0",
        ac_vs_ly: "-3.5",
        variationDirectionVsLy: "down",
        period: "YTD",
        refreshMonthLabel: "Jun'25",
        dt_end: "2025-06-01T00:00:00.000Z",
      },
    ];
    const result: any = await evaluate(negativeData);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-3.5");
    expect(result[0].bigNumberData[0].bigNumber.trend).toBe("negative");
  });

  it("should handle null ac and ac_vs_ly values gracefully", async () => {
    const dataWithNulls = [
      {
        ...realData[8],
        ac: null,
        ac_vs_ly: null,
        variationDirectionVsLy: "up",
      },
    ];
    const result: any = await evaluate(dataWithNulls);

    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-");
    expect(result[0].bigNumberData[0].secondaryInfo.value).toBe("-");
  });

  it("should sort data by dt_end ascending before processing", async () => {
    const unsortedData = [...realData].reverse();
    const result: any = await evaluate(unsortedData);

    expect(result[0].chartPeriod).toBe("Q4'25 - R12M");
    expect(result[0].bigNumberData[0].bigNumber.value).toBe("-0.6");

    expect(result[0].chartLineData).toEqual([
      51.8, 53.2, 51.2, 49.5, 52.0, 54.3, 49.6, 50.6,
    ]);
  });

  it("should use comparison label 'vs' and value 'LY'", async () => {
    const result: any = await evaluate(realData);

    expect(result[0].bigNumberData[0].comparison.label).toBe("vs");
    expect(result[0].bigNumberData[0].comparison.value).toBe("LY");
  });

  it("should format secondaryInfo label with unit_of_measure", async () => {
    const result: any = await evaluate(realData);

    expect(result[0].bigNumberData[0].secondaryInfo.label).toBe("[ % ]");
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
