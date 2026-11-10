import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_overview_unified-ranking";
const CHART_KEY = "owr_resource-allocation_overview_ranking-chart_nwm";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/overview/non-working-money-ranking.jsonata",
);

describe("overview non-working-money-ranking formatter", () => {
  let compiledExpression: jsonata.Expression;

  type Row = {
    country_iso_code_3: string;
    country?: string;
    raw_brand?: string;
    level_2?: string;
    ac: number;
    ac_vs_bu: number | null;
    vs_guideline?: number | string | null;
    global_brands?: string;
    segment?: string;
    comp_direction?: string;
  };

  const createMockInput = (rows: Row[] = []) => ({
    datasources: {
      [DS_KEY]: rows,
    },
  });

  const createMockInputWithComponents = (rows: Row[] = []) => ({
    view: "connections-and-creativity_resource-allocation-media_overview_non-working-money-ranking",
    components: [
      {
        id: "non_working_money_ranking",
        data: {
          datasources: {
            [DS_KEY]: rows,
          },
        },
      },
    ],
  });

  const COUNTRY_BY_ISO: Record<string, string> = {
    BRA: "Brazil",
    USA: "United States",
    CAN: "Canada",
    GBR: "United Kingdom",
    BEL: "Belgium",
    MEX: "Mexico",
    CHN: "China",
    PER: "Peru",
    COL: "Colombia",
    XXX: "XXX",
    KOR: "South Korea",
  };

  const nwmRow = (overrides: Partial<Row> = {}): Row => {
    const merged: Row = {
      country_iso_code_3: "BRA",
      raw_brand: "N/A",
      level_2: "non_working_money",
      ac: 100,
      ac_vs_bu: 5,
      vs_guideline: 2,
      segment: "N/A",
      global_brands: "N/A",
      comp_direction: "up",
      ...overrides,
    };
    const iso = merged.country_iso_code_3;
    return {
      ...merged,
      country: COUNTRY_BY_ISO[iso] ?? iso,
    };
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return resource_allocation chart when datasource has non_working_money data", async () => {
    const result = await compiledExpression.evaluate(
      createMockInput([nwmRow()]),
    );
    const chart = result.resource_allocation[CHART_KEY];

    expect(result.resource_allocation).toMatchObject({
      [CHART_KEY]: expect.any(Object),
    });
    expect(chart.datasets[0]).toMatchObject({
      type: "bar",
      label: "Non Working Money",
      data: [100],
      backgroundColor: ["#F0D59E"],
      baseChartColor: null,
      formattedData: ["100.0%"],
    });
    expect(chart.labels).toEqual(["Brazil"]);
    expect(chart.icons).toEqual([""]);
    expect(chart.variationCaptionData).toHaveLength(2);
    expect(chart.variationCaptionData[0]).toMatchObject({
      title: "Guideline",
      subtitle: "vs AC [ YTD ]",
      label: " ",
    });
    expect(chart.variationCaptionData[1]).toMatchObject({
      title: "BU",
    });
    const g0 = Array.isArray(chart.variationCaptionData[0].data[0])
      ? chart.variationCaptionData[0].data[0][0]
      : chart.variationCaptionData[0].data[0];
    expect(g0).toMatchObject({
      value: "2",
      unit_of_measure: "pp",
      color: "#a30a0a",
    });
    const b0 = Array.isArray(chart.variationCaptionData[1].data[0])
      ? chart.variationCaptionData[1].data[0][0]
      : chart.variationCaptionData[1].data[0];
    expect(b0).toMatchObject({
      value: "5",
      color: "#a30a0a",
    });
    expect(chart.horizontalDashedLine).toEqual([
      { value: 17, unitMeasure: "%" },
    ]);
  });

  it("should filter only level_2 non_working_money from datasource", async () => {
    const result = await compiledExpression.evaluate(
      createMockInput([
        nwmRow({ country_iso_code_3: "COL", ac: 31.58 }),
        nwmRow({
          level_2: "media_spend",
          country_iso_code_3: "KOR",
          ac: 99,
        }),
        nwmRow({ country_iso_code_3: "PER", ac: 27.15 }),
      ]),
    );
    const chart = result.resource_allocation[CHART_KEY];

    expect(chart.datasets[0].data).toHaveLength(2);
    expect(chart.labels).toEqual(expect.arrayContaining(["Peru", "Colombia"]));
    expect(chart.labels).not.toContain("South Korea");
  });

  it("should set icon to world when global_brands is Global Brand", async () => {
    const result = await compiledExpression.evaluate(
      createMockInput([
        nwmRow({ global_brands: "Global Brand", country_iso_code_3: "GBR" }),
      ]),
    );
    const chart = result.resource_allocation[CHART_KEY];

    expect(chart).toMatchObject({
      icons: ["world"],
      datasets: [expect.objectContaining({ baseChartColor: null })],
    });
  });

  it("should set direction to up when variation is negative", async () => {
    const result = await compiledExpression.evaluate(
      createMockInput([nwmRow({ ac_vs_bu: -5, vs_guideline: -10 })]),
    );
    const chart = result.resource_allocation[CHART_KEY];

    const gCell = Array.isArray(chart.variationCaptionData[0].data[0])
      ? chart.variationCaptionData[0].data[0][0]
      : chart.variationCaptionData[0].data[0];
    expect(gCell.color).toBe("#00810d");
    const bCell = Array.isArray(chart.variationCaptionData[1].data[0])
      ? chart.variationCaptionData[1].data[0][0]
      : chart.variationCaptionData[1].data[0];
    expect(bCell.color).toBe("#00810d");
  });

  it("should include all non_working_money rows with ac values and country labels", async () => {
    const result = await compiledExpression.evaluate(
      createMockInput([
        nwmRow({ country_iso_code_3: "BEL", ac: 50 }),
        nwmRow({ country_iso_code_3: "BRA", ac: 10 }),
        nwmRow({ country_iso_code_3: "CAN", ac: 30 }),
      ]),
    );
    const chart = result.resource_allocation[CHART_KEY];

    expect(chart.datasets[0].data).toHaveLength(3);
    expect(chart.datasets[0].data).toEqual(
      expect.arrayContaining([50, 30, 10]),
    );
    expect(chart.labels).toHaveLength(3);
    expect(chart.labels).toEqual(
      expect.arrayContaining(["Belgium", "Canada", "Brazil"]),
    );
  });

  it("should accept input with components[0].data.datasources", async () => {
    const result = await compiledExpression.evaluate(
      createMockInputWithComponents([
        nwmRow({ country_iso_code_3: "GBR", ac: 12.25 }),
      ]),
    );
    const chart = result.resource_allocation[CHART_KEY];

    expect(chart).toMatchObject({
      labels: ["United Kingdom"],
      datasets: [expect.objectContaining({ data: [12.25] })],
    });
  });

  it("should return empty chart when datasource is empty or has no non_working_money rows", async () => {
    const empty = await compiledExpression.evaluate(createMockInput([]));
    expect(empty.resource_allocation).toMatchObject({ empty: true });

    const noNwm = await compiledExpression.evaluate(
      createMockInput([
        nwmRow({
          level_2: "media_spend",
          country_iso_code_3: "BRA",
          ac: 100,
        }),
      ]),
    );
    expect(noNwm.resource_allocation).toMatchObject({ empty: true });
  });

  it("should transform brand view with segment order Sustain, Megabrands (middle), Expansion, Megabrands (ends)", async () => {
    const result = await compiledExpression.evaluate(
      createMockInputWithComponents([
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Stella Artois",
          segment: "Expansion",
          global_brands: "Global Brand",
          level_2: "non_working_money",
          ac: 30.807,
          ac_vs_bu: 19,
          vs_guideline: 15.8,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Skol",
          segment: "Sustain",
          global_brands: "Brand",
          level_2: "non_working_money",
          ac: 21.8354,
          ac_vs_bu: -3.4,
          vs_guideline: 1.8,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Corona",
          segment: "Megabrands",
          global_brands: "Global Brand",
          level_2: "non_working_money",
          ac: 15.988,
          ac_vs_bu: 16,
          vs_guideline: 1,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Spaten",
          segment: "Megabrands",
          global_brands: "Brand",
          level_2: "non_working_money",
          ac: 8.5547,
          ac_vs_bu: -3.4,
          vs_guideline: -11.4,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Brahma",
          segment: "Megabrands",
          global_brands: "Brand",
          level_2: "non_working_money",
          ac: 7.0983,
          ac_vs_bu: -1.3,
          vs_guideline: -12.9,
        },
        {
          country_iso_code_3: "BRA",
          country: "Brazil",
          raw_brand: "Budweiser",
          segment: "Megabrands",
          global_brands: "Global Brand",
          level_2: "non_working_money",
          ac: 1.3905,
          ac_vs_bu: -13.5,
          vs_guideline: -13.6,
        },
      ]),
    );
    const chart = result.resource_allocation[CHART_KEY];

    expect(result.resource_allocation).toBeDefined();
    expect(Array.from(chart.labels)).toEqual([
      "Skol",
      "Spaten",
      "Brahma",
      "Stella Artois",
      "Corona",
      "Budweiser",
    ]);
    expect(Array.from(chart.datasets[0].data)).toEqual([
      21.8354, 8.5547, 7.0983, 30.807, 15.988, 1.3905,
    ]);
    expect(Array.from(chart.datasets[0].formattedData)).toEqual([
      "21.8%",
      "8.6%",
      "7.1%",
      "30.8%",
      "16.0%",
      "1.4%",
    ]);
    expect(Array.from(chart.icons)).toEqual([
      "",
      "",
      "",
      "world",
      "world",
      "world",
    ]);
    expect(chart.variationCaptionData[0].title).toBe("Guideline");
    const gv0 = Array.isArray(chart.variationCaptionData[0].data[0])
      ? chart.variationCaptionData[0].data[0][0]
      : chart.variationCaptionData[0].data[0];
    expect(gv0).toMatchObject({ value: "1.8", color: "#a30a0a" });
    const bv1 = Array.isArray(chart.variationCaptionData[1].data[1])
      ? chart.variationCaptionData[1].data[1][0]
      : chart.variationCaptionData[1].data[1];
    expect(bv1).toMatchObject({ value: "-3.4", color: "#00810d" });
    const lines = Array.from(chart.horizontalDashedLine);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({ value: 17, unitMeasure: "%", xEnd: 3 });
    expect(lines[1]).toMatchObject({ value: 17, unitMeasure: "%" });
  });
});
