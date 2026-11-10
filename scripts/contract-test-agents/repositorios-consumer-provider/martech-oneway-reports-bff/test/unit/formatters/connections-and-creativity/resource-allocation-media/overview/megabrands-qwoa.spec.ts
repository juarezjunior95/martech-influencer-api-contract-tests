import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/megabrands-qwoa.jsonata",
);

describe("overview megabrands-qwoa formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    dt_ini: string;
    dt_end: string;
    country_iso_code_3: string;
    raw_geography?: string;
    raw_brand?: string;
    kpi_name?: string;
    version_id?: number;
    level_2: string;
    ly: number;
    ac: number;
    ac_vs_ly: number | null;
    comp_direction?: string;
    variationDirectionVsLy?: string;
    lyMonthLabel?: string;
    refreshMonthLabel?: string;
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

  it("should return mega_brands.total_per_year_full when datasource has data", async () => {
    const rows: Row[] = [
      {
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        raw_geography: "N/A",
        raw_brand: "N/A",
        kpi_name: "media",
        version_id: 22,
        level_2: "qwoa",
        ly: 64.3,
        ac: 66.7,
        ac_vs_ly: 2.4,
        comp_direction: "down",
        lyMonthLabel: "Dec'24",
        refreshMonthLabel: "Dec'25",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.mega_brands.total_per_year_full).toMatchObject({
      datasets: [
        {
          data: [64.3, 66.7],
          formattedData: [["64.3%"], ["66.7%"]],
          pattern: null,
        },
      ],
      comparison_data: {
        comparison: 2.4,
        unit_of_measure: "pp",
        direction: "up",
      },
      chart_legends: ["2024 AC YTD", "2025 AC/LE YTD"],
      comparison_unit_of_measure: ["pp"],
      labels: ["24 AC", "25 LE"],
      backgroundColor: ["#F0D59E", "#D1A33C"],
    });
  });

  it("should set direction based on ac_vs_ly numeric value", async () => {
    const rows: Row[] = [
      {
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        level_2: "qwoa",
        ly: 50,
        ac: 55,
        ac_vs_ly: 5,
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.mega_brands.total_per_year_full.comparison_data).toEqual({
      comparison: 5,
      unit_of_measure: "pp",
      direction: "up",
    });
  });

  it("should handle empty datasource with empty flag", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result).toEqual({ mega_brands: { empty: true } });
  });
});
