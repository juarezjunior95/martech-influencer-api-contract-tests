import { performanceHandler } from "@domain/handlers/innovation/innovation/performance-breakdown/performance.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("PerformanceHandler", () => {
  it("should process dataset data correctly with all fields", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "innovation-performance",
      data: [
        {
          KPI_NAME: "innovation_volume",
          DT_INI: "2023-01-01T00:00:00.000Z",
          DT_END: "2023-12-01T00:00:00.000Z",
          COUNTRY_ISO_CODE_3: "BRA",
          VALUE: 12500.5,
          TOOLTIP: 15.3,
          CONTRIBUTION: 8.7,
          LABEL: "FY_2023",
        },
      ],
    };

    // Act
    const result = await performanceHandler.handle([mockDataset]);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "innovation-performance",
      data: [
        {
          kpi_name: "innovation_volume",
          dt_ini: "2023-01-01T00:00:00.000Z",
          dt_end: "2023-12-01T00:00:00.000Z",
          country: "BRA",
          label: "FY_2023",
          value: 12500.5,
          tooltip: 15.3,
          tooltip_direction: "up",
          contribution: 8.7,
          contribution_direction: "up",
          contribution_measure: "%",
        },
      ],
    });
  });

  it("should handle innovation_volume KPI_NAME with correct contribution_measure", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "innovation-performance",
      data: [
        {
          KPI_NAME: "innovation_volume",
          DT_INI: "2024-01-01T00:00:00.000Z",
          DT_END: "2024-12-01T00:00:00.000Z",
          COUNTRY_ISO_CODE_3: "USA",
          VALUE: 8500.2,
          TOOLTIP: 12.5,
          CONTRIBUTION: 5.2,
          LABEL: "FY_2024",
        },
      ],
    };

    // Act
    const result = await performanceHandler.handle([mockDataset]);

    // Assert
    expect(result[0].data[0].contribution_measure).toBe("%");
    expect(result[0].data[0].kpi_name).toBe("innovation_volume");
  });

  it("should handle innovation_nr KPI_NAME with correct contribution_measure", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "innovation-performance",
      data: [
        {
          KPI_NAME: "innovation_nr",
          DT_INI: "2024-01-01T00:00:00.000Z",
          DT_END: "2024-12-01T00:00:00.000Z",
          COUNTRY_ISO_CODE_3: "GBR",
          VALUE: 3200.8,
          TOOLTIP: -8.3,
          CONTRIBUTION: -3.1,
          LABEL: "FY_2024",
        },
      ],
    };

    // Act
    const result = await performanceHandler.handle([mockDataset]);

    // Assert
    expect(result[0].data[0].contribution_measure).toBe("%");
    expect(result[0].data[0].kpi_name).toBe("innovation_nr");
  });

  it("should handle innovation_maco KPI_NAME with correct contribution_measure", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "innovation-performance",
      data: [
        {
          KPI_NAME: "innovation_maco",
          DT_INI: "2024-01-01T00:00:00.000Z",
          DT_END: "2024-12-01T00:00:00.000Z",
          COUNTRY_ISO_CODE_3: "FRA",
          VALUE: 2100.4,
          TOOLTIP: 22.1,
          CONTRIBUTION: 18.9,
          LABEL: "FY_2024",
        },
      ],
    };

    // Act
    const result = await performanceHandler.handle([mockDataset]);

    // Assert
    expect(result[0].data[0].contribution_measure).toBe("%");
    expect(result[0].data[0].kpi_name).toBe("innovation_maco");
  });

  it("should handle unknown KPI_NAME with empty contribution_measure", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "innovation-performance",
      data: [
        {
          KPI_NAME: "unknown_kpi",
          DT_INI: "2024-01-01T00:00:00.000Z",
          DT_END: "2024-12-01T00:00:00.000Z",
          COUNTRY_ISO_CODE_3: "BRA",
          VALUE: 1000.0,
          TOOLTIP: 5.0,
          CONTRIBUTION: 2.0,
          LABEL: "FY_2024",
        },
      ],
    };

    // Act
    const result = await performanceHandler.handle([mockDataset]);

    // Assert
    expect(result[0].data[0].contribution_measure).toBe("");
  });

  it("should handle tooltip direction correctly when tooltip is zero with positiveZero option", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "innovation-performance",
      data: [
        {
          KPI_NAME: "innovation_volume",
          DT_INI: "2024-01-01T00:00:00.000Z",
          DT_END: "2024-12-01T00:00:00.000Z",
          COUNTRY_ISO_CODE_3: "BRA",
          VALUE: 5000.0,
          TOOLTIP: 0,
          CONTRIBUTION: 0,
          LABEL: "FY_2024",
        },
      ],
    };

    // Act
    const result = await performanceHandler.handle([mockDataset]);

    // Assert
    expect(result[0].data[0].tooltip_direction).toBe("up");
    expect(result[0].data[0].contribution_direction).toBe("up");
  });

  it("should process multiple datasets correctly", async () => {
    // Arrange
    const mockDatasets: Dataset[] = [
      {
        id: "innovation-performance",
        data: [
          {
            KPI_NAME: "innovation_volume",
            DT_INI: "2023-01-01T00:00:00.000Z",
            DT_END: "2023-12-01T00:00:00.000Z",
            COUNTRY_ISO_CODE_3: "BRA",
            VALUE: 15472.3,
            TOOLTIP: null,
            CONTRIBUTION: null,
            LABEL: "FY_2023",
          },
          {
            KPI_NAME: "innovation_volume",
            DT_INI: "2024-01-01T00:00:00.000Z",
            DT_END: "2024-12-01T00:00:00.000Z",
            COUNTRY_ISO_CODE_3: "BRA",
            VALUE: 15171.2,
            TOOLTIP: null,
            CONTRIBUTION: null,
            LABEL: "FY_2024",
          },
          {
            KPI_NAME: "innovation_volume",
            DT_INI: "2025-01-01T00:00:00.000Z",
            DT_END: "2025-09-01T00:00:00.000Z",
            COUNTRY_ISO_CODE_3: "BRA",
            VALUE: 13196.7,
            TOOLTIP: -13,
            CONTRIBUTION: null,
            LABEL: "LE_2025",
          },
        ],
      },
      {
        id: "innovation-performance-contribution",
        data: [
          {
            KPI_NAME: "innovation_volume",
            DT_INI: "2025-01-01T00:00:00.000Z",
            DT_END: "2025-09-01T00:00:00.000Z",
            COUNTRY_ISO_CODE_3: "BRA",
            LABEL: "LAUNCHES",
            VALUE: null,
            TOOLTIP: null,
            CONTRIBUTION: 2.6,
          },
          {
            KPI_NAME: "innovation_volume",
            DT_INI: "2025-01-01T00:00:00.000Z",
            DT_END: "2025-09-01T00:00:00.000Z",
            COUNTRY_ISO_CODE_3: "BRA",
            LABEL: "Y1-Y2",
            VALUE: null,
            TOOLTIP: null,
            CONTRIBUTION: 11.9,
          },
          {
            KPI_NAME: "innovation_nr",
            DT_INI: "2025-01-01T00:00:00.000Z",
            DT_END: "2025-09-01T00:00:00.000Z",
            COUNTRY_ISO_CODE_3: "BRA",
            LABEL: "Y2-Y3",
            VALUE: null,
            TOOLTIP: 0,
            CONTRIBUTION: 0,
          },
          {
            KPI_NAME: "innovation_maco",
            DT_INI: "2025-01-01T00:00:00.000Z",
            DT_END: "2025-09-01T00:00:00.000Z",
            COUNTRY_ISO_CODE_3: "BRA",
            LABEL: "Y3-Y4",
            VALUE: null,
            TOOLTIP: null,
            CONTRIBUTION: 28.8,
          },
        ],
      },
    ];

    // Act
    const result = await performanceHandler.handle(mockDatasets);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("innovation-performance");
    expect(result[0].data).toHaveLength(3);
    expect(result[1].id).toBe("innovation-performance-contribution");
    expect(result[1].data).toHaveLength(4);

    // Check first dataset
    expect(result[0].data[0].kpi_name).toBe("innovation_volume");
    expect(result[0].data[0].label).toBe("FY_2023");
    expect(result[0].data[0].value).toBe(15472.3);
    expect(result[0].data[2].tooltip_direction).toBe("down");
    expect(result[0].data[2].label).toBe("LE_2025");

    // Check second dataset
    expect(result[1].data[0].kpi_name).toBe("innovation_volume");
    expect(result[1].data[0].label).toBe("LAUNCHES");
    expect(result[1].data[0].contribution).toBe(2.6);
    expect(result[1].data[0].contribution_direction).toBe("up");
    expect(result[1].data[0].contribution_measure).toBe("%");

    expect(result[1].data[2].kpi_name).toBe("innovation_nr");
    expect(result[1].data[2].tooltip_direction).toBe("up");
    expect(result[1].data[2].contribution_direction).toBe("up");
    expect(result[1].data[2].contribution_measure).toBe("%");

    expect(result[1].data[3].kpi_name).toBe("innovation_maco");
    expect(result[1].data[3].contribution).toBe(28.8);
    expect(result[1].data[3].contribution_direction).toBe("up");
    expect(result[1].data[3].contribution_measure).toBe("%");
  });

  it("should handle empty dataset data array", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "innovation-performance",
      data: [],
    };

    // Act
    const result = await performanceHandler.handle([mockDataset]);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].data).toHaveLength(0);
    expect(result[0].data).toEqual([]);
  });

  it("should handle empty datasets array", async () => {
    // Arrange
    const mockDatasets: Dataset[] = [];

    // Act
    const result = await performanceHandler.handle(mockDatasets);

    // Assert
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
