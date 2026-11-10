import { overtimeLineChartHandler } from "@domain/handlers/innovation/innovation-hub/performance-breakdown/overtime-line-chart.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("OvertimeLineChartHandler", () => {
  const buildSampleDataset = (): Dataset => ({
    id: "overtime-line-chart",
    data: [
      {
        KPI_NAME: "maco_margin",
        MONTH: 1,
        COUNTRY_ISO_CODE_3: "ABI",
        AC: 10,
        AC_LY: 8,
        BU: 10.2,
        LE: 10.5,
        AC_VS_LY: 25,
        AC_VS_BU: -2,
        COMP_UNIT_OF_MEASURE: "%",
      },
      {
        KPI_NAME: "maco_margin",
        MONTH: 2,
        COUNTRY_ISO_CODE_3: "ABI",
        AC: 11,
        AC_LY: 9,
        BU: 10.8,
        LE: 11.1,
        AC_VS_LY: 22.2,
        AC_VS_BU: 1.9,
        COMP_UNIT_OF_MEASURE: "%",
      },
      {
        KPI_NAME: "maco_margin",
        MONTH: 5,
        COUNTRY_ISO_CODE_3: "ABI",
        AC: 21,
        AC_LY: 19,
        BU: 18,
        LE: 22,
        AC_VS_LY: 10.5,
        AC_VS_BU: 16.7,
        COMP_UNIT_OF_MEASURE: "%",
      },
    ],
  });

  it("should map lake columns to snake_case rows sorted by month", async () => {
    const result = await overtimeLineChartHandler.handle(
      [],
      buildSampleDataset(),
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      kpi_name: "maco_margin",
      month: 1,
      country: "ABI",
      ac: 10,
      ac_ly: 8,
      bu: 10.2,
      le: 10.5,
      ac_vs_ly: 25,
      ac_vs_bu: -2,
      comp_unit_of_measure: "%",
      variation_direction_vs_ly: "up",
      variation_direction_vs_bu: "down",
    });
    expect(result[1].month).toBe(2);
    expect(result[2].month).toBe(5);
  });

  it("should normalize month names and ignore NaN numeric values", async () => {
    const mockDataset: Dataset = {
      id: "overtime-line-chart",
      data: [
        {
          KPI_NAME: "volume",
          MONTH: "Mar",
          AC: "not-a-number",
          AC_LY: null,
          BU: "",
          AC_VS_LY: "NaN",
          AC_VS_BU: 0,
          COMP_UNIT_OF_MEASURE: "%",
        },
      ],
    };

    const result = await overtimeLineChartHandler.handle([], mockDataset);

    expect(result).toEqual([
      {
        kpi_name: "volume",
        month: 3,
        country: undefined,
        ac: undefined,
        ac_ly: undefined,
        bu: undefined,
        le: undefined,
        ac_vs_ly: undefined,
        ac_vs_bu: 0,
        comp_unit_of_measure: "%",
        variation_direction_vs_bu: "down",
        variation_direction_vs_ly: undefined,
      },
    ]);
  });

  it("should return an empty dataset when input is missing", async () => {
    await expect(
      overtimeLineChartHandler.handle([], undefined),
    ).resolves.toEqual([]);
    await expect(
      overtimeLineChartHandler.handle([], {
        id: "overtime-line-chart",
        data: [],
      }),
    ).resolves.toEqual([]);
  });

  it("should map lake rows when KPI_NAME uses display labels", async () => {
    const mockDataset: Dataset = {
      id: "overtime-line-chart",
      data: [
        {
          KPI_NAME: "Net Revenue",
          MONTH: "Jan",
          COUNTRY_ISO_CODE_3: "ABI",
          AC: 455.7,
          AC_LY: 329.8,
          BU: 434.7,
          LE: 6915.6,
          AC_VS_LY: 38.1,
          AC_VS_BU: 4.8,
          COMP_UNIT_OF_MEASURE: "%",
        },
      ],
    };

    const result = await overtimeLineChartHandler.handle([], mockDataset);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      kpi_name: "Net Revenue",
      month: 1,
      country: "ABI",
      ac: 455.7,
      ac_ly: 329.8,
      bu: 434.7,
      le: 6915.6,
      ac_vs_ly: 38.1,
      ac_vs_bu: 4.8,
      comp_unit_of_measure: "%",
    });
  });

  it("should return an empty dataset when rows contain invalid KPI names", async () => {
    const mockDataset: Dataset = {
      id: "overtime-line-chart",
      data: [
        {
          KPI_NAME: "invalid_kpi",
          MONTH: 1,
          AC: 10,
        },
      ],
    };

    const result = await overtimeLineChartHandler.handle([], mockDataset);

    expect(result).toEqual([]);
  });

  it("should return an empty dataset when month values are invalid", async () => {
    const mockDataset: Dataset = {
      id: "overtime-line-chart",
      data: [
        {
          KPI_NAME: "volume",
          MONTH: "invalid-month",
          AC: 10,
        },
      ],
    };

    const result = await overtimeLineChartHandler.handle([], mockDataset);

    expect(result).toEqual([]);
  });
});
