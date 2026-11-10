import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_non-working-money";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/non-working-money.jsonata",
);

describe("overview non-working-money formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    dt_ini: string;
    dt_end: string;
    country_iso_code_3: string;
    raw_geography: string;
    raw_brand: string;
    kpi_name: string;
    version_id?: number;
    level_2: string;
    ly: number;
    bu: number;
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

  it("should format non_working_money.total_per_year_full when datasource has data", async () => {
    const rows: Row[] = [
      {
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        raw_geography: "TOTAL_GLOBAL",
        raw_brand: "N/A",
        kpi_name: "media_weight",
        version_id: 22,
        level_2: "non_working_money",
        ly: 19.5,
        bu: 17,
        ac: 17.2,
        ac_vs_ly: -2.3,
        comp_direction: "down",
        variationDirectionVsLy: "down",
        lyMonthLabel: "Dec'24",
        refreshMonthLabel: "Dec'25",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.non_working_money.total_per_year_full).toMatchObject({
      datasets: [
        {
          data: [19.5, 17, 17.2],
          formattedData: [["19.5%"], ["17%"], ["17.2%"]],
          pattern: {
            type: "striped",
            flags: [1],
            params: {
              color: "white",
              angle: 45,
              thickness: 3,
              spacing: 12,
            },
          },
        },
      ],
      comparison_data: {
        comparison: -2.3,
        unit_of_measure: "pp",
        direction: "up",
      },
      chart_legends: ["2024 AC YTD", "2025 BU YTD", "2025 AC/LE YTD"],
      comparison_unit_of_measure: ["pp"],
      labels: ["24 AC", "25 BU", "25 AC"],
      backgroundColor: ["#F0D59E", "#EDCD20", "#D1A33C"],
    });
  });

  it("should return empty flag when datasource has no data", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result).toEqual({ non_working_money: { empty: true } });
  });
});
