import { overtimePerformanceHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/finance/volume/overtime-performance.handler";
import { Dataset } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";

describe("OvertimePerformanceHandler", () => {
  describe("handle", () => {
    it("should treat zero ac_vs_ly as negative (down)", async () => {
      const kpiData = new KpiEntity({
        DT_INI: "2025-01-01",
        DT_END: "2025-01-01",
        KPI_NAME: "volume",
        AC: 100,
        AC_VS_LY: 0,
        AC_VS_BU: 5,
      });

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [kpiData],
      };

      const result = await overtimePerformanceHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0].ac_vs_ly).toBe(0);
      expect(result[0].variationDirectionVsLy).toBe("down");
    });

    it("should treat zero ac_vs_bu as negative (down)", async () => {
      const kpiData = new KpiEntity({
        DT_INI: "2025-01-01",
        DT_END: "2025-01-01",
        KPI_NAME: "volume",
        AC: 100,
        AC_VS_LY: 5,
        AC_VS_BU: 0,
      });

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [kpiData],
      };

      const result = await overtimePerformanceHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0].ac_vs_bu).toBe(0);
      expect(result[0].variationDirectionVsBu).toBe("down");
    });

    it("should treat both zero ac_vs_ly and ac_vs_bu as negative (down)", async () => {
      // Arrange
      const kpiData = new KpiEntity({
        DT_INI: "2025-01-01",
        DT_END: "2025-01-01",
        KPI_NAME: "volume",
        AC: 100,
        AC_VS_LY: 0,
        AC_VS_BU: 0,
      });

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [kpiData],
      };

      // Act
      const result = await overtimePerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].ac_vs_ly).toBe(0);
      expect(result[0].ac_vs_bu).toBe(0);
      expect(result[0].variationDirectionVsLy).toBe("down");
      expect(result[0].variationDirectionVsBu).toBe("down");
    });

    it("should treat positive ac_vs_ly and ac_vs_bu as up", async () => {
      // Arrange
      const kpiData = new KpiEntity({
        DT_INI: "2025-01-01",
        DT_END: "2025-01-01",
        KPI_NAME: "volume",
        AC: 100,
        AC_VS_LY: 10.5,
        AC_VS_BU: 8.3,
      });

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [kpiData],
      };

      // Act
      const result = await overtimePerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].ac_vs_ly).toBe(10.5);
      expect(result[0].ac_vs_bu).toBe(8.3);
      expect(result[0].variationDirectionVsLy).toBe("up");
      expect(result[0].variationDirectionVsBu).toBe("up");
    });

    it("should treat negative ac_vs_ly and ac_vs_bu as down", async () => {
      // Arrange
      const kpiData = new KpiEntity({
        DT_INI: "2025-01-01",
        DT_END: "2025-01-01",
        KPI_NAME: "volume",
        AC: 100,
        AC_VS_LY: -15.3,
        AC_VS_BU: -12.7,
      });

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [kpiData],
      };

      // Act
      const result = await overtimePerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].ac_vs_ly).toBe(-15.3);
      expect(result[0].ac_vs_bu).toBe(-12.7);
      expect(result[0].variationDirectionVsLy).toBe("down");
      expect(result[0].variationDirectionVsBu).toBe("down");
    });

    it("should preserve all other KpiEntity fields", async () => {
      // Arrange
      const kpiData = new KpiEntity({
        DT_INI: "2025-01-01",
        DT_END: "2025-01-01",
        KPI_NAME: "volume",
        AC: 100,
        AC_VS_LY: 0,
        AC_VS_BU: 0,
        LE_VS_LY: 5.2,
      });

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [kpiData],
      };

      // Act
      const result = await overtimePerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].dt_ini).toBe("2025-01-01");
      expect(result[0].dt_end).toBe("2025-01-01");
      expect(result[0].kpi_name).toBe("volume");
      expect(result[0].ac).toBe(100);
      expect(result[0].le_vs_ly).toBe(5.2);
      expect(result[0].variationDirectionVsLe).toBeDefined();
      expect(result[0].refreshMonthLabel).toBeDefined();
    });

    it("should handle multiple data items with mixed values", async () => {
      // Arrange
      const kpiData1 = new KpiEntity({
        DT_INI: "2025-01-01",
        DT_END: "2025-01-01",
        KPI_NAME: "volume",
        AC: 100,
        AC_VS_LY: 0,
        AC_VS_BU: 0,
      });

      const kpiData2 = new KpiEntity({
        DT_INI: "2025-02-01",
        DT_END: "2025-02-01",
        KPI_NAME: "volume",
        AC: 120,
        AC_VS_LY: 5.5,
        AC_VS_BU: -3.2,
      });

      const kpiData3 = new KpiEntity({
        DT_INI: "2025-03-01",
        DT_END: "2025-03-01",
        KPI_NAME: "volume",
        AC: 90,
        AC_VS_LY: -10.2,
        AC_VS_BU: 8.1,
      });

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [kpiData1, kpiData2, kpiData3],
      };

      // Act
      const result = await overtimePerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(3);
      // Item 1: both zero (treated as down)
      expect(result[0].ac_vs_ly).toBe(0);
      expect(result[0].ac_vs_bu).toBe(0);
      expect(result[0].variationDirectionVsLy).toBe("down");
      expect(result[0].variationDirectionVsBu).toBe("down");
      // Item 2: positive vs_ly, negative vs_bu
      expect(result[1].ac_vs_ly).toBe(5.5);
      expect(result[1].ac_vs_bu).toBe(-3.2);
      expect(result[1].variationDirectionVsLy).toBe("up");
      expect(result[1].variationDirectionVsBu).toBe("down");
      // Item 3: negative vs_ly, positive vs_bu
      expect(result[2].ac_vs_ly).toBe(-10.2);
      expect(result[2].ac_vs_bu).toBe(8.1);
      expect(result[2].variationDirectionVsLy).toBe("down");
      expect(result[2].variationDirectionVsBu).toBe("up");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await overtimePerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should handle null ac_vs_ly and ac_vs_bu values", async () => {
      // Arrange
      const kpiData = new KpiEntity({
        DT_INI: "2022-01-01",
        DT_END: "2022-01-01",
        KPI_NAME: "volume",
        AC: 100,
        AC_VS_LY: null as any,
        AC_VS_BU: null as any,
      });

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [kpiData],
      };

      // Act
      const result = await overtimePerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].ac_vs_ly).toBeNull();
      expect(result[0].ac_vs_bu).toBeNull();
      expect(result[0].variationDirectionVsLy).toBe("down");
      expect(result[0].variationDirectionVsBu).toBe("down");
    });
  });
});
