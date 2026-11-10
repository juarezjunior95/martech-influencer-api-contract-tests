import { Dataset } from "@domain/entities/datasource.entity";
import { portfolioPerformanceHandler } from "@domain/handlers/value-creation/portfolio-performance/overview/portfolio-performance.handler";

describe("PortfolioPerformanceHandler", () => {
  describe("handler", () => {
    it("should map the wide portfolio performance output with refresh labels and directions", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-performance",
        data: [
          {
            SEGMENT: "Megabrands",
            DT_END_VOLUME: "2026-04-30",
            DT_END_OTHERS: "2026-03-31",
            DT_END_POWER: "2026-02-28",
            VOLUME_GROWTH_CONTR: 25.4,
            VOLUME_WEIGHT: 42.1,
            VOLUME_AC_VS_LY: -1.3,
            NR_AC_VS_LY: 2.5,
            CORES_AC_VS_LY: -0.8,
            BRAND_POWER_PP: 1.2,
            SM_OF_MACO_AC: 15.3,
            SM_WEIGHT: 34.5,
            VOLUME_AC: 120.7,
            SM_OF_MACO_AC_VS_LY: -2.2,
            MARKET_SHARE: null,
          },
        ],
      };

      const result = await portfolioPerformanceHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        segment: "Megabrands",
        dt_end_volume: "2026-04-30",
        dt_end_others: "2026-03-31",
        dt_end_power: "2026-02-28",
        volume_period_refresh: "Q2'26",
        volume_month_refresh: "Apr'26",
        others_period_refresh: "Q1'26",
        others_month_refresh: "Mar'26",
        power_period_refresh: "Q1'26",
        volume_growth_contr: 25.4,
        comp_volume_growth_contr_direction: "up",
        volume_weight: 42.1,
        comp_volume_weight_direction: "up",
        volume_ac_vs_ly: -1.3,
        comp_volume_ac_vs_ly_direction: "down",
        nr_ac_vs_ly: 2.5,
        comp_nr_ac_vs_ly_direction: "up",
        cores_ac_vs_ly: -0.8,
        comp_cores_ac_vs_ly_direction: "down",
        brand_power_pp: 1.2,
        comp_brand_power_pp_direction: "up",
        sm_of_maco_ac: 15.3,
        comp_sm_of_maco_ac_direction: "up",
        sm_weight: 34.5,
        comp_sm_weight_direction: "up",
        volume_ac: 120.7,
        comp_volume_ac_direction: "up",
        sm_of_maco_ac_vs_ly: -2.2,
        comp_sm_of_maco_ac_vs_ly_direction: "down",
        market_share: null,
        comp_market_share_direction: "",
      });
    });

    it("should process lowercase dataset fields", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-performance",
        data: [
          {
            segment: "Expansion",
            dt_end_volume: "2026-05-31",
            dt_end_others: "2026-05-31",
            dt_end_power: "2026-04-30",
            volume_growth_contr: "10.1",
            volume_weight: "20.2",
            volume_ac_vs_ly: "0",
            nr_ac_vs_ly: "-1.2",
            cores_ac_vs_ly: "3.4",
            brand_power_pp: "-0.5",
            sm_of_maco_ac: "9.8",
            sm_weight: "11.1",
            volume_ac: "100.0",
            sm_of_maco_ac_vs_ly: "1.5",
            market_share: "",
          },
        ],
      };

      const result = await portfolioPerformanceHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        segment: "Expansion",
        volume_month_refresh: "May'26",
        others_month_refresh: "May'26",
        volume_growth_contr: "10.1",
        comp_volume_growth_contr_direction: "up",
        volume_ac_vs_ly: "0",
        comp_volume_ac_vs_ly_direction: "down",
        nr_ac_vs_ly: "-1.2",
        comp_nr_ac_vs_ly_direction: "down",
        brand_power_pp: "-0.5",
        comp_brand_power_pp_direction: "down",
        market_share: "",
        comp_market_share_direction: "",
      });
    });

    it("should fall back to dt_end_others when DT_END_POWER is missing", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-performance",
        data: [
          {
            SEGMENT: "Megabrands",
            DT_END_VOLUME: "2026-04-30",
            DT_END_OTHERS: "2026-03-31",
            VOLUME_GROWTH_CONTR: 25.4,
            VOLUME_WEIGHT: 42.1,
            VOLUME_AC_VS_LY: -1.3,
            NR_AC_VS_LY: 2.5,
            CORES_AC_VS_LY: -0.8,
            BRAND_POWER_PP: 1.2,
            SM_OF_MACO_AC: 15.3,
            SM_WEIGHT: 34.5,
            VOLUME_AC: 120.7,
            SM_OF_MACO_AC_VS_LY: -2.2,
            MARKET_SHARE: null,
          },
        ],
      };

      const result = await portfolioPerformanceHandler.handle([], mockDataset);

      expect(result[0].dt_end_power).toBe("2026-03-31");
      expect(result[0].power_period_refresh).toBe("Q1'26");
    });

    it("should return an empty array when the dataset has no rows", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-performance",
        data: [],
      };

      const result = await portfolioPerformanceHandler.handle([], mockDataset);

      expect(result).toEqual([]);
    });

    it("should return an empty array when no default dataset is provided", async () => {
      const result = await portfolioPerformanceHandler.handle([]);

      expect(result).toEqual([]);
    });
  });
});
