import { deepDiveHandler } from "@domain/handlers/value-creation/portfolio-performance/pl/deep-dive.handler";

import { Dataset } from "@domain/entities/datasource.entity";

const formatDirection = jest.fn(
  (value: number, params?: { invert?: boolean }) => {
    if (value === 0) return "down";

    const positive = value > 0;

    if (params?.invert) {
      return positive ? "down" : "up";
    }

    return positive ? "up" : "down";
  },
);

jest.mock("@common/utils/direction.utils", () => ({
  formatDirection: (value: number, params?: { invert?: boolean }) =>
    formatDirection(value, params),
}));

describe("DeepDiveHandler", () => {
  describe("handle", () => {
    const mockVolume = {
      KPI_NAME: "volume",
      AC: "100",
      LY: "90",
      BU: "95",
      OG_VS_LY: "5",
      OG_VS_LY_COMP: "5",
      OG_VS_BU: "2",
      OG_VS_BU_COMP: "2",
      MAX_INI: "2024-01-01",
      MAX_END: "2024-12-31",
    };

    const mockCosts = {
      KPI_NAME: "vic",
      AC: "-30",
      LY: "-25",
      BU: "-28",
      OG_VS_LY: "-2",
      OG_VS_LY_COMP: "-2",
      OG_VS_BU: "-1",
      OG_VS_BU_COMP: "-1",
      MAX_INI: "2024-01-01",
      MAX_END: "2024-12-31",
    };

    it("should process volume KPI correctly (standard direction)", async () => {
      const dataset: Dataset = {
        id: "test",
        data: [mockVolume as any],
      };

      const result = await deepDiveHandler.handle([], dataset);

      expect(result).toHaveLength(1);

      expect(result[0].kpi_title).toBe("Total Volume");
      expect(result[0].og_vs_ly).toBe("5");

      expect(result[0].og_vs_ly_comp).toBe("5");

      expect(result[0].og_vs_ly_comp_direction).toBe("up");
    });

    it("should process VIC KPI correctly (reverse direction applies)", async () => {
      const dataset: Dataset = {
        id: "test",
        data: [mockCosts as any],
      };

      const result = await deepDiveHandler.handle([], dataset);

      expect(result).toHaveLength(1);

      expect(result[0].kpi_title).toBe("VIC");

      expect(result[0].og_vs_ly_comp).toBe("-2");

      expect(result[0].og_vs_ly_comp_direction).toBe("up");
    });

    it("should handle zero variation correctly (down direction)", async () => {
      const zero = {
        KPI_NAME: "gross",
        AC: "10",
        LY: "9",
        BU: "8",
        OG_VS_LY: "0",
        OG_VS_LY_COMP: "0",
        OG_VS_BU: "0",
        OG_VS_BU_COMP: "0",
      };

      const dataset: Dataset = {
        id: "test",
        data: [zero as any],
      };

      const result = await deepDiveHandler.handle([], dataset);

      expect(result).toHaveLength(1);

      expect(result[0].og_vs_ly_comp).toBe("0");

      expect(result[0].og_vs_ly_comp_direction).toBe("down");
    });

    it("should process multiple items (mixed KPIs)", async () => {
      const dataset: Dataset = {
        id: "test",
        data: [
          { ...mockVolume, KPI_NAME: "gross", OG_VS_LY_COMP: "-1" },
          { ...mockCosts, KPI_NAME: "discounts", OG_VS_LY_COMP: "2" },
        ] as any,
      };

      const result = await deepDiveHandler.handle([], dataset);

      expect(result).toHaveLength(2);

      // 1st item (gross — standard)
      expect(result[0].kpi_title).toBe("Gross Turnover");
      expect(result[0].og_vs_ly_comp).toBe("-1");

      // 2nd item (discounts — reversed)
      expect(result[1].kpi_title).toBe("Discounts");
      expect(result[1].og_vs_ly_comp).toBe("2");
    });
  });
});
