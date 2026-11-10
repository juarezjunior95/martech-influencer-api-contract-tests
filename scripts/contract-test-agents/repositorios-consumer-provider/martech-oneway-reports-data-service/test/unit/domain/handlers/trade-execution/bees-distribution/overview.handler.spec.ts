import { beesDistributionOverviewHandler } from "@domain/handlers/trade-execution/bees-distribution/overview.handler";
import { Dataset } from "@domain/entities/datasource.entity";
import { formatDirection } from "@common/utils/direction.utils";

jest.mock("@common/utils/direction.utils", () => ({
  formatDirection: jest.fn(),
}));

describe("BeesDistributionOverviewHandler", () => {
  describe("handler", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should process bar-chart dataset and calculate performance using ac_vs_ly", async () => {
      // Arrange
      (formatDirection as jest.Mock).mockReturnValue("positive");

      const mockDatasets: Dataset[] = [
        {
          id: "bar-chart",
          data: [
            {
              kpi_name: "sku per poc",
              ac_vs_ly: "5.2",
            },
          ],
        },
      ];

      // Act
      const result = await beesDistributionOverviewHandler.handle(mockDatasets);

      // Assert
      expect(result).toHaveLength(1);
      expect(formatDirection).toHaveBeenCalledWith("5.2", {
        up: "positive",
        down: "negative",
      });

      expect((result[0] as any).id).toBe("bar-chart");
      expect((result[0] as any).config.kpi_title).toBe("SKU per POC");
      expect((result[0] as any).config.kpi_comparison_unit_of_measure).toBe(
        "%",
      );
      expect((result[0] as any).data[0].performance).toBe("positive");
    });

    it("should process card-chart dataset and calculate performance using delta_pct", async () => {
      // Arrange
      (formatDirection as jest.Mock).mockReturnValue("negative");

      const mockDatasets: Dataset[] = [
        {
          id: "card-chart",
          data: [
            {
              kpi_name: "bees buyers",
              delta_pct: "-3.4",
            },
          ],
        },
      ];

      // Act
      const result = await beesDistributionOverviewHandler.handle(mockDatasets);

      // Assert
      expect(formatDirection).toHaveBeenCalledWith("-3.4", {
        up: "positive",
        down: "negative",
      });

      expect((result[0] as any).config.kpi_title).toBe("Total Buyers");
      expect((result[0] as any).data[0].performance).toBe("negative");
    });

    it("should process line-chart dataset and calculate performance using ly", async () => {
      // Arrange
      (formatDirection as jest.Mock).mockReturnValue("positive");

      const mockDatasets: Dataset[] = [
        {
          id: "line-chart",
          data: [
            {
              kpi_name: "distribution",
              ly: "10.1",
            },
          ],
        },
      ];

      // Act
      const result = await beesDistributionOverviewHandler.handle(mockDatasets);

      // Assert
      expect(formatDirection).toHaveBeenCalledWith("10.1", {
        up: "positive",
        down: "negative",
      });

      expect((result[0] as any).config.kpi_title).toBe("Total Distribution");
      expect((result[0] as any).data[0].performance).toBe("positive");
    });

    it("should return empty performance when chart id is not mapped", async () => {
      // Arrange
      const mockDatasets: Dataset[] = [
        {
          id: "unknown-chart",
          data: [
            {
              kpi_name: "sku per poc",
              ac_vs_ly: "4.1",
            },
          ],
        },
      ];

      // Act
      const result = await beesDistributionOverviewHandler.handle(mockDatasets);

      // Assert
      expect(formatDirection).not.toHaveBeenCalled();
      expect((result[0] as any).data[0].performance).toBe("");
    });

    it("should return empty performance when performance field value is null", async () => {
      // Arrange
      const mockDatasets: Dataset[] = [
        {
          id: "bar-chart",
          data: [
            {
              kpi_name: "sku per poc",
              ac_vs_ly: null,
            },
          ],
        },
      ];

      // Act
      const result = await beesDistributionOverviewHandler.handle(mockDatasets);

      // Assert
      expect(formatDirection).not.toHaveBeenCalled();
      expect((result[0] as any).data[0].performance).toBe("");
    });

    it("should fallback to kpi_name when KPI title mapping does not exist", async () => {
      // Arrange
      (formatDirection as jest.Mock).mockReturnValue("positive");

      const mockDatasets: Dataset[] = [
        {
          id: "bar-chart",
          data: [
            {
              kpi_name: "unknown_kpi",
              ac_vs_ly: "2.5",
            },
          ],
        },
      ];

      // Act
      const result = await beesDistributionOverviewHandler.handle(mockDatasets);

      // Assert
      expect((result[0] as any).config.kpi_title).toBe("unknown_kpi");
      expect((result[0] as any).data[0].performance).toBe("positive");
    });

    it("should handle multiple datasets correctly", async () => {
      // Arrange
      (formatDirection as jest.Mock).mockReturnValue("positive");

      const mockDatasets: Dataset[] = [
        {
          id: "bar-chart",
          data: [
            {
              kpi_name: "sku per poc",
              ac_vs_ly: "1.2",
            },
          ],
        },
        {
          id: "card-chart",
          data: [
            {
              kpi_name: "bees buyers",
              delta_pct: "3.8",
            },
          ],
        },
      ];

      // Act
      const result = await beesDistributionOverviewHandler.handle(mockDatasets);

      // Assert
      expect(result).toHaveLength(2);
      expect((result[0] as any).config.kpi_title).toBe("SKU per POC");
      expect((result[1] as any).config.kpi_title).toBe("Total Buyers");
    });

    it("should handle dataset with empty data array", async () => {
      // Arrange
      const mockDatasets: Dataset[] = [
        {
          id: "bar-chart",
          data: [],
        },
      ];

      // Act
      const result = await beesDistributionOverviewHandler.handle(mockDatasets);

      // Assert
      expect(result).toHaveLength(1);
      expect((result[0] as any).data).toEqual([]);
      expect((result[0] as any).config).toEqual({});
    });
  });
});
