import volumeBigNumbers from "@domain/config/views/mobile/value-creation/deep-dive/volume/big-numbers.view";
import volumeLineChart from "@domain/config/views/mobile/value-creation/deep-dive/volume/line-chart.view";
import volumeWaterfall from "@domain/config/views/mobile/value-creation/deep-dive/volume/waterfall.view";
import netRevenueBigNumbers from "@domain/config/views/mobile/value-creation/deep-dive/net-revenue/big-numbers.view";
import netRevenueLineChart from "@domain/config/views/mobile/value-creation/deep-dive/net-revenue/line-chart.view";
import netRevenueWaterfall from "@domain/config/views/mobile/value-creation/deep-dive/net-revenue/waterfall.view";
import coresBigNumbers from "@domain/config/views/mobile/value-creation/deep-dive/cores/big-numbers.view";
import coresLineChart from "@domain/config/views/mobile/value-creation/deep-dive/cores/line-chart.view";
import coresWaterfall from "@domain/config/views/mobile/value-creation/deep-dive/cores/waterfall.view";
import brandPowerBigNumbers from "@domain/config/views/mobile/value-creation/deep-dive/brand-power/big-numbers.view";
import brandPowerLineChart from "@domain/config/views/mobile/value-creation/deep-dive/brand-power/line-chart.view";
import brandPowerWaterfall from "@domain/config/views/mobile/value-creation/deep-dive/brand-power/waterfall.view";
import marketShareBigNumbers from "@domain/config/views/mobile/value-creation/deep-dive/market-share/big-numbers.view";
import marketShareLineChart from "@domain/config/views/mobile/value-creation/deep-dive/market-share/line-chart.view";
import marketShareWaterfall from "@domain/config/views/mobile/value-creation/deep-dive/market-share/waterfall.view";

type ComponentId = "big-numbers" | "line-chart" | "waterfall";

const byKpi = {
  volume: {
    "big-numbers": volumeBigNumbers,
    "line-chart": volumeLineChart,
    waterfall: volumeWaterfall,
  },
  "net-revenue": {
    "big-numbers": netRevenueBigNumbers,
    "line-chart": netRevenueLineChart,
    waterfall: netRevenueWaterfall,
  },
  cores: {
    "big-numbers": coresBigNumbers,
    "line-chart": coresLineChart,
    waterfall: coresWaterfall,
  },
  "brand-power": {
    "big-numbers": brandPowerBigNumbers,
    "line-chart": brandPowerLineChart,
    waterfall: brandPowerWaterfall,
  },
  "market-share": {
    "big-numbers": marketShareBigNumbers,
    "line-chart": marketShareLineChart,
    waterfall: marketShareWaterfall,
  },
} as const;

const allViews = Object.entries(byKpi).flatMap(([kpi, components]) =>
  Object.entries(components).map(([componentId, config]) => ({
    label: `${kpi}/${componentId}`,
    kpi: kpi as keyof typeof byKpi,
    componentId: componentId as ComponentId,
    config,
  })),
);

const financeKpis: ReadonlyArray<keyof typeof byKpi> = [
  "volume",
  "net-revenue",
  "cores",
];

describe("mobile deep-dive view configs", () => {
  it("exposes one view file per (kpi, component) with the matching component id", () => {
    for (const { label, componentId, config } of allViews) {
      expect(config.version).toBe("1.0.0");
      expect(config.cache).toEqual({ enabled: true, tags: ["default"] });
      expect(config.components).toHaveLength(1);
      expect(config.components[0].id).toBe(componentId);
      expect(label).toBeTruthy();
    }
  });

  it("uses only mobile deep-dive formatter paths", () => {
    for (const { config } of allViews) {
      for (const component of config.components) {
        expect(component.formatter).toMatch(
          /^mobile\/value-creation\/deep-dive\//,
        );
        expect(component.datasources.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the common mobile filters available", () => {
    for (const { config } of allViews) {
      const filters = config.filters?.default?.map((filter) => filter.name);
      expect(filters).toEqual(expect.arrayContaining(["country", "dt_end"]));
      expect(filters).toEqual(expect.arrayContaining(["period", "timeframe"]));
    }
  });

  describe("waterfall_filter wiring", () => {
    it("expose waterfall_filter at the view level", () => {
      for (const { kpi } of allViews) {
        const config = byKpi[kpi].waterfall;
        const filters = config.filters?.default?.map((filter) => filter.name);
        expect(filters).toContain("waterfall_filter");

        // Exactly one datasource (collapsed from the legacy 4-tab fan-out).
        expect(config.components[0].datasources).toHaveLength(1);
        const datasource = config.components[0].datasources[0];
        const waterfallFilter = datasource.filters?.find(
          (filter) => filter.name === "waterfall_filter",
        );
        expect(waterfallFilter).toBeUndefined();
      }
    });

    it("finance big-numbers/line-chart accept waterfall_filter from the request (SQL uses it)", () => {
      for (const kpi of financeKpis) {
        for (const componentId of ["big-numbers", "line-chart"] as const) {
          const config = byKpi[kpi][componentId];
          const filters = config.filters?.default?.map((filter) => filter.name);
          expect(filters).toContain("waterfall_filter");

          for (const datasource of config.components[0].datasources) {
            const waterfallFilter = datasource.filters?.find(
              (filter) => filter.name === "waterfall_filter",
            );
            expect(waterfallFilter).toBeUndefined();
          }
        }
      }
    });

    it("brand-power/market-share overtime do not declare waterfall_filter (SQL ignores it)", () => {
      for (const kpi of ["brand-power", "market-share"] as const) {
        for (const componentId of ["big-numbers", "line-chart"] as const) {
          const config = byKpi[kpi][componentId];
          const filters = config.filters?.default?.map((filter) => filter.name);
          expect(filters).not.toContain("waterfall_filter");

          for (const datasource of config.components[0].datasources) {
            const waterfallFilter = datasource.filters?.find(
              (filter) => filter.name === "waterfall_filter",
            );
            expect(waterfallFilter).toBeUndefined();
          }
        }
      }
    });
  });
});
