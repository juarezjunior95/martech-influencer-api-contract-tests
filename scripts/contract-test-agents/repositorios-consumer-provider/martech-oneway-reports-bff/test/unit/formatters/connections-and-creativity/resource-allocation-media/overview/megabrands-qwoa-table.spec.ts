import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa-media-qwoa-table";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/megabrands-qwoa-table.jsonata",
);

describe("overview megabrands-qwoa-media-qwoa-table formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    raw_geography?: string;
    country: string;
    raw_brand?: string;
    ly: number;
    ac: number;
    ac_vs_ly: number | null;
    vs_guideline?: number | string | null;
    variationDirectionVsLy?: string;
    lyMonthLabel?: string;
    refreshMonthLabel?: string;
    dt_ini?: string;
    dt_end?: string;
    country_iso_code_3?: string;
  };

  const createMockInput = (rows: Row[] = []) => ({
    datasources: {
      [DS_KEY]: rows,
    },
  });

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return header, row cells, and ly variation direction colors", async () => {
    const rows: Row[] = [
      {
        raw_geography: "Brazil",
        raw_brand: "N/A",
        country: "Brazil",
        country_iso_code_3: "BRA",
        ly: 80,
        ac: 60,
        ac_vs_ly: -20,
        vs_guideline: -5,
        variationDirectionVsLy: "down",
        lyMonthLabel: "Dec'25",
        refreshMonthLabel: "Dec'26",
      },
      {
        raw_geography: "Canada",
        raw_brand: "N/A",
        country: "Canada",
        country_iso_code_3: "CAN",
        ly: 50,
        ac: 100,
        ac_vs_ly: 50,
        vs_guideline: 10,
        variationDirectionVsLy: "up",
        lyMonthLabel: "Dec'25",
        refreshMonthLabel: "Dec'26",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.megabrands).toMatchObject({
      header: [
        { id: "countries", title: "Countries" },
        { id: "previous_year_AC", title: "25 AC" },
        { id: "current_year_LE", title: "26 LE" },
        { id: "ly", title: "vs LY" },
        { id: "vs_guideline", title: "vs Guideline" },
      ],
      rows: [[expect.any(Object), expect.any(Object)], []],
    });
    expect(result.megabrands.rows[0][0]).toMatchObject({
      countries: { value: "Brazil" },
      previous_year_AC: { value: "80", unitMeasure: "" },
      current_year_LE: { value: "60", unitMeasure: "" },
      ly: {
        value: "-20.0",
        unitMeasure: "",
        variationDirection: "#A20A0A",
      },
      vs_guideline: {
        tag: { value: -5, color: "#A20A0A", backgroundColor: "#FFE6E6" },
      },
    });
    expect(result.megabrands.rows[0][1]).toMatchObject({
      countries: { value: "Canada" },
      ly: {
        value: "50.0",
        unitMeasure: "",
        variationDirection: "#49764B",
      },
      vs_guideline: {
        tag: { value: 10, color: "#49764B", backgroundColor: "#E6F9E6" },
      },
    });
  });

  it("should map fractional ly and ac values and format ly cell", async () => {
    const rows: Row[] = [
      {
        raw_geography: "United States",
        raw_brand: "N/A",
        country: "United States",
        country_iso_code_3: "USA",
        ly: 33.3,
        ac: 0,
        ac_vs_ly: -33.3,
        variationDirectionVsLy: "down",
        lyMonthLabel: "Dec'25",
        refreshMonthLabel: "Dec'26",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.megabrands.rows[0][0]).toMatchObject({
      countries: { value: "United States" },
      previous_year_AC: { value: "33", unitMeasure: "" },
      current_year_LE: { value: "0", unitMeasure: "" },
      ly: {
        value: "-33.3",
        unitMeasure: "",
        variationDirection: "#A20A0A",
      },
    });
  });

  it("should accept input via components[0].data.datasources", async () => {
    const rows: Row[] = [
      {
        raw_geography: "Mexico",
        raw_brand: "N/A",
        country: "Mexico",
        country_iso_code_3: "MEX",
        ly: 100,
        ac: 33.3,
        ac_vs_ly: -66.7,
        variationDirectionVsLy: "down",
        lyMonthLabel: "Dec'25",
        refreshMonthLabel: "Dec'26",
      },
    ];
    const mockInput = {
      components: [
        {
          data: {
            datasources: { [DS_KEY]: rows },
          },
        },
      ],
    };
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.megabrands.rows[0][0]).toMatchObject({
      countries: { value: "Mexico" },
      previous_year_AC: { value: "100", unitMeasure: "" },
      current_year_LE: { value: "33", unitMeasure: "" },
    });
  });

  it("should handle empty datasource", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result.megabrands).toMatchObject({ empty: true });
  });
});
