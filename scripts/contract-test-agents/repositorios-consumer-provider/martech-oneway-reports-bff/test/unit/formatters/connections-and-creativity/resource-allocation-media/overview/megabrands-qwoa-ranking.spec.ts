import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_unified-ranking";
const CHART_KEY = "owr_resource-allocation_overview_ranking-chart_megabrands";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/megabrands-qwoa-ranking.jsonata",
);

describe("overview megabrands-qwoa-ranking formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    country_iso_code_3?: string;
    country?: string;
    raw_brand?: string;
    segment?: string;
    global_brands?: string;
    ac: number;
    ac_vs_ly?: number | null;
    ac_vs_bu?: number | null;
    vs_guideline?: number | string | null;
    variationDirectionVsLy?: string;
    level_2?: string;
    ly?: number;
  };

  const createMockInput = (rows: Row[] = []) => ({
    datasources: {
      [DS_KEY]: rows,
    },
  });

  const createMockInputWithComponents = (rows: Row[] = []) => ({
    view: "connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa-ranking",
    components: [
      {
        id: "megabrands_qwoa_ranking",
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

  it("should return megabrands chart structure when datasource has data (country view)", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 100,
        vs_guideline: 2,
        global_brands: "N/A",
        level_2: "qwoa",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.megabrands[CHART_KEY]).toMatchObject({
      datasets: [
        {
          type: "bar",
          label: "Megabrands",
          data: [100],
          backgroundColor: ["#F0D59E"],
          baseChartColor: null,
          formattedData: ["100.0%"],
        },
      ],
      labels: ["Brazil"],
      icons: [""],
      horizontalDashedLine: [],
      variationCaptionData: [],
    });
  });

  it("should resolve country labels from countryMap or fall back to iso code", async () => {
    const mapped = await compiledExpression.evaluate(
      createMockInput([
        {
          country_iso_code_3: "USA",
          country: "United States",
          raw_brand: "N/A",
          segment: "N/A",
          ac: 200,
          vs_guideline: 3,
          global_brands: "N/A",
          level_2: "qwoa",
        },
      ]),
    );
    expect(mapped.megabrands[CHART_KEY].labels).toEqual(["United States"]);
    expect(mapped.megabrands[CHART_KEY].datasets[0].data).toEqual([200]);

    const fallback = await compiledExpression.evaluate(
      createMockInput([
        {
          country_iso_code_3: "XXX",
          country: "XXX",
          raw_brand: "N/A",
          segment: "N/A",
          ac: 0,
          global_brands: "N/A",
          level_2: "qwoa",
        },
      ]),
    );
    expect(fallback.megabrands[CHART_KEY].labels).toEqual(["XXX"]);
  });

  it("should use vs_guideline for variation direction (up when >= 0, down when < 0)", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "BrandA",
        segment: "Megabrands",
        ac: 50,
        vs_guideline: -3,
        global_brands: "N/A",
        level_2: "qwoa",
      },
      {
        country_iso_code_3: "CAN",
        country: "Canada",
        raw_brand: "BrandB",
        segment: "Megabrands",
        ac: 30,
        vs_guideline: 5,
        global_brands: "N/A",
        level_2: "qwoa",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    const caption = result.megabrands[CHART_KEY].variationCaptionData[0];
    const cell0 = Array.isArray(caption.data[0])
      ? caption.data[0][0]
      : caption.data[0];
    const cell1 = Array.isArray(caption.data[1])
      ? caption.data[1][0]
      : caption.data[1];
    expect(cell0).toMatchObject({ value: "-3", color: "#a30a0a" });
    expect(cell1).toMatchObject({ value: "5", color: "#00810d" });
  });

  it("should sort entries by ac descending", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BEL",
        country: "Belgium",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 1,
        global_brands: "N/A",
        level_2: "qwoa",
      },
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 10,
        global_brands: "N/A",
        level_2: "qwoa",
      },
      {
        country_iso_code_3: "CAN",
        country: "Canada",
        raw_brand: "N/A",
        segment: "N/A",
        ac: 5,
        global_brands: "N/A",
        level_2: "qwoa",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.megabrands[CHART_KEY].datasets[0].data.map(Number)).toEqual([
      10, 5, 1,
    ]);
    expect(result.megabrands[CHART_KEY].labels.map(String)).toEqual([
      "Brazil",
      "Canada",
      "Belgium",
    ]);
  });

  it("should clear chart when datasource is empty", async () => {
    const result = await compiledExpression.evaluate(createMockInput([]));

    expect(result.megabrands).toMatchObject({ empty: true });
  });

  it("should filter only level_2 qwoa rows", async () => {
    const rows: Row[] = [
      {
        country_iso_code_3: "BRA",
        country: "Brazil",
        raw_brand: "Corona",
        segment: "Megabrands",
        ac: 52,
        vs_guideline: 7,
        global_brands: "N/A",
        level_2: "other",
      },
    ];
    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.megabrands).toMatchObject({ empty: true });
  });

  it("should transform components datasource to country chart (sorted by ac)", async () => {
    const result = await compiledExpression.evaluate(
      createMockInputWithComponents([
        {
          country_iso_code_3: "CHN",
          country: "China",
          raw_brand: "N/A",
          segment: "N/A",
          global_brands: "N/A",
          ac: 100,
          vs_guideline: 0,
          level_2: "qwoa",
        },
        {
          country_iso_code_3: "MEX",
          country: "Mexico",
          raw_brand: "N/A",
          segment: "N/A",
          global_brands: "N/A",
          ac: 100,
          vs_guideline: 2,
          level_2: "qwoa",
        },
        {
          country_iso_code_3: "USA",
          country: "United States",
          raw_brand: "N/A",
          segment: "N/A",
          global_brands: "N/A",
          ac: 33.3,
          vs_guideline: 1,
          level_2: "qwoa",
        },
      ]),
    );

    const chart = result.megabrands[CHART_KEY];
    expect(chart.datasets[0]).toMatchObject({
      type: "bar",
      label: "Megabrands",
    });
    expect(chart.datasets[0].data.map(Number)).toEqual([100, 100, 33.3]);
    expect(chart.labels.map(String)).toEqual([
      "China",
      "Mexico",
      "United States",
    ]);
    expect(chart.horizontalDashedLine).toEqual([]);
    expect(chart.variationCaptionData).toEqual([]);
  });

  it("should transform brand view with segments (labels, colors, dashed lines, variations)", async () => {
    const result = await compiledExpression.evaluate(
      createMockInputWithComponents([
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Corona",
          segment: "Megabrands",
          global_brands: "N/A",
          level_2: "qwoa",
          ly: 45,
          ac: 52,
          vs_guideline: 7,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Skol",
          segment: "Sustain",
          global_brands: "N/A",
          level_2: "qwoa",
          ac: 52,
          vs_guideline: 17,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Budweiser",
          segment: "Megabrands",
          global_brands: "N/A",
          level_2: "qwoa",
          ac: 52,
          vs_guideline: 7,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Brahma",
          segment: "Megabrands",
          global_brands: "N/A",
          level_2: "qwoa",
          ac: 51,
          vs_guideline: 6,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Spaten",
          segment: "Megabrands",
          global_brands: "N/A",
          level_2: "qwoa",
          ac: 42,
          vs_guideline: -3,
        },
      ]),
    );

    const chart = result.megabrands[CHART_KEY];
    expect(Array.from(chart.labels).map(String)).toEqual([
      "Corona",
      "Budweiser",
      "Brahma",
      "Spaten",
      "Skol",
    ]);
    expect(Array.from(chart.datasets[0].data as unknown[])).toEqual([
      52, 52, 51, 42, 52,
    ]);
    expect(Array.from(chart.datasets[0].baseChartColor as unknown[])).toEqual([
      "#E5B611",
      "#E5B611",
      "#E5B611",
      "#E5B611",
      "#2F74AA",
    ]);
    expect(chart.horizontalDashedLine).toEqual([
      { value: 45, xEnd: 4 },
      { value: 35 },
    ]);
    const caption = chart.variationCaptionData[0];
    const v0 = Array.isArray(caption.data[0])
      ? caption.data[0][0]
      : caption.data[0];
    const v3 = Array.isArray(caption.data[3])
      ? caption.data[3][0]
      : caption.data[3];
    expect(v0).toMatchObject({ value: "7", color: "#00810d" });
    expect(v3).toMatchObject({ value: "-3", color: "#a30a0a" });
  });
});
