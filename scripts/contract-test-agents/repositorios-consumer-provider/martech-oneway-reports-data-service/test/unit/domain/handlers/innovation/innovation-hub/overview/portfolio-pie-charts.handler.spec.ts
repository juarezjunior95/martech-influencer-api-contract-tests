import { portfolioPieChartsHandler } from "@domain/handlers/innovation/innovation-hub/overview/portfolio-pie-charts.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("PortfolioPieChartsHandler", () => {
  describe("handle", () => {
    it("should map lake chart values to formatter ids", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-pie-charts",
        data: [
          {
            CHART: "Innovation Pillar",
            ITEM: "New Opportunities",
            METRIC: "volume",
            PERCENTAGE: 33.3,
            COUNTRY_ISO_CODE_3: "ABI",
            ABI_ZONE: "ABI",
          },
          {
            CHART: "Megabrands",
            ITEM: "Megabrands",
            METRIC: "volume",
            PERCENTAGE: 25,
            COUNTRY_ISO_CODE_3: "ABI",
            ABI_ZONE: "ABI",
          },
        ],
      };

      const result = await portfolioPieChartsHandler.handle([], mockDataset);

      expect(result).toHaveLength(2);
      expect(result[0].chart).toBe("innovationPillar");
      expect(result[0].item).toBe("New Opportunities");
      expect(result[0].metric).toBe("volume");
      expect(result[0].percentage).toBe(33.3);
      expect(result[1].chart).toBe("megabrandFramework");
      expect(result[1].item).toBe("Megabrands");
    });

    it("should normalize ALL country and zone to ABI", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-pie-charts",
        data: [
          {
            CHART: "Innovation Pillar",
            ITEM: "Renovation",
            METRIC: "volume",
            PERCENTAGE: 34,
            COUNTRY_ISO_CODE_3: "ALL",
            ABI_ZONE: "ALL",
          },
        ],
      };

      const result = await portfolioPieChartsHandler.handle([], mockDataset);

      expect(result[0].country).toBe("ABI");
      expect(result[0].zone).toBe("ABI");
    });

    it("should handle snake_case lake columns", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-pie-charts",
        data: [
          {
            chart: "Innovation Pillar",
            item: "Pack & Price",
            metric: "nr",
            percentage: 33.3,
            country_iso_code_3: "BRA",
            abi_zone: "SAZ",
          },
        ],
      };

      const result = await portfolioPieChartsHandler.handle([], mockDataset);

      expect(result[0].chart).toBe("innovationPillar");
      expect(result[0].item).toBe("Pack & Price");
      expect(result[0].metric).toBe("nr");
      expect(result[0].percentage).toBe(33.3);
      expect(result[0].country).toBe("BRA");
      expect(result[0].zone).toBe("SAZ");
    });

    it("should map Liquid Type chart to liquidType id", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-pie-charts",
        data: [
          {
            CHART: "Liquid Type",
            ITEM: "Beer",
            METRIC: "volume",
            PERCENTAGE: 50,
            COUNTRY_ISO_CODE_3: "ABI",
            ABI_ZONE: "ABI",
          },
        ],
      };

      const result = await portfolioPieChartsHandler.handle([], mockDataset);

      expect(result[0].chart).toBe("liquidType");
    });

    it("should return empty array when dataset is missing", async () => {
      const result = await portfolioPieChartsHandler.handle([], undefined);

      expect(result).toEqual([]);
    });

    it("should return empty array when dataset has no data", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-pie-charts",
        data: [],
      };

      const result = await portfolioPieChartsHandler.handle([], mockDataset);

      expect(result).toEqual([]);
    });
  });
});
