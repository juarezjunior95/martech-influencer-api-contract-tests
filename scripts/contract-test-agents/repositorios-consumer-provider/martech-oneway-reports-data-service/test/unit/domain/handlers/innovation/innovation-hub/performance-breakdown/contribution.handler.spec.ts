import { contributionHandler } from "@domain/handlers/innovation/innovation-hub/performance-breakdown/contribution.handler";
import { Dataset } from "@domain/entities/datasource.entity";

const buildSitSampleRows = () => [
  {
    KPI_NAME: "volume",
    COUNTRY_ISO_CODE_3: "ABI",
    DT_END: "2026-07-21",
    UNIT_OF_MEASURE: "k/hl",
    BAR_ORDER: 1,
    LABEL: "FY_YEAR-2",
    PERIOD_LABEL: "'24 FY",
    METRIC_VALUE: 85.2,
    CONTRIBUTION: null,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 2,
    LABEL: "FY_YEAR-1",
    PERIOD_LABEL: "'25 FY",
    METRIC_VALUE: 88.5,
    CONTRIBUTION: null,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 3,
    LABEL: "EXPIRATION",
    PERIOD_LABEL: "Expiration",
    METRIC_VALUE: -3.1,
    CONTRIBUTION: null,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 4,
    LABEL: "BASELINE",
    PERIOD_LABEL: "Baseline",
    METRIC_VALUE: 85.4,
    CONTRIBUTION: null,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 5,
    LABEL: "Y1",
    PERIOD_LABEL: "Y1",
    METRIC_VALUE: 2.4,
    CONTRIBUTION: 2.4,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 6,
    LABEL: "Y2",
    PERIOD_LABEL: "Y2",
    METRIC_VALUE: 1.8,
    CONTRIBUTION: 1.8,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 7,
    LABEL: "Y3",
    PERIOD_LABEL: "Y3",
    METRIC_VALUE: 1.5,
    CONTRIBUTION: 1.5,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 8,
    LABEL: "Y4",
    PERIOD_LABEL: "Y4",
    METRIC_VALUE: 1.2,
    CONTRIBUTION: 1.2,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 9,
    LABEL: "Y5",
    PERIOD_LABEL: "Y5",
    METRIC_VALUE: 0.9,
    CONTRIBUTION: 0.9,
  },
  {
    KPI_NAME: "volume",
    BAR_ORDER: 10,
    LABEL: "LE_YEAR",
    PERIOD_LABEL: "'26 LE",
    METRIC_VALUE: 101.8,
    CONTRIBUTION: 10.2,
  },
];

describe("ContributionHandler", () => {
  it("should map and sort MARTLH-13173-style lake rows by bar_order", async () => {
    const shuffledRows = [
      buildSitSampleRows()[4],
      buildSitSampleRows()[0],
      buildSitSampleRows()[9],
      buildSitSampleRows()[2],
      buildSitSampleRows()[7],
      buildSitSampleRows()[1],
      buildSitSampleRows()[6],
      buildSitSampleRows()[3],
      buildSitSampleRows()[8],
      buildSitSampleRows()[5],
    ];

    const mockDataset: Dataset = {
      id: "contribution",
      data: shuffledRows,
    };

    const result = await contributionHandler.handle([], mockDataset);

    expect(result).toHaveLength(10);
    expect(result.map((row) => row.bar_type)).toEqual([
      "FY_YEAR-2",
      "FY_YEAR-1",
      "EXPIRATION",
      "BASELINE",
      "Y1",
      "Y2",
      "Y3",
      "Y4",
      "Y5",
      "LE_YEAR",
    ]);
    expect(result[0]).toMatchObject({
      bar_order: 1,
      period_label: "'24 FY",
      metric_value: 85.2,
      contribution: undefined,
      kpi: "volume",
      country: "ABI",
      dt_end: "2026-07-21",
      unit_of_measure: "k/hl",
    });
    expect(result[4]).toMatchObject({
      bar_type: "Y1",
      metric_value: 2.4,
      contribution: 2.4,
      contribution_direction: "up",
    });
    expect(result[9]).toMatchObject({
      bar_type: "LE_YEAR",
      metric_value: 101.8,
      contribution: 10.2,
      contribution_direction: "up",
    });
  });

  it("should map KpiEntity-normalized production rows with kpi_name Volume", async () => {
    const mockDataset: Dataset = {
      id: "contribution",
      data: [
        {
          label: "Y1",
          kpi_name: "Volume",
          unit_of_measure: "k hl",
          value: 4681.6,
          contribution: 35.9,
          comp_unit_of_measure: "%",
        },
        {
          label: "'24 FY",
          kpi_name: "Volume",
          unit_of_measure: "k hl",
          value: 57435.5,
          contribution: null,
          comp_unit_of_measure: "%",
        },
      ],
    };

    const result = await contributionHandler.handle([], mockDataset);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      period_label: "'24 FY",
      metric_value: 57435.5,
      kpi: "volume",
    });
    expect(result[1]).toMatchObject({
      period_label: "Y1",
      bar_type: "Y1",
      metric_value: 4681.6,
      contribution: 35.9,
      contribution_direction: "up",
      comp_unit_of_measure: "%",
    });
  });

  it("should return an empty array when dataset is missing", async () => {
    await expect(contributionHandler.handle([], undefined)).resolves.toEqual(
      [],
    );
  });

  it("should return an empty array for unsupported KPI values", async () => {
    const mockDataset: Dataset = {
      id: "contribution",
      data: [
        {
          KPI_NAME: "unsupported_kpi",
          BAR_ORDER: 1,
          LABEL: "FY_YEAR-2",
          METRIC_VALUE: 10,
        },
      ],
    };

    await expect(contributionHandler.handle([], mockDataset)).resolves.toEqual(
      [],
    );
  });

  it("should map negative contribution direction", async () => {
    const mockDataset: Dataset = {
      id: "contribution",
      data: [
        {
          KPI_NAME: "nr",
          BAR_ORDER: 5,
          LABEL: "Y1",
          METRIC_VALUE: -1.2,
          CONTRIBUTION: -1.2,
        },
      ],
    };

    const result = await contributionHandler.handle([], mockDataset);

    expect(result[0]).toMatchObject({
      kpi: "nr",
      contribution: -1.2,
      contribution_direction: "down",
    });
  });
});
