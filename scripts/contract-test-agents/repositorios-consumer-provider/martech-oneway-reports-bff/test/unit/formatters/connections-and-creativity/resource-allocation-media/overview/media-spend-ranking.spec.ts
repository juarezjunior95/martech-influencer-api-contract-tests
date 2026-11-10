import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_unified-ranking";
const CHART_KEY = "owr_resource-allocation_overview_ranking-chart_media-spend";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/media-spend-ranking.jsonata",
);

describe("overview media-spend-ranking formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    country_iso_code_3: string;
    country?: string;
    raw_brand?: string;
    ac: number;
    ac_vs_bu: number | null;
    vs_guideline?: number | string | null;
    global_brands?: string;
    segment?: string;
    comp_direction?: string;
    level_2?: string;
  };

  const createMockInput = (rows: Row[] = []) => ({
    datasources: {
      [DS_KEY]: rows,
    },
  });

  const createMockInputWithComponents = (rows: Row[] = []) => ({
    view: "connections-and-creativity_resource-allocation-media_overview_media-spend-ranking",
    components: [
      {
        id: "media_spend_ranking",
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

  it("should return media_spend chart structure when datasource has data", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "N/A",
        ac: 100,
        ac_vs_bu: 5,
        vs_guideline: 2,
        segment: "N/A",
        global_brands: "N/A",
        comp_direction: "up",
        level_2: "media",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.media_spend[CHART_KEY]).toMatchObject({
      datasets: [
        {
          type: "bar",
          label: "Media Spend",
          data: [100],
          backgroundColor: ["#F0D59E"],
        },
      ],
      labels: ["Brazil"],
    });
    const caption = result.media_spend[CHART_KEY].variationCaptionData[0];
    expect(caption).toMatchObject({
      title: "BU",
      subtitle: "vs AC [ YTD ]",
      label: " ",
    });
    const cell = Array.isArray(caption.data[0])
      ? caption.data[0][0]
      : caption.data[0];
    expect(cell).toEqual({
      value: "5",
      unit_of_measure: "",
      color: "#00810d",
    });
  });

  it("should resolve country labels from countryMap or fall back to iso code", async () => {
    const mapped = await compiledExpression.evaluate(
      createMockInput([
        {
          country_iso_code_3: "USA",
          country: "United States",
          raw_brand: "N/A",
          ac: 200,
          ac_vs_bu: 3,
          vs_guideline: 1,
          global_brands: "N/A",
          level_2: "media",
        },
      ]),
    );
    expect(mapped.media_spend[CHART_KEY].labels).toEqual(["United States"]);
    expect(mapped.media_spend[CHART_KEY].datasets[0].data).toEqual([200]);

    const fallback = await compiledExpression.evaluate(
      createMockInput([
        {
          country_iso_code_3: "XXX",
          country: "XXX",
          raw_brand: "N/A",
          ac: 0,
          ac_vs_bu: null,
          level_2: "media",
        },
      ]),
    );
    expect(fallback.media_spend[CHART_KEY].labels).toEqual(["XXX"]);
  });

  it("should set direction to down when ac_vs_bu is zero or negative", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "N/A",
        ac: 50,
        ac_vs_bu: 0,
        level_2: "media",
      },
      {
        country_iso_code_3: "CAN",
        country: "Canada",
        raw_brand: "N/A",
        ac: 30,
        ac_vs_bu: -1,
        level_2: "media",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    const caption = result.media_spend[CHART_KEY].variationCaptionData[0];
    expect(caption.data[0][0].color).toBe("#a30a0a");
    expect(caption.data[1][0].color).toBe("#a30a0a");
  });

  it("should sort entries by ac descending", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BEL",
        country: "Belgium",
        raw_brand: "N/A",
        ac: 1,
        ac_vs_bu: 0,
        level_2: "media",
      },
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "N/A",
        ac: 10,
        ac_vs_bu: 0,
        level_2: "media",
      },
      {
        country_iso_code_3: "CAN",
        country: "Canada",
        raw_brand: "N/A",
        ac: 5,
        ac_vs_bu: 0,
        level_2: "media",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.media_spend[CHART_KEY].datasets[0].data.map(Number)).toEqual([
      10, 5, 1,
    ]);
    expect(result.media_spend[CHART_KEY].labels.map(String)).toEqual([
      "Brazil",
      "Canada",
      "Belgium",
    ]);
  });

  it("should accept input with components[0].data.datasources", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "GBR",
        country: "United Kingdom",
        raw_brand: "N/A",
        ac: 0.8083,
        ac_vs_bu: 0,
        global_brands: "N/A",
        level_2: "media",
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInputWithComponents(rows),
    );

    expect(result.media_spend[CHART_KEY]).toMatchObject({
      labels: ["United Kingdom"],
      datasets: [{ data: [0.8083] }],
    });
  });

  it("should handle empty datasource", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result.media_spend).toEqual({ empty: true });
  });
});
