import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_resource-allocation_bar-charts-global";
const BASE_COUNTRY_FLAG =
  "https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2025-03/";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/resource-allocation/bar-charts-global.jsonata",
);

describe("bar-charts-global formatter", () => {
  let compiledExpression: jsonata.Expression;

  type DsRow = {
    country_iso_code_3: string;
    kpi_name: string;
    level_2: string;
    ac_0?: number;
    ac?: number;
    comp_value_0?: number;
    refreshMonthLabel?: string;
    country?: { imageIcon: string };
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

  it("should return all chart sections and set media labels with labels_type country_iso_code_3", async () => {
    const rows: DsRow[] = [
      {
        country_iso_code_3: "ABI",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 500,
        ac: 550,
      },
      {
        country_iso_code_3: "ABI",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 35,
        ac: 36,
        refreshMonthLabel: "Dec'25",
      },
      {
        country_iso_code_3: "ABI",
        kpi_name: "media_weight",
        level_2: "non_working_money",
        ac_0: 12,
        ac: 13,
      },
      {
        country_iso_code_3: "ABI",
        kpi_name: "media_weight",
        level_2: "sponsorship_activation",
        ac_0: 8,
        ac: 9,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result).toMatchObject({
      media: { media: expect.anything() },
      non_working_money: { non_working_money: expect.anything() },
      sponsorship_activation: {
        sponsorship_activation: expect.anything(),
      },
    });
    expect(result.media.media).toMatchObject({
      labels_type: "country_iso_code_3",
      labels: ["ABI"],
      type: "bar",
      comparison_unit_of_measure: "%",
      formatted_data: true,
    });
  });

  it("should build total_allocation from media/tt_mkt rows with value and prefix $", async () => {
    const rows: DsRow[] = [
      {
        country_iso_code_3: "BRA",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 200,
        ac: 230,
      },
      {
        country_iso_code_3: "BRA",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 28,
        ac: 30,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const value = result.media.media.total_allocation.value;
    const normalized =
      Array.isArray(value) && value.length > 0 && !Array.isArray(value[0])
        ? [value as [string, string]]
        : Array.isArray(value)
          ? value
          : [value];

    expect(normalized[0]).toEqual(["$230.0", "$230.0"]);
  });

  it("should build caption_country_flag with flag URL, labels, and CHN/ARG lookups", async () => {
    const rows: DsRow[] = [
      {
        country_iso_code_3: "ABI",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "ABI.png" },
      },
      {
        country_iso_code_3: "ABI",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
      },
      {
        country_iso_code_3: "CHN",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "bu_china.png" },
      },
      {
        country_iso_code_3: "ARG",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
        country: { imageIcon: BASE_COUNTRY_FLAG + "bu_rdlp.png" },
      },
      {
        country_iso_code_3: "CHN",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
      },
      {
        country_iso_code_3: "ARG",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const caption = result.media.media.caption_country_flag;

    expect(caption).toMatchObject({
      ABI: {
        flag: BASE_COUNTRY_FLAG + "ABI.png",
        label: "ABI",
      },
      CHN: { flag: BASE_COUNTRY_FLAG + "bu_china.png" },
      ARG: { flag: BASE_COUNTRY_FLAG + "bu_rdlp.png" },
    });
  });

  it("should build datasets with type bar, data, label and formattedData for each level2", async () => {
    const rows: DsRow[] = [
      {
        country_iso_code_3: "MEX",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 150,
        ac: 165,
      },
      {
        country_iso_code_3: "MEX",
        kpi_name: "media_weight",
        level_2: "non_working_money",
        comp_value_0: 15,
        ac_0: 15,
        ac: 16,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const chart = result.non_working_money.non_working_money;
    const datasets = Array.isArray(chart.datasets)
      ? chart.datasets
      : [chart.datasets];
    expect(datasets).toHaveLength(1);
    expect(datasets[0]).toMatchObject({
      type: "bar",
      data: ["15.0", "16.0"],
      label: "non_working_money",
      formattedData: ["15.0%", "16.0%"],
    });
  });

  it("should set refreshDate from refreshMonthLabel or default to empty", async () => {
    const rowsWithLabel: DsRow[] = [
      {
        country_iso_code_3: "KOR",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
        refreshMonthLabel: "Jun'25",
      },
      {
        country_iso_code_3: "KOR",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
      },
    ];

    const resultWithLabel = await compiledExpression.evaluate(
      createMockInput(rowsWithLabel),
    );
    expect(resultWithLabel.media.media.refreshDate).toMatchObject({
      month: "Jun'25",
      quarter: "Q2'25",
    });

    const rowsDefault: DsRow[] = [
      {
        country_iso_code_3: "KOR",
        kpi_name: "media",
        level_2: "tt_mkt",
        ac_0: 1,
        ac: 1,
      },
      {
        country_iso_code_3: "KOR",
        kpi_name: "media_weight",
        level_2: "media",
        ac_0: 1,
        ac: 1,
      },
    ];
    const resultDefault = await compiledExpression.evaluate(
      createMockInput(rowsDefault),
    );
    expect(resultDefault.media.media.refreshDate).toMatchObject({
      month: "",
      quarter: "",
    });
  });

  it("should handle empty or missing datasource", async () => {
    const assertEmptyMedia = (result: any) => {
      const chart = result.media.media;
      const labels = chart.labels ?? [];
      expect(Array.isArray(labels) ? labels : [labels]).toEqual([]);
      const datasets = chart.datasets ?? [];
      expect(Array.isArray(datasets) ? datasets : [datasets]).toEqual([]);
      const totalValue = chart.total_allocation?.value ?? [];
      expect(Array.isArray(totalValue) ? totalValue : [totalValue]).toEqual([]);
      expect(chart.caption_country_flag ?? {}).toEqual({});
    };

    const emptyResult = await compiledExpression.evaluate(createMockInput([]));
    expect(emptyResult).toBeDefined();
    expect(emptyResult.media.media).toBeDefined();
    assertEmptyMedia(emptyResult);

    const missingResult = await compiledExpression.evaluate({
      datasources: {},
    });
    expect(missingResult).toBeDefined();
    expect(missingResult.media.media).toBeDefined();
    assertEmptyMedia(missingResult);
  });
});
