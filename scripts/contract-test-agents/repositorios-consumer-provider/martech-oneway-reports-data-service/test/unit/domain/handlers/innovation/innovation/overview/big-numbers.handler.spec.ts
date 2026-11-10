import { bigNumbersHandler } from "@domain/handlers/innovation/innovation/overview/big-numbers.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("BigNumbersHandler", () => {
  it("should process dataset data correctly with all fields", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "test-dataset",
      data: [
        {
          COUNTRY_ISO_CODE_3: "USA",
          DT_INI: "2023-01-01",
          DT_END: "2023-12-31",
          KPI_NAME: "innovation_nr",
          AC: 1000.5,
          LY: 950.3,
          LE: 1000.5,
          AC_VS_LY: 5.2,
          LE_VS_LY: 3.1,
        },
      ],
    };

    // Act
    const result = await bigNumbersHandler.handle([], mockDataset);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      COUNTRY_ISO_CODE_3: "USA",
      DT_INI: "2023-01-01",
      DT_END: "2023-12-31",
      KPI_NAME: "innovation_nr",
      AC: 1000.5,
      LY: 950.3,
      LE: 1000.5,
      AC_VS_LY: 5.2,
      LE_VS_LY: 3.1,
      country: undefined,
      comp_ac_vs_ly_direction: undefined,
      comp_le_vs_ly_direction: undefined,
      measure: null,
      secondary_measure: null,
    });
  });

  it("should handle positive variations correctly", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "test-dataset",
      data: [
        {
          COUNTRY_ISO_CODE_3: "BRA",
          DT_INI: "2023-07-01",
          DT_END: "2023-09-30",
          KPI_NAME: "innovation_volume",
          AC: 500.8,
          LY: 480.2,
          LE: 1000.5,
          AC_VS_LY: 10.5,
          LE_VS_LY: 8.3,
        },
      ],
    };

    // Act
    const result = await bigNumbersHandler.handle([], mockDataset);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].comp_ac_vs_ly_direction).toBe(undefined);
    expect(result[0].comp_le_vs_ly_direction).toBe(undefined);
  });

  it("should handle negative variations correctly", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "test-dataset",
      data: [
        {
          COUNTRY_ISO_CODE_3: "GBR",
          DT_INI: "2023-04-01",
          DT_END: "2023-06-30",
          KPI_NAME: "innovation_volume_mix",
          AC: 300.2,
          LY: 320.5,
          AC_VS_LY: -2.5,
          LE_VS_LY: -1.8,
        },
      ],
    };

    // Act
    const result = await bigNumbersHandler.handle([], mockDataset);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].comp_ac_vs_ly_direction).toBe(undefined);
    expect(result[0].comp_le_vs_ly_direction).toBe(undefined);
  });

  it("should handle zero variations correctly with positiveZero option", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "test-dataset",
      data: [
        {
          COUNTRY_ISO_CODE_3: "FRA",
          DT_INI: "2023-01-01",
          DT_END: "2023-03-31",
          KPI_NAME: "innovation_nr",
          AC: 200.0,
          LY: 200.0,
          LE: 1000.5,
          AC_VS_LY: 0,
          LE_VS_LY: 0,
        },
      ],
    };

    // Act
    const result = await bigNumbersHandler.handle([], mockDataset);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].comp_ac_vs_ly_direction).toBe(undefined);
    expect(result[0].comp_le_vs_ly_direction).toBe(undefined);
  });
  it("should handle unpredicted KPI_NAME", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "test-dataset",
      data: [
        {
          COUNTRY_ISO_CODE_3: "BRA",
          DT_INI: "2023-07-01",
          DT_END: "2023-09-30",
          KPI_NAME: "innovation_unknown",
          AC: 500.8,
          LY: 480.2,
          LE: 1000.5,
          AC_VS_LY: 10.5,
          LE_VS_LY: 8.3,
        },
      ],
    };

    // Act
    const result = await bigNumbersHandler.handle([], mockDataset);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].measure).toBe(null);
    expect(result[0].secondary_measure).toBe(null);
  });

  it("should process multiple data items", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "test-dataset",
      data: [
        {
          COUNTRY_ISO_CODE_3: "USA",
          DT_INI: "2023-01-01",
          DT_END: "2023-03-31",
          KPI_NAME: "innovation_volume",
          AC: 1000.5,
          LY: 950.3,
          LE: 1000.5,
          AC_VS_LY: 5.2,
          LE_VS_LY: 3.1,
        },
        {
          COUNTRY_ISO_CODE_3: "BRA",
          DT_INI: "2023-04-01",
          DT_END: "2023-06-30",
          KPI_NAME: "innovation_volume_mix",
          AC: 500.8,
          LY: 480.2,
          LE: 1000.5,
          AC_VS_LY: -2.1,
          LE_VS_LY: -1.5,
        },
        {
          COUNTRY_ISO_CODE_3: "GBR",
          DT_INI: "2023-07-01",
          DT_END: "2023-09-30",
          KPI_NAME: "innovation_nr",
          AC: 300.2,
          LY: 300.2,
          LE: 1000.5,
          AC_VS_LY: 0,
          LE_VS_LY: 0,
        },
      ],
    };

    // Act
    const result = await bigNumbersHandler.handle([], mockDataset);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0].COUNTRY_ISO_CODE_3).toBe("USA");
    expect(result[0].comp_ac_vs_ly_direction).toBe(undefined);
    expect(result[1].COUNTRY_ISO_CODE_3).toBe("BRA");
    expect(result[1].comp_ac_vs_ly_direction).toBe(undefined);
    expect(result[2].COUNTRY_ISO_CODE_3).toBe("GBR");
    expect(result[2].comp_ac_vs_ly_direction).toBe(undefined);
  });

  it("should handle empty dataset data array", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "test-dataset",
      data: [],
    };

    // Act
    const result = await bigNumbersHandler.handle([], mockDataset);

    // Assert
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it("should process multiple data items with different KPIs", async () => {
    // Arrange
    const mockDataset: Dataset = {
      id: "test-dataset",
      data: [
        {
          COUNTRY_ISO_CODE_3: "USA",
          DT_INI: "2023-01-01",
          DT_END: "2023-03-31",
          KPI_NAME: "innovation_volume",
          AC: 1000.5,
          LY: 950.3,
          LE: 1000.5,
          AC_VS_LY: 5.2,
          LE_VS_LY: 3.1,
        },
        {
          COUNTRY_ISO_CODE_3: "BRA",
          DT_INI: "2023-04-01",
          DT_END: "2023-06-30",
          KPI_NAME: "innovation_volume_mix",
          AC: 500.8,
          LY: 480.2,
          LE: 1000.5,
          AC_VS_LY: -2.1,
          LE_VS_LY: -1.5,
        },
        {
          COUNTRY_ISO_CODE_3: "GBR",
          DT_INI: "2023-07-01",
          DT_END: "2023-09-30",
          KPI_NAME: "innovation_nr",
          AC: 300.2,
          LY: 300.2,
          LE: 1000.5,
          AC_VS_LY: 0,
          LE_VS_LY: 0,
        },
        {
          COUNTRY_ISO_CODE_3: "USA",
          DT_INI: "2023-01-01",
          DT_END: "2023-03-31",
          KPI_NAME: "innovation_maco",
          AC: 1000.5,
          LY: 950.3,
          LE: 1000.5,
          AC_VS_LY: 5.2,
          LE_VS_LY: 3.1,
        },
      ],
    };

    // Act
    const result = await bigNumbersHandler.handle([], mockDataset);

    // Assert
    expect(result).toHaveLength(4);
    expect(result[0].KPI_NAME).toBe("innovation_volume");
    expect(result[0].measure).toBe(null);
    expect(result[0].secondary_measure).toBe(null);
    expect(result[1].KPI_NAME).toBe("innovation_volume_mix");
    expect(result[1].measure).toBe(null);
    expect(result[1].secondary_measure).toBe(null);
    expect(result[2].KPI_NAME).toBe("innovation_nr");
    expect(result[2].measure).toBe(null);
    expect(result[2].secondary_measure).toBe(null);
    expect(result[3].KPI_NAME).toBe("innovation_maco");
    expect(result[3].measure).toBe(null);
  });
});
