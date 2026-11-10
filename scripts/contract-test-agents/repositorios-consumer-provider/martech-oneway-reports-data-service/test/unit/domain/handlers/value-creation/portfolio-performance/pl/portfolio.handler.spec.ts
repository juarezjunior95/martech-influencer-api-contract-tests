import { portfolioHandler } from "@domain/handlers/value-creation/portfolio-performance/pl/portfolio.handler";
import { Dataset } from "@domain/entities/datasource.entity";

const formatDirection = jest.fn(
  (value: number, params?: { invert?: boolean }) => {
    if (value === 0) return "down";
    const isPositive = value > 0;

    if (params?.invert) {
      return isPositive ? "down" : "up";
    }

    return isPositive ? "up" : "down";
  },
);

jest.mock("@common/utils/direction.utils", () => ({
  formatDirection: (value: number, params?: { invert?: boolean }) =>
    formatDirection(value, params),
}));

describe("PortfolioPLHandler", () => {
  describe("handler", () => {
    const mockDataItemVolume = {
      kpi_name: "volume",
      ac: 30073.8,
      og_vs_ly: 1.1,
      megabrands_ac: 15944,
      megabrands_og_vs_ly: 0.4,
      expansion_ac: 1537.7,
      expansion_og_vs_ly: 69,
      sustain_ac: 11745.9,
      sustain_og_vs_ly: -0.7,
      tail_ac: 846.2,
      tail_og_vs_ly: -25,
    };

    const mockDataItemCosts = {
      kpi_name: "vic",
      ac: -1129.7,
      og_vs_ly: -13.5,
      megabrands_ac: -612.5,
      megabrands_og_vs_ly: -12.3,
      expansion_ac: -85,
      expansion_og_vs_ly: -74.1,
      sustain_ac: -394.9,
      sustain_og_vs_ly: -16.5,
      tail_ac: -37.2,
      tail_og_vs_ly: 33.3,
    };

    beforeEach(() => {
      formatDirection.mockClear();
    });

    it("should process dataset data correctly and map standard KPI titles", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [mockDataItemVolume as any],
      };

      const result = await portfolioHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0].kpi_title).toBe("Total Volume");
      expect(result[0].kpi_name).toBe("volume");
      expect(result[0].comp_og_vs_ly_direction).toBe("up");
      expect(result[0].megabrands_direction).toBe("up");
      expect(result[0].sustain_direction).toBe("down");
      expect(formatDirection).toHaveBeenCalledWith(1.1, { invert: false });
    });

    it("should correctly invert direction for cost-related KPIs", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [mockDataItemCosts as any],
      };

      const result = await portfolioHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0].kpi_title).toBe("VIC");
      expect(result[0].comp_og_vs_ly_direction).toBe("up");
      expect(result[0].tail_direction).toBe("down");
      expect(result[0].megabrands_direction).toBe("up");
      expect(formatDirection).toHaveBeenCalledWith(-13.5, { invert: true });
    });

    it("should handle zero variation correctly for standard and reverse KPIs", async () => {
      const zeroData = {
        kpi_name: "nr",
        ac: 2669.9,
        og_vs_ly: 0,
        megabrands_og_vs_ly: 0,
        expansion_og_vs_ly: 0,
        sustain_og_vs_ly: 0,
        tail_og_vs_ly: 0,
      };

      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [zeroData as any],
      };

      const result = await portfolioHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0].comp_og_vs_ly_direction).toBe("down");
      expect(result[0].megabrands_direction).toBe("down");
    });

    it("should process multiple data items with mixed standard and reverse KPIs", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          { ...mockDataItemVolume, kpi_name: "gross", og_vs_ly: -1.0 } as any,
          {
            ...mockDataItemCosts,
            kpi_name: "discounts",
            og_vs_ly: 2.0,
          } as any,
        ],
      };

      const result = await portfolioHandler.handle([], mockDataset);

      expect(result).toHaveLength(2);
      expect(result[0].kpi_name).toBe("gross");
      expect(result[0].comp_og_vs_ly_direction).toBe("down");
      expect(result[1].kpi_name).toBe("discounts");
      expect(result[1].comp_og_vs_ly_direction).toBe("down");
      expect(formatDirection).toHaveBeenCalledWith(2.0, { invert: true });
    });

    it("should handle empty dataset data array", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      const result = await portfolioHandler.handle([], mockDataset);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
