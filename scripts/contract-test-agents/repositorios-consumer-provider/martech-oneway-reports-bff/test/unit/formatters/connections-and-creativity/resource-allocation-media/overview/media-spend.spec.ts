import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_media-spend";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/media-spend.jsonata",
);

describe("overview media-spend formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    dt_ini: string;
    dt_end: string;
    country_iso_code_3: string;
    raw_geography: string;
    raw_brand: string;
    kpi_name: string;
    version_id?: string;
    level_2: string;
    ly: number;
    bu: number;
    ac: number;
    ac_vs_ly: number | null;
    comp_direction?: string;
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

  it("should format total_per_year_full from dt_end year, data, and comparison", async () => {
    const rows: Row[] = [
      {
        dt_ini: "2024-01-01T00:00:00",
        dt_end: "2025-12-31T00:00:00",
        country_iso_code_3: "USA",
        raw_geography: "United States",
        raw_brand: "Budweiser",
        kpi_name: "media_spend",
        level_2: "megabrands",
        ly: 1000,
        bu: 950,
        ac: 1020,
        ac_vs_ly: 2,
        comp_direction: "down",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.media_spend.total_per_year_full).toMatchObject({
      datasets: [
        {
          data: [1000, 950, 1020],
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
        comparison: 2,
        unit_of_measure: "%",
        direction: "up",
      },
      chart_legends: ["2024 AC YTD", "2025 BU YTD", "2025 AC/LE YTD"],
      labels: ["24 AC", "25 BU", "25 AC"],
      backgroundColor: ["#F0D59E", "#EDCD20", "#D1A33C"],
    });
  });

  it("should handle empty datasource", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result).toEqual({ media_spend: { empty: true } });
  });
});
