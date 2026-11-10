import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_unified-ranking";
const CHART_KEY = "owr_resource-allocation_overview_ranking-chart_campaigns";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/campaigns-qwoa-ranking.jsonata",
);

describe("overview campaigns-ranking formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    country_iso_code_3: string;
    country?: string;
    raw_brand?: string;
    segment?: string;
    ac: number;
    ac_vs_ly?: number;
    global_brands?: string;
  };

  const createMockInput = (rows: Row[] = []) => ({
    datasources: {
      [DS_KEY]: rows,
    },
  });

  const createMockInputWithComponents = (rows: Row[] = []) => ({
    view: "connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa-ranking",
    components: [
      {
        id: "campaigns_qwoa_ranking",
        data: {
          datasources: {
            [DS_KEY]: rows,
          },
        },
      },
    ],
  });

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return bar chart with formatted data when datasource has data", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 100,
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.campaigns[CHART_KEY]).toMatchObject({
      datasets: [
        {
          type: "bar",
          label: "Campaigns",
          data: [100],
          backgroundColor: ["#F0D59E"],
          formattedData: ["100.0%"],
        },
      ],
      labels: ["Brazil"],
    });
  });

  it("should map country labels from countryMap or fall back to iso code", async () => {
    const cases: Array<{ row: Row; expectedLabel: string }> = [
      {
        row: {
          country_iso_code_3: "USA",
          country: "United States",
          raw_brand: "N/A",
          segment: "N/A",
          ac: 50,
        },
        expectedLabel: "United States",
      },
      {
        row: {
          country_iso_code_3: "XXX",
          country: "XXX",
          raw_brand: "N/A",
          segment: "N/A",
          ac: 0,
        },
        expectedLabel: "XXX",
      },
    ];

    for (const { row, expectedLabel } of cases) {
      const result = await compiledExpression.evaluate(createMockInput([row]));
      expect(result.campaigns[CHART_KEY].labels).toEqual([expectedLabel]);
    }
  });

  it("should use raw_brand as label when not N/A (brand view)", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "Spaten",
        segment: "Megabrands",
        ac: 25,
      },
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "Budweiser",
        segment: "Expansion",
        ac: 20,
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));
    const chart = result.campaigns[CHART_KEY];

    expect(Array.from(chart.labels)).toEqual(["Spaten", "Budweiser"]);
    expect(Array.from(chart.datasets[0].data as unknown[])).toEqual([25, 20]);
  });

  it("should sort entries by ac descending with aligned labels", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BEL",
        country: "Belgium",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 1,
      },
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 10,
      },
      {
        country_iso_code_3: "CAN",
        country: "Canada",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 5,
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));
    const chart = result.campaigns[CHART_KEY];

    expect(Array.from(chart.datasets[0].data as unknown[])).toEqual([10, 5, 1]);
    expect(Array.from(chart.labels)).toEqual(["Brazil", "Canada", "Belgium"]);
  });

  it("should accept input with components[0].data.datasources", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "GBR",
        country: "United Kingdom",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0.5,
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInputWithComponents(rows),
    );

    expect(result.campaigns[CHART_KEY]).toMatchObject({
      labels: ["United Kingdom"],
      datasets: [
        {
          data: [0.5],
          formattedData: ["0.5%"],
        },
      ],
    });
  });

  it("should handle empty datasource", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result.campaigns).toMatchObject({ empty: true });
  });

  it("should map many countries via components input with uniform baseChartColor", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "USA",
        country: "United States",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0,
      },
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0,
      },
      {
        country_iso_code_3: "CHN",
        country: "China",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0,
      },
      {
        country_iso_code_3: "MEX",
        country: "Mexico",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0,
      },
      {
        country_iso_code_3: "CAN",
        country: "Canada",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0,
      },
      {
        country_iso_code_3: "ARG",
        country: "Argentina",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0,
      },
      {
        country_iso_code_3: "ZAF",
        country: "South Africa",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0,
      },
      {
        country_iso_code_3: "COL",
        country: "Colombia",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 0,
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInputWithComponents(rows),
    );
    const chart = result.campaigns[CHART_KEY];
    const ds = chart.datasets[0];

    expect(ds).toMatchObject({
      type: "bar",
      label: "Campaigns",
      backgroundColor: ["#F0D59E"],
    });
    expect(Array.from(chart.labels)).toEqual([
      "United States",
      "Brazil",
      "China",
      "Mexico",
      "Canada",
      "Argentina",
      "South Africa",
      "Colombia",
    ]);
    const data = Array.from(ds.data as unknown[]);
    expect(data).toHaveLength(8);
    expect(data.every((v) => Number(v) === 0)).toBe(true);
    const formattedData = Array.from(ds.formattedData as unknown[]);
    expect(formattedData).toHaveLength(8);
    expect(formattedData.every((v) => String(v) === "0.0%")).toBe(true);
    expect(ds.baseChartColor).toBeNull();
  });
});
