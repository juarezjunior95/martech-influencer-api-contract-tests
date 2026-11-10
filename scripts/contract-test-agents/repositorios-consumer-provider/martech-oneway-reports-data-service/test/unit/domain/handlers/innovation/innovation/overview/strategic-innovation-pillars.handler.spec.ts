import { strategicInnovationPillarsHandler } from "@domain/handlers/innovation/innovation/overview/strategic-innovation-pillars.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("StrategicInnovationPillarsHandler", () => {
  describe("handle", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-01",
            KPI_NAME: "innovation_volume",
            AC: 9187,
            AC_VS_LY: 26.6,
            LEVEL_1: "pack_price",
            AVERAGE_LINE: 2947,
            YEAR_INI: 2023,
            MAX_YEAR: 2025,
          },
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-01",
            KPI_NAME: "innovation_volume",
            AC: 6285.3,
            AC_VS_LY: -25.4,
            LEVEL_1: "new_opportunities",
            AVERAGE_LINE: -3609.9,
            YEAR_INI: 2023,
            MAX_YEAR: 2025,
          },
        ],
      };

      // Act
      const result = await strategicInnovationPillarsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].country).toBe("BRA");
      expect(result[0].ac_vs_ly).toBe(26.6);
      expect(result[0].average_line_direction).toBe("up");
      expect(result[0].level_1).toBe("pack_price");
      expect(result[1].country).toBe("BRA");
      expect(result[1].ac_vs_ly).toBe(-25.4);
      expect(result[1].average_line_direction).toBe("down");
      expect(result[1].level_1).toBe("new_opportunities");
    });

    it("should handle zero variations correctly with positiveZero option", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-01",
            KPI_NAME: "innovation_volume",
            AC: 0,
            AC_VS_LY: 0,
            LEVEL_1: "renovation",
            AVERAGE_LINE: 0,
            YEAR_INI: 2023,
            MAX_YEAR: 2025,
          },
        ],
      };

      // Act
      const result = await strategicInnovationPillarsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].average_line_direction).toBe("up");
    });

    it("should process multiple data items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-01",
            KPI_NAME: "innovation_volume",
            AC: 9187,
            AC_VS_LY: 26.6,
            LEVEL_1: "pack_price",
            AVERAGE_LINE: 2947,
            YEAR_INI: 2023,
            MAX_YEAR: 2025,
          },
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-01",
            KPI_NAME: "innovation_volume",
            AC: 6285.3,
            AC_VS_LY: -25.4,
            LEVEL_1: "new_opportunities",
            AVERAGE_LINE: -3609.9,
            YEAR_INI: 2023,
            MAX_YEAR: 2025,
          },
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2025-01-01",
            DT_END: "2025-09-01",
            KPI_NAME: "innovation_volume",
            AC: 713.1,
            AC_VS_LY: 2075.3,
            LEVEL_1: "renovation",
            AVERAGE_LINE: 155.5,
            YEAR_INI: 2025,
            MAX_YEAR: 2025,
          },
        ],
      };

      // Act
      const result = await strategicInnovationPillarsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].country).toBe("BRA");
      expect(result[0].ac_vs_ly).toBe(26.6);
      expect(result[0].average_line).toBe(2947);
      expect(result[0].average_line_direction).toBe("up");
      expect(result[0].level_1).toBe("pack_price");
      expect(result[1].country).toBe("BRA");
      expect(result[1].ac_vs_ly).toBe(-25.4);
      expect(result[1].average_line).toBe(-3609.9);
      expect(result[1].average_line_direction).toBe("down");
      expect(result[1].level_1).toBe("new_opportunities");
      expect(result[2].country).toBe("BRA");
      expect(result[2].ac_vs_ly).toBe(2075.3);
      expect(result[2].average_line).toBe(155.5);
      expect(result[2].average_line_direction).toBe("up");
      expect(result[2].level_1).toBe("renovation");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await strategicInnovationPillarsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should handle all different level_1 values", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-01",
            KPI_NAME: "innovation_volume",
            AC: 9187,
            AC_VS_LY: 26.6,
            LEVEL_1: "pack_price",
            AVERAGE_LINE: 2947,
            YEAR_INI: 2023,
            MAX_YEAR: 2025,
          },
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-01",
            KPI_NAME: "innovation_volume",
            AC: 6285.3,
            AC_VS_LY: -25.4,
            LEVEL_1: "new_opportunities",
            AVERAGE_LINE: -3609.9,
            YEAR_INI: 2023,
            MAX_YEAR: 2025,
          },
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-01",
            KPI_NAME: "innovation_volume",
            AC: 0,
            AC_VS_LY: -100,
            LEVEL_1: "renovation",
            AVERAGE_LINE: 155.5,
            YEAR_INI: 2023,
            MAX_YEAR: 2025,
          },
        ],
      };

      // Act
      const result = await strategicInnovationPillarsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].level_1).toBe("pack_price");
      expect(result[1].level_1).toBe("new_opportunities");
      expect(result[2].level_1).toBe("renovation");
    });

    it("should handle null AC_VS_LY and AVERAGE_LINE values", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2022-01-01",
            DT_END: "2022-12-01",
            KPI_NAME: "innovation_volume",
            AC: 7255.6,
            AC_VS_LY: null as any,
            LEVEL_1: "pack_price",
            AVERAGE_LINE: null as any,
            YEAR_INI: 2022,
            MAX_YEAR: 2025,
          },
        ],
      };

      // Act
      const result = await strategicInnovationPillarsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].ac_vs_ly).toBeNull();
      expect(result[0].average_line).toBeNull();
    });
  });
});
