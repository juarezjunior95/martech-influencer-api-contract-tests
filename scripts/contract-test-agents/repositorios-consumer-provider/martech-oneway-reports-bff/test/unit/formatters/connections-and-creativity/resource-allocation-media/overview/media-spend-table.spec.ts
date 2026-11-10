import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_media-spend-table";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/media-spend-table.jsonata",
);

describe("overview media-spend-table formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    raw_brand: string;
    country_iso_code_3?: string;
    dt_ini?: string;
    dt_end?: string;
    ly: number | null;
    bu: number;
    ac: number | null;
    ac_vs_ly: number | null;
    ac_vs_bu: number | null;
    variationDirectionVsLy?: string;
    refreshMonthLabel?: string;
    lyMonthLabel?: string;
  };

  const createMockInputWithComponents = (rows: Row[] = []) => ({
    view: "connections-and-creativity_resource-allocation-media_overview_media-spend-table",
    components: [
      {
        id: "media_spend",
        data: {
          datasources: {
            [DS_KEY]: rows,
          },
        },
      },
    ],
  });

  const createMockInputWithDatasources = (rows: Row[] = []) => ({
    datasources: {
      [DS_KEY]: rows,
    },
  });

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should format media_spend from components when datasource has data", async () => {
    const rows: Row[] = [
      {
        raw_brand: "Stella Artois",
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-01-01T00:00:00.000Z",
        ly: 0.0009,
        bu: 8.9892,
        ac: 8.5938,
        ac_vs_ly: 954766.6667,
        ac_vs_bu: -0.4,
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInputWithComponents(rows),
    );

    expect(result.media_spend).toMatchObject({
      header: expect.arrayContaining([{ id: "brands", title: "Brands" }]),
      rows: expect.any(Array),
    });
    expect(result.media_spend.header).toHaveLength(6);
    expect(result.media_spend.rows).toHaveLength(2);
    expect(result.media_spend.rows[0]).toHaveLength(1);
    expect(result.media_spend.rows[0][0]).toMatchObject({
      brands: { value: "Stella Artois" },
      previous_year_AC: { value: 0.0009 },
      current_year_BU: { value: 8.9892 },
      current_year_AC: { value: 8.5938 },
      ly: { value: 954766.6667, variationDirection: "#49764B" },
      bu: {
        tag: {
          value: -0.4,
          color: "#A20A0A",
          backgroundColor: "#FFE6E6",
        },
      },
    });
  });

  it("should map dashes and minimal bu tag when values missing (datasources root)", async () => {
    const dashBrand = await compiledExpression.evaluate(
      createMockInputWithDatasources([
        {
          raw_brand: "",
          ly: 0,
          bu: 0,
          ac: 0,
          ac_vs_ly: null,
          ac_vs_bu: null,
          refreshMonthLabel: "Jan'26",
          lyMonthLabel: "Jan'25",
        },
      ]),
    );
    expect(dashBrand.media_spend.rows[0][0].brands.value).toBe("-");

    const nulls = await compiledExpression.evaluate(
      createMockInputWithDatasources([
        {
          raw_brand: "Corona",
          ly: null,
          bu: 33.3095,
          ac: null,
          ac_vs_ly: null,
          ac_vs_bu: null,
          refreshMonthLabel: "Jan'26",
          lyMonthLabel: "Jan'25",
        },
      ]),
    );
    expect(nulls.media_spend.rows[0][0]).toMatchObject({
      previous_year_AC: { value: "-" },
      current_year_AC: { value: "-" },
      ly: { value: "-" },
      bu: {
        tag: {
          value: "-",
        },
      },
    });
    expect(nulls.media_spend.rows[0][0].ly.variationDirection).toBeUndefined();
    expect(nulls.media_spend.rows[0][0].bu.tag.color).toBeUndefined();
    expect(nulls.media_spend.rows[0][0].bu.tag.backgroundColor).toBeUndefined();
  });

  it("should handle empty datasource", async () => {
    const result = await compiledExpression.evaluate(
      createMockInputWithDatasources([]),
    );

    expect(result.media_spend).toMatchObject({ empty: true });
  });
});
