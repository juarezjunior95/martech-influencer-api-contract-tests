import { growthLeversMonthlyHandler } from "@domain/handlers/value-creation/portfolio-performance/overview/category-growth-levers/growth-levers-monthly.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("GrowthLeversMonthlyHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            DT_END: "2023-12-01",
            DT_INI: "2023-12-01",
            VALUE: 100.5,
            AC: 3.1,
            MIX: 2.1,
            KPI_NAME: "revenue",
          },
        ],
      };

      // Act
      const result = await growthLeversMonthlyHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        comp_direction: "up",
        date_refresh: "Dec'23",
        vs_ly_label: "vs Dec'22",
        vs_ly_label_suffix: "MTD",
        dt_ini: "2023-12-01",
        dt_end: "2023-12-01",
        value: 100.5,
        ac: 3.1,
        mix: 2.1,
        kpi_name: "revenue",
      });
    });

    it("should handle YTD period correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            DT_END: "2023-12-01",
            DT_INI: "2023-01-01",
            VALUE: 250.8,
            AC: 4.2,
            MIX: 3.3,
            KPI_NAME: "volume",
          },
        ],
      };

      // Act
      const result = await growthLeversMonthlyHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        comp_direction: "up",
        date_refresh: "Dec'23",
        vs_ly_label: "vs Dec'22",
        vs_ly_label_suffix: "YTD",
        dt_ini: "2023-01-01",
        dt_end: "2023-12-01",
        value: 250.8,
        ac: 4.2,
        mix: 3.3,
        kpi_name: "volume",
      });
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            DT_END: "2023-06-30",
            DT_INI: "2023-06-30",
            VALUE: -80.3,
            AC: 1.8,
            MIX: -0.7,
            KPI_NAME: "profit",
          },
        ],
      };

      // Act
      const result = await growthLeversMonthlyHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        comp_direction: "down",
        date_refresh: "Jun'23",
        vs_ly_label: "vs Jun'22",
        vs_ly_label_suffix: "MTD",
        dt_ini: "2023-06-30",
        dt_end: "2023-06-30",
        value: -80.3,
        ac: 1.8,
        mix: -0.7,
        kpi_name: "profit",
      });
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            DT_END: "2023-03-31",
            DT_INI: "2023-03-31",
            VALUE: 0,
            AC: 0,
            MIX: 0,
            KPI_NAME: "market_share",
          },
        ],
      };

      // Act
      const result = await growthLeversMonthlyHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].value).toBe(0);
    });

    it("should process multiple data items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            DT_END: "2023-12-31",
            DT_INI: "2023-12-31",
            VALUE: 100.5,
            AC: 3.1,
            MIX: 2.1,
            KPI_NAME: "revenue",
          },
          {
            DT_END: "2023-11-30",
            DT_INI: "2023-01-01",
            VALUE: 90.3,
            AC: 2.0,
            MIX: -3.5,
            KPI_NAME: "volume",
          },
        ],
      };

      // Act
      const result = await growthLeversMonthlyHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].value).toBe(100.5);
      expect(result[0].vs_ly_label_suffix).toBe("MTD");
      expect(result[1].value).toBe(90.3);
      expect(result[1].vs_ly_label_suffix).toBe("YTD");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await growthLeversMonthlyHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
