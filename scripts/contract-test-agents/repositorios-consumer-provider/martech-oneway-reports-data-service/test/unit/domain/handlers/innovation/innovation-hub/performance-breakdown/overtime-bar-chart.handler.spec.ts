import { overtimeBarChartHandler } from "@domain/handlers/innovation/innovation-hub/performance-breakdown/overtime-bar-chart.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("OvertimeBarChartHandler", () => {
  const buildSampleDataset = (): Dataset => ({
    id: "overtime-bar-chart",
    data: [
      {
        BAR_ORDER: 4,
        KPI_NAME: "volume",
        COUNTRY_ISO_CODE_3: "ABI",
        PERIOD_LABEL: "'26 LE",
        METRIC_VALUE: 22,
        VS_BU: 7.3,
        VS_LY: 12.8,
        COMP_UNIT_OF_MEASURE: "%",
      },
      {
        BAR_ORDER: 1,
        KPI_NAME: "volume",
        COUNTRY_ISO_CODE_3: "ABI",
        PERIOD_LABEL: "'24",
        METRIC_VALUE: 18,
        VS_BU: null,
        VS_LY: null,
        COMP_UNIT_OF_MEASURE: "%",
      },
      {
        BAR_ORDER: 3,
        KPI_NAME: "volume",
        COUNTRY_ISO_CODE_3: "ABI",
        PERIOD_LABEL: "'26 BU",
        METRIC_VALUE: 20.5,
        VS_BU: null,
        VS_LY: 5.1,
        COMP_UNIT_OF_MEASURE: "%",
      },
      {
        BAR_ORDER: 2,
        KPI_NAME: "volume",
        COUNTRY_ISO_CODE_3: "ABI",
        PERIOD_LABEL: "'25",
        METRIC_VALUE: 19.5,
        VS_BU: null,
        VS_LY: 8.3,
        COMP_UNIT_OF_MEASURE: "%",
      },
    ],
  });

  it("should map lake columns and sort rows by bar_order", async () => {
    const result = await overtimeBarChartHandler.handle(
      [],
      buildSampleDataset(),
    );

    expect(result).toHaveLength(4);
    expect(result.map((row) => row.period_label)).toEqual([
      "'24",
      "'25",
      "'26 BU",
      "'26 LE",
    ]);
    expect(result[3]).toMatchObject({
      bar_order: 4,
      metric_value: 22,
      vs_bu: 7.3,
      vs_ly: 12.8,
      comp_unit_of_measure: "%",
      variation_direction_vs_bu: "up",
      variation_direction_vs_ly: "up",
    });
  });

  it("should ignore NaN metric and comparison values", async () => {
    const mockDataset: Dataset = {
      id: "overtime-bar-chart",
      data: [
        {
          BAR_ORDER: 1,
          KPI_NAME: "maco",
          PERIOD_LABEL: "'24",
          METRIC_VALUE: "NaN",
          VS_BU: "invalid",
          VS_LY: "",
          COMP_UNIT_OF_MEASURE: "pp",
        },
      ],
    };

    const result = await overtimeBarChartHandler.handle([], mockDataset);

    expect(result).toEqual([
      {
        kpi_name: "maco",
        bar_order: 1,
        period_label: "'24",
        country: undefined,
        metric_value: undefined,
        vs_bu: undefined,
        vs_ly: undefined,
        comp_unit_of_measure: "pp",
        variation_direction_vs_bu: undefined,
        variation_direction_vs_ly: undefined,
      },
    ]);
  });

  it("should return an empty dataset when input is missing", async () => {
    await expect(
      overtimeBarChartHandler.handle([], undefined),
    ).resolves.toEqual([]);
    await expect(
      overtimeBarChartHandler.handle([], {
        id: "overtime-bar-chart",
        data: [],
      }),
    ).resolves.toEqual([]);
  });

  it("should map lake rows when KPI_NAME uses display labels", async () => {
    const mockDataset: Dataset = {
      id: "overtime-bar-chart",
      data: [
        {
          BAR_ORDER: 1,
          KPI_NAME: "Net Revenue",
          PERIOD_LABEL: "'24",
          METRIC_VALUE: 18,
          COMP_UNIT_OF_MEASURE: "%",
        },
      ],
    };

    const result = await overtimeBarChartHandler.handle([], mockDataset);

    expect(result).toEqual([
      {
        kpi_name: "Net Revenue",
        bar_order: 1,
        period_label: "'24",
        country: undefined,
        metric_value: 18,
        vs_bu: undefined,
        vs_ly: undefined,
        comp_unit_of_measure: "%",
        variation_direction_vs_bu: undefined,
        variation_direction_vs_ly: undefined,
      },
    ]);
  });

  it("should return an empty dataset when rows contain invalid KPI names", async () => {
    const mockDataset: Dataset = {
      id: "overtime-bar-chart",
      data: [
        {
          BAR_ORDER: 1,
          KPI_NAME: "invalid_kpi",
          PERIOD_LABEL: "'24",
          METRIC_VALUE: 18,
        },
      ],
    };

    const result = await overtimeBarChartHandler.handle([], mockDataset);

    expect(result).toEqual([]);
  });
});
