import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import bigNumbersConfig from "@domain/config/datasources/value-creation/commercial-results/big-numbers.datasource";
import lineChartConfig from "@domain/config/datasources/value-creation/commercial-results/line-chart.datasource";
import barChartConfig from "@domain/config/datasources/value-creation/commercial-results/bar-chart.datasource";
import waterfallConfig from "@domain/config/datasources/value-creation/commercial-results/waterfall.datasource";
import netRevenueBigNumbersConfig from "@domain/config/datasources/value-creation/commercial-results/net-revenue/big-numbers.datasource";
import netRevenueLineChartConfig from "@domain/config/datasources/value-creation/commercial-results/net-revenue/line-chart.datasource";
import netRevenueBarChartConfig from "@domain/config/datasources/value-creation/commercial-results/net-revenue/bar-chart.datasource";
import netRevenueWaterfallConfig from "@domain/config/datasources/value-creation/commercial-results/net-revenue/waterfall.datasource";
import { buildFilterNames } from "@domain/config/common/filter-config.helpers";
import {
  COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
  COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES,
  COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES,
} from "@domain/config/presets/commercial-results/commercial-results.types";

const COMMON_DATASOURCE_CONFIGS: Array<{
  name: string;
  config: DatasourceConfig;
  expectedFilterNames: readonly string[];
  expectedFunctionId: string;
  legacyFunctionId?: string;
}> = [
  {
    name: "big-numbers",
    config: bigNumbersConfig,
    expectedFilterNames: COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
    expectedFunctionId:
      "7_value_creation_commercial-results_volume_big-numbers",
    legacyFunctionId: "7_value_creation_commercial-results_big-numbers",
  },
  {
    name: "line-chart",
    config: lineChartConfig,
    expectedFilterNames: COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
    expectedFunctionId: "7_value_creation_commercial-results_volume_line-chart",
    legacyFunctionId: "7_value_creation_commercial-results_line-chart",
  },
  {
    name: "bar-chart",
    config: barChartConfig,
    expectedFilterNames: COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
    expectedFunctionId: "7_value_creation_commercial-results_volume_bar-chart",
    legacyFunctionId: "7_value_creation_commercial-results_bar-chart",
  },
  {
    name: "waterfall",
    config: waterfallConfig,
    expectedFilterNames: buildFilterNames(
      COMMERCIAL_RESULTS_COMMON_FILTER_NAMES.filter((name) => name !== "zone"),
      COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES,
    ),
    expectedFunctionId: "7_value_creation_commercial-results_volume_waterfall",
    legacyFunctionId: "7_value_creation_commercial-results_waterfall",
  },
];

const NET_REVENUE_DATASOURCE_CONFIGS: Array<{
  name: string;
  config: DatasourceConfig;
  expectedFilterNames: readonly string[];
  expectedFunctionId: string;
  legacyFunctionId?: string;
}> = [
  {
    name: "net-revenue/big-numbers",
    config: netRevenueBigNumbersConfig,
    expectedFilterNames: COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES,
    expectedFunctionId:
      "7_value_creation_commercial-results_net-revenue_big-numbers",
  },
  {
    name: "net-revenue/line-chart",
    config: netRevenueLineChartConfig,
    expectedFilterNames: COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES,
    expectedFunctionId:
      "7_value_creation_commercial-results_net-revenue_line-chart",
  },
  {
    name: "net-revenue/bar-chart",
    config: netRevenueBarChartConfig,
    expectedFilterNames: COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES,
    expectedFunctionId:
      "7_value_creation_commercial-results_net-revenue_bar-chart",
  },
  {
    name: "net-revenue/waterfall",
    config: netRevenueWaterfallConfig,
    expectedFilterNames: buildFilterNames(
      COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES.filter(
        (name) => name !== "zone",
      ),
      COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES,
    ),
    expectedFunctionId:
      "7_value_creation_commercial-results_net-revenue_waterfall",
  },
];

function assertDatasourceContract(
  config: DatasourceConfig,
  expectedFilterNames: readonly string[],
  expectedFunctionId: string,
  legacyFunctionId?: string,
): void {
  expect(config.handler).toBeUndefined();
  expect(config.entityClass).toBe(KpiEntity);

  const filterNames = config.filters?.map((filter) => filter.name) ?? [];
  expect(filterNames).toEqual([...expectedFilterNames]);
  config.filters?.forEach((filter) => {
    expect(filter.required).toBe(true);
  });

  const procedure = config.datasets[0].config.procedure as string;
  expect(procedure).toContain(`'${expectedFunctionId}'`);
  if (legacyFunctionId) {
    expect(procedure).not.toContain(`'${legacyFunctionId}'`);
  }
  expectedFilterNames.forEach((name) => {
    expect(procedure).toContain(`:${name}`);
  });

  expect(procedure).toContain('"non_alc_beer": :non_alcoholic');
  expect(procedure).toContain('"portfolio": :portfolios');
  expect(procedure).not.toContain('"non_alcoholic": :non_alcoholic');
  expect(procedure).not.toContain('"portfolios": :portfolios');
}

describe("Commercial Results datasources — cross-datasource contract", () => {
  it.each([...COMMON_DATASOURCE_CONFIGS, ...NET_REVENUE_DATASOURCE_CONFIGS])(
    "$name aligns filters and procedure parameters with the shared contract",
    ({ config, expectedFilterNames, expectedFunctionId, legacyFunctionId }) => {
      assertDatasourceContract(
        config,
        expectedFilterNames,
        expectedFunctionId,
        legacyFunctionId,
      );
    },
  );

  it("waterfall excludes zone from common filters", () => {
    const filterNames = waterfallConfig.filters?.map((filter) => filter.name);
    expect(filterNames).not.toContain("zone");
    expect(filterNames).toContain("waterfall_filter");
    expect(filterNames).toContain("max_ranked");
  });

  it("Net Revenue datasources forward kpi=nr and use only NR statement ids", () => {
    NET_REVENUE_DATASOURCE_CONFIGS.forEach(({ config, expectedFunctionId }) => {
      const filterNames = config.filters?.map((filter) => filter.name) ?? [];
      const procedure = config.datasets[0].config.procedure as string;

      expect(filterNames).toContain("kpi");
      expect(procedure).toContain('"kpi": :kpi');
      expect(procedure).toContain(`'${expectedFunctionId}'`);
      expect(procedure).not.toContain(
        "7_value_creation_commercial-results_volume_",
      );
    });
  });

  it("Volume datasources preserve the default contract without a kpi marker", () => {
    COMMON_DATASOURCE_CONFIGS.forEach(({ config }) => {
      const filterNames = config.filters?.map((filter) => filter.name) ?? [];
      const procedure = config.datasets[0].config.procedure as string;

      expect(filterNames).not.toContain("kpi");
      expect(procedure).not.toContain('"kpi": :kpi');
    });
  });

  it("big-numbers, line-chart and bar-chart include zone and all extra filters", () => {
    const extraFilters = [
      "category",
      "non_alcoholic",
      "growth_levers",
      "beer_price_segment",
      "portfolios",
    ] as const;

    [bigNumbersConfig, lineChartConfig, barChartConfig].forEach((config) => {
      const filterNames = config.filters?.map((filter) => filter.name) ?? [];
      expect(filterNames).toContain("zone");
      extraFilters.forEach((name) => {
        expect(filterNames).toContain(name);
      });
    });
  });
});
