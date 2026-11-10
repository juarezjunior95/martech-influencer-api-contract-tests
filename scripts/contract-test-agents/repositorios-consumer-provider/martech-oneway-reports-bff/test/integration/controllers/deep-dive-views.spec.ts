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

describe("mobile deep-dive views integration contract", () => {
  const views: Array<{
    expectedId: "big-numbers" | "line-chart" | "waterfall";
    config: {
      components: Array<{
        id: string;
        formatter: string;
        datasources: unknown[];
      }>;
    };
  }> = [
    { expectedId: "big-numbers", config: volumeBigNumbers },
    { expectedId: "line-chart", config: volumeLineChart },
    { expectedId: "waterfall", config: volumeWaterfall },
    { expectedId: "big-numbers", config: netRevenueBigNumbers },
    { expectedId: "line-chart", config: netRevenueLineChart },
    { expectedId: "waterfall", config: netRevenueWaterfall },
    { expectedId: "big-numbers", config: coresBigNumbers },
    { expectedId: "line-chart", config: coresLineChart },
    { expectedId: "waterfall", config: coresWaterfall },
    { expectedId: "big-numbers", config: brandPowerBigNumbers },
    { expectedId: "line-chart", config: brandPowerLineChart },
    { expectedId: "waterfall", config: brandPowerWaterfall },
    { expectedId: "big-numbers", config: marketShareBigNumbers },
    { expectedId: "line-chart", config: marketShareLineChart },
    { expectedId: "waterfall", config: marketShareWaterfall },
  ];

  it("exposes exactly one component per view, matching the expected id", () => {
    for (const { expectedId, config } of views) {
      expect(config.components).toHaveLength(1);
      expect(config.components[0].id).toBe(expectedId);
    }
  });

  it("uses reports BFF datasource-backed mobile formatters", () => {
    for (const { config } of views) {
      const component = config.components[0];
      expect(component.formatter).toMatch(
        /^mobile\/value-creation\/deep-dive\//,
      );
      expect(component.datasources.length).toBeGreaterThan(0);
    }
  });
});
