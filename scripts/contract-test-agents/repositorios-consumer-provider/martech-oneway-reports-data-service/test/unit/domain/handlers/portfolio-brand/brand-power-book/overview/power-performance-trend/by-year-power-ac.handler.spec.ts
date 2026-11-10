import { byYearPowerAcHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/power-performance-trend/by-year-power-ac.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("ByYearPowerAcHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "200.5",
            AC_VS_PREVIOUS_YEAR: "12.5",
            AC_VS_LY: "12.5",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-31",
          },
        ],
      };

      // Act
      const result = await byYearPowerAcHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        value: "200.5",
        variation: "12.5",
        variation_direction: "up",
        label: "FY'23",
      });
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "180.0",
            AC_VS_PREVIOUS_YEAR: "-8.5",
            AC_VS_LY: "-8.5",
            DT_INI: "2022-01-01",
            DT_END: "2022-12-31",
          },
        ],
      };

      // Act
      const result = await byYearPowerAcHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction).toBe("down");
      expect(result[0].variation).toBe("-8.5");
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "190.0",
            AC_VS_PREVIOUS_YEAR: "0",
            AC_VS_LY: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-09-30",
          },
        ],
      };

      // Act
      const result = await byYearPowerAcHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction).toBe("down");
    });

    it("should format period labels with cumulative quarters", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "150.0",
            AC_VS_PREVIOUS_YEAR: "5.0",
            AC_VS_LY: "5.0",
            DT_INI: "2023-01-01",
            DT_END: "2023-06-30",
          },
        ],
      };

      // Act
      const result = await byYearPowerAcHandler.handle([], mockDataset);

      // Assert
      expect(result[0].label).toBe("H1'23");
    });

    it("should process multiple yearly data items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "200.5",
            AC_VS_PREVIOUS_YEAR: "12.5",
            AC_VS_LY: "12.5",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-31",
          },
          {
            AC: "180.0",
            AC_VS_PREVIOUS_YEAR: "-5.0",
            AC_VS_LY: "-5.0",
            DT_INI: "2022-01-01",
            DT_END: "2022-12-31",
          },
          {
            AC: "170.0",
            AC_VS_PREVIOUS_YEAR: "8.0",
            AC_VS_LY: "8.0",
            DT_INI: "2021-01-01",
            DT_END: "2021-12-31",
          },
        ],
      };

      // Act
      const result = await byYearPowerAcHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].label).toBe("FY'23");
      expect(result[1].label).toBe("FY'22");
      expect(result[2].label).toBe("FY'21");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await byYearPowerAcHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
