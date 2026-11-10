import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_non-working-money-table";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/non-working-money-table.jsonata",
);

describe("overview non-working-money-table formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    country_iso_code_3: string;
    raw_geography: string;
    country: string;
    raw_brand?: string;
    dt_ini?: string;
    dt_end?: string;
    ly: number;
    bu: number;
    ac: number;
    ac_vs_ly: number | null;
    ac_vs_bu: number | null;
    vs_guideline: number | null;
    variationDirectionVsLy?: string;
    lyMonthLabel?: string;
    refreshMonthLabel?: string;
  };

  const createMockInput = (rows: Row[] = []) => ({
    components: [
      {
        data: {
          datasources: { [DS_KEY]: rows },
        },
      },
    ],
  });

  const createMockInputLegacy = (rows: Row[] = []) => ({
    datasources: {
      [DS_KEY]: rows,
    },
  });

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should format header and rows with cell mapping and direction styling", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "USA",
        raw_geography: "US",
        raw_brand: "N/A",
        country: "United States",
        ly: 50,
        bu: 48,
        ac: 52,
        ac_vs_ly: 4,
        ac_vs_bu: 8.3,
        vs_guideline: -1.7,
        variationDirectionVsLy: "up",
        lyMonthLabel: "Dec'25",
        refreshMonthLabel: "Dec'26",
      },
      {
        country_iso_code_3: "MEX",
        raw_geography: "MEXICO",
        raw_brand: "N/A",
        country: "Mexico",
        ly: 90,
        bu: 80,
        ac: 46.7,
        ac_vs_ly: -43.3,
        ac_vs_bu: -0.7,
        vs_guideline: -4.9,
        variationDirectionVsLy: "down",
        lyMonthLabel: "Dec'25",
        refreshMonthLabel: "Dec'26",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));
    const { resource_allocation: ra } = result;

    expect(ra).toMatchObject({
      header: [
        { id: "countries", title: "Countries" },
        { id: "previous_year_AC", title: "25 AC" },
        { id: "current_year_BU", title: "26 BU" },
        { id: "current_year_AC", title: "26 AC" },
        { id: "ly", title: "vs LY" },
        { id: "bu", title: "vs BU" },
        { id: "guideline", title: "vs Guideline" },
      ],
      rows: expect.any(Array),
    });
    expect(ra.rows).toHaveLength(2);
    expect(ra.rows[0]).toHaveLength(2);
    expect(ra.rows[1]).toEqual([]);

    expect(ra.rows[0][0]).toMatchObject({
      countries: { value: "United States" },
      previous_year_AC: { value: 50, unitMeasure: "%" },
      current_year_BU: { value: 48, unitMeasure: "%" },
      current_year_AC: { value: 52, unitMeasure: "%" },
      ly: {
        value: 4,
        unitMeasure: "pp",
        variationDirection: "#A20A0A",
      },
      bu: {
        value: 8.3,
        unitMeasure: "pp",
        variationDirection: "#A20A0A",
      },
      guideline: {
        tag: {
          value: "-1.7pp",
          color: "#49764B",
          backgroundColor: "#E6F9E6",
        },
      },
    });

    expect(ra.rows[0][1]).toMatchObject({
      ly: {
        variationDirection: "#49764B",
        value: -43.3,
      },
      guideline: {
        tag: {
          color: "#49764B",
          backgroundColor: "#E6F9E6",
        },
      },
    });
  });

  it("should use raw_geography for country when not in countryMap", async () => {
    const result = await compiledExpression.evaluate(
      createMockInput([
        {
          country_iso_code_3: "XXX",
          raw_geography: "Unknown Region",
          raw_brand: "N/A",
          country: "Unknown Region",
          ly: 0,
          bu: 0,
          ac: 0,
          ac_vs_ly: null,
          ac_vs_bu: null,
          vs_guideline: null,
          lyMonthLabel: "Dec'25",
          refreshMonthLabel: "Dec'26",
        },
      ]),
    );

    expect(result.resource_allocation.rows[0][0].countries).toEqual({
      value: "XXX",
    });
  });

  it("should accept input via top-level datasources", async () => {
    const result = await compiledExpression.evaluate(
      createMockInputLegacy([
        {
          country_iso_code_3: "CAN",
          raw_geography: "CANADA",
          raw_brand: "N/A",
          country: "Canada",
          ly: 61.1,
          bu: 60,
          ac: 77.3,
          ac_vs_ly: 16.2,
          ac_vs_bu: -0.4,
          vs_guideline: 0.3,
          variationDirectionVsLy: "up",
          lyMonthLabel: "Dec'25",
          refreshMonthLabel: "Dec'26",
        },
      ]),
    );

    expect(result.resource_allocation).toMatchObject({
      rows: [[expect.any(Object)], []],
    });
    expect(result.resource_allocation.rows[0][0]).toMatchObject({
      countries: { value: "Canada" },
      previous_year_AC: { value: 61.1 },
      current_year_AC: { value: 77.3 },
    });
  });

  it("should handle empty datasource", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result.resource_allocation).toMatchObject({ empty: true });
  });
});
