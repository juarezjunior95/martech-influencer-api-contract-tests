import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/campaigns-qwoa.jsonata",
);

describe("overview campaigns-qwoa formatter", () => {
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
    ac: number;
    ac_vs_ly: number | null;
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

  it("should return total_per_year_full shape, legends and integer percentage formatting", async () => {
    const rows: Row[] = [
      {
        dt_ini: "2024-01-01T00:00:00",
        dt_end: "2025-12-31T00:00:00",
        country_iso_code_3: "USA",
        raw_geography: "United States",
        raw_brand: "Budweiser",
        kpi_name: "campaign_qwoa",
        level_2: "megabrands",
        ly: 8,
        ac: 9,
        ac_vs_ly: 1,
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));
    const block = result.campaigns.total_per_year_full;

    expect(block).toMatchObject({
      chart_legends: ["2024 AC YTD", "2025 AC/LE YTD"],
      labels: ["24 AC", "25 AC"],
      backgroundColor: ["#F0D59E", "#D1A33C"],
      datasets: [
        {
          data: [8, 9],
          formattedData: [["8%"], ["9%"]],
        },
      ],
      comparison_data: expect.anything(),
    });
    expect(block.comparison_data).toBeDefined();
  });

  it("should use 0% formatting and direction down when ly and ac are zero", async () => {
    const rows: Row[] = [
      {
        dt_ini: "2024-01-01T00:00:00",
        dt_end: "2025-12-31T00:00:00",
        country_iso_code_3: "USA",
        raw_geography: "United States",
        raw_brand: "Budweiser",
        kpi_name: "campaign_qwoa",
        level_2: "megabrands",
        ly: 0,
        ac: 0,
        ac_vs_ly: 0,
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));
    const block = result.campaigns.total_per_year_full;

    expect(block).toMatchObject({
      datasets: [{ data: [0, 0], formattedData: [["0%"], ["0%"]] }],
      comparison_data: {
        comparison: 0,
        unit_of_measure: "pp",
        direction: "down",
      },
      chart_legends: ["2024 AC YTD", "2025 AC/LE YTD"],
      labels: ["24 AC", "25 AC"],
    });
  });

  it("should return empty when datasource has no data", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result).toEqual({ campaigns: { empty: true } });
  });
});
