import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa-table";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/campaigns-qwoa-table.jsonata",
);

describe("overview campaigns-qwoa-table formatter", () => {
  let compiledExpression: jsonata.Expression;

  const makeRow = (overrides: Record<string, unknown> = {}) => ({
    dt_ini: "2026-01-01T00:00:00.000Z",
    dt_end: "2026-12-01T00:00:00.000Z",
    country_iso_code_3: "USA",
    raw_geography: "United States",
    country: "United States",
    raw_brand: "N/A",
    segment: "N/A",
    kpi_name: "media",
    version_id: 21,
    level_2: "campaign_qwoa",
    ly: 31.8,
    ac: 26.7,
    ac_vs_ly: -5.1,
    vs_ly_label_suffix: "YTD",
    variationDirectionAc: "up",
    variationDirectionVsLy: "down",
    refreshMonthLabel: "Dec'26",
    lyMonthLabel: "Dec'25",
    ...overrides,
  });

  const wrapInput = (rows: Record<string, unknown>[]) => ({
    datasources: { [DS_KEY]: rows },
  });

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should build header, row groups and cell mapping from datasource data", async () => {
    const rows = [
      makeRow({
        raw_geography: "United States",
        ly: 31.8,
        ac: 26.7,
        ac_vs_ly: -5.1,
        variationDirectionVsLy: "down",
      }),
      makeRow({
        raw_geography: "China",
        country_iso_code_3: "CHN",
        country: "China",
        ly: 37.5,
        ac: 66.7,
        ac_vs_ly: 29.2,
        variationDirectionVsLy: "up",
      }),
    ];
    const result = await compiledExpression.evaluate(wrapInput(rows));

    expect(result.campaigns).toMatchObject({
      header: [
        { id: "countries", title: "Countries" },
        { id: "previous_year_AC", title: "25 AC" },
        { id: "current_year_AC", title: "26 AC" },
        { id: "ly", title: "vs LY" },
      ],
      rows: [
        expect.arrayContaining([
          expect.objectContaining({
            countries: { value: "United States" },
            previous_year_AC: { value: 31.8, unitMeasure: "%" },
            current_year_AC: { value: 26.7, unitMeasure: "%" },
            ly: {
              value: -5.1,
              unitMeasure: "pp",
              variationDirection: "#A20A0A",
            },
          }),
          expect.objectContaining({
            countries: { value: "China" },
            ly: {
              value: 29.2,
              unitMeasure: "pp",
              variationDirection: "#49764B",
            },
          }),
        ]),
        [],
      ],
    });
    expect(result.campaigns.rows[0]).toHaveLength(2);
  });

  it("should show dash with no variationDirection when values are null", async () => {
    const result = await compiledExpression.evaluate(
      wrapInput([
        makeRow({
          ly: null,
          ac_vs_ly: null,
          variationDirectionVsLy: undefined,
        }),
      ]),
    );

    expect(result.campaigns.rows[0][0]).toMatchObject({
      previous_year_AC: { value: "-", unitMeasure: "" },
      ly: { value: "-", unitMeasure: "" },
    });
    expect(result.campaigns.rows[0][0].ly.variationDirection).toBeUndefined();
  });

  it("should return empty state when datasource has no data", async () => {
    const result = await compiledExpression.evaluate(wrapInput([]));

    expect(result.campaigns).toMatchObject({ empty: true });
  });
});
