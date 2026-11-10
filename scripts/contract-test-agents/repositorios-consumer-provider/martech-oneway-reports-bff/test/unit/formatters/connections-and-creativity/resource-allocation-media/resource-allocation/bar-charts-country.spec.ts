import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_resource-allocation_bar-charts-country";
const BASE_COUNTRY_FLAG =
  "https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2025-03/";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/resource-allocation/bar-charts-country.jsonata",
);

describe("bar-charts-country formatter", () => {
  let compiledExpression: jsonata.Expression;

  /** Chart data is double-nested: result.media.media, result.non_working_money.non_working_money, etc. */
  const getChart = (result: any, key: string) => result[key]?.[key];

  type DsRow = {
    country_iso_code_3: string;
    kpi_name: string;
    level_2: string;
    ac_0: number;
    ac: number | null;
    comp_value?: number;
    refreshMonthLabel?: string;
  };

  const createMockInput = (rows: DsRow[] = []) => ({
    datasources: {
      [DS_KEY]: rows,
    },
  });

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return all chart sections and set media labels from distinct country_iso_code_3", async () => {
    const rows: DsRow[] = [
      {
        country_iso_code_3: "BRA",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 50,
        ac: 60,
      },
      {
        country_iso_code_3: "USA",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 100,
        ac: 110,
      },
      {
        country_iso_code_3: "BRA",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 20,
        ac: 22,
      },
      {
        country_iso_code_3: "USA",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 30,
        ac: 32,
      },
      {
        country_iso_code_3: "BRA",
        kpi_name: "media_weight",
        level_2: "non_working_money",
        ac_0: 10,
        ac: 11,
      },
      {
        country_iso_code_3: "BRA",
        kpi_name: "media_weight",
        level_2: "sponsorship_activation",
        ac_0: 5,
        ac: 6,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result).toMatchObject({
      media: expect.anything(),
      non_working_money: expect.anything(),
      sponsorship_activation: expect.anything(),
    });
    const mediaChart = getChart(result, "media");
    const labels = Array.isArray(mediaChart.labels)
      ? mediaChart.labels
      : [mediaChart.labels];
    expect(labels).toHaveLength(2);
    expect(labels).toEqual(expect.arrayContaining(["BRA", "USA"]));
    expect(mediaChart).toMatchObject({
      type: "bar",
      labels_type: "raw_brand",
      comparison_unit_of_measure: "%",
      formatted_data: true,
    });
  });

  it("should build total_allocation from media/tt_mkt rows using formatValue and prefix $", async () => {
    const rows: DsRow[] = [
      {
        country_iso_code_3: "MEX",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 80,
        ac: 90,
      },
      {
        country_iso_code_3: "MEX",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 25,
        ac: 26,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const mediaChart = getChart(result, "media");
    const value = mediaChart.total_allocation.value;
    const normalized =
      Array.isArray(value) && value.length > 0 && !Array.isArray(value[0])
        ? [value as [string, string]]
        : Array.isArray(value)
          ? value
          : [value];

    expect(normalized[0]).toEqual(["$80.0", "$90.0"]);
  });

  it("should verify total allocation results format according expected patterns", async () => {
    const rows: DsRow[] = [
      {
        country_iso_code_3: "USA",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 999,
        comp_value: 1_500.4,
        ac: 2000.56,
      },
      {
        country_iso_code_3: "MEX",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        comp_value: 1,
        ac: 0,
      },
      {
        country_iso_code_3: "BRA",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 50,
        ac: null,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const value = getChart(result, "media").total_allocation.value as [
      string,
      string,
    ][];

    expect(value[0]).toEqual(["$1,500.4", "$2,000.6"]);
    expect(value[1]).toEqual(["$1.0", "$0.0"]);
    expect(value[2]).toEqual(["$50.0", "-"]);
  });

  it("should build caption_country_flag with flag URL, labels, and CHN/ARG lookups", async () => {
    type DsRowWithCountry = DsRow & {
      raw_brand?: string;
      country?: { imageIcon: string };
    };
    const rows: DsRowWithCountry[] = [
      {
        country_iso_code_3: "USA",
        raw_brand: "USA",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "USA.png" },
      },
      {
        country_iso_code_3: "USA",
        raw_brand: "USA",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "USA.png" },
      },
      {
        country_iso_code_3: "CHN",
        raw_brand: "CHN",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "bu_china.png" },
      },
      {
        country_iso_code_3: "ARG",
        raw_brand: "ARG",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "bu_rdlp.png" },
      },
      {
        country_iso_code_3: "CHN",
        raw_brand: "CHN",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "bu_china.png" },
      },
      {
        country_iso_code_3: "ARG",
        raw_brand: "ARG",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "bu_rdlp.png" },
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const caption = getChart(result, "media").caption_country_flag;

    expect(caption).toMatchObject({
      USA: {
        flag: BASE_COUNTRY_FLAG + "USA.png",
        label: "USA",
      },
      CHN: { flag: BASE_COUNTRY_FLAG + "bu_china.png" },
      ARG: { flag: BASE_COUNTRY_FLAG + "bu_rdlp.png" },
    });
  });

  it("should build datasets with type bar, data, label and formattedData for each level2", async () => {
    const rows: DsRow[] = [
      {
        country_iso_code_3: "GBR",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 200,
        ac: 220,
      },
      {
        country_iso_code_3: "GBR",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 40,
        ac: 42,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const mediaChart = getChart(result, "media");
    const datasets = Array.isArray(mediaChart.datasets)
      ? mediaChart.datasets
      : [mediaChart.datasets];
    expect(datasets).toHaveLength(1);
    expect(datasets[0]).toMatchObject({
      type: "bar",
      data: ["40.0", "42.0"],
      label: "media",
      formattedData: ["40.0%", "42.0%"],
    });
  });

  it("should set refreshDate from refreshMonthLabel or default to empty", async () => {
    const rowsWithLabel: DsRow[] = [
      {
        country_iso_code_3: "CAN",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
        refreshMonthLabel: "Mar'26",
      },
      {
        country_iso_code_3: "CAN",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
      },
    ];

    const resultWithLabel = await compiledExpression.evaluate(
      createMockInput(rowsWithLabel),
    );
    expect(getChart(resultWithLabel, "media").refreshDate).toMatchObject({
      month: "Mar'26",
      quarter: "Q1'26",
    });

    const rowsDefault: DsRow[] = [
      {
        country_iso_code_3: "CAN",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
      },
      {
        country_iso_code_3: "CAN",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
      },
    ];
    const resultDefault = await compiledExpression.evaluate(
      createMockInput(rowsDefault),
    );
    expect(getChart(resultDefault, "media").refreshDate).toMatchObject({
      month: "",
      quarter: "",
    });
  });

  it("should handle empty or missing datasource", async () => {
    const assertEmptyMedia = (result: any) => {
      const mediaChart = getChart(result, "media");
      const labels = mediaChart.labels ?? [];
      expect(Array.isArray(labels) ? labels : [labels]).toEqual([]);
      const datasets = mediaChart.datasets ?? [];
      expect(Array.isArray(datasets) ? datasets : [datasets]).toEqual([]);
      const totalValue = mediaChart.total_allocation?.value ?? [];
      expect(Array.isArray(totalValue) ? totalValue : [totalValue]).toEqual([]);
      expect(mediaChart.caption_country_flag ?? {}).toEqual({});
    };

    const emptyResult = await compiledExpression.evaluate(createMockInput([]));
    expect(emptyResult).toBeDefined();
    expect(emptyResult.media).toBeDefined();
    assertEmptyMedia(emptyResult);

    const missingResult = await compiledExpression.evaluate({
      datasources: {},
    });
    expect(missingResult).toBeDefined();
    expect(missingResult.media).toBeDefined();
    assertEmptyMedia(missingResult);
  });
});
