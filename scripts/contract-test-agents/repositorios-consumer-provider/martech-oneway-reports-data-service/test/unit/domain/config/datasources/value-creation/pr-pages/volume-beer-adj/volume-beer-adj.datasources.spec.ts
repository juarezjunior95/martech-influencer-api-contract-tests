import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import { mustWinMarketsHandler } from "@domain/handlers/value-creation/pr-pages/volume/must-win-markets.handler";
import { propertiesTableHandler } from "@domain/handlers/value-creation/pr-pages/volume/segments-gb/table.handler";

import bigNumbers from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/big-numbers.datasource";
import barChart from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/brands-by-segments/bar-chart.datasource";
import top15Countries from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/brands-by-segments/top-15-countries.datasource";
import divByBrands from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/div-by-brands.datasource";
import prioritiesTable from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/global/table/priorities.datasource";
import growthLevers from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/growth-levers.datasource";
import lineChart from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/line-chart.datasource";
import mustWinMarkets from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/must-win-markets.datasource";
import portfolio from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/portfolio.datasource";
import segmentsGbDivByBrands from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/segments-gb/div-by-brands.datasource";
import segmentsGbMtdByCountry from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/segments-gb/mtd-by-country.datasource";
import segmentsGbTable from "@domain/config/datasources/value-creation/pr-pages/volume-beer-adj/segments-gb/table.datasource";

function assertDeltalakeQueryDataset(
  config: DatasourceConfig,
  datasetId: string,
  query: string,
  filterNames: string[],
) {
  expect(config.datasets).toHaveLength(1);
  expect(config.datasets[0].id).toBe(datasetId);
  const dsConfig = config.datasets[0].config;
  expect(dsConfig.query).toBe(query);
  expect(dsConfig.executionType).toBe(DeltalakeExecutionType.query);
  expect(dsConfig.type).toBe(RepositoryType.deltalake);
  expect(config.filters?.map((f) => f.name)).toEqual(filterNames);
  config.filters?.forEach((f) => {
    expect(f.required).toBe(true);
  });
}

describe("PR Pages volume-beer-adj datasource configs", () => {
  it("big-numbers", () => {
    assertDeltalakeQueryDataset(
      bigNumbers,
      "big-numbers",
      "value-creation/pr-pages/volume-beer-adj/big-numbers",
      [
        "dt_end",
        "growth_lever",
        "page_filter",
        "brand",
        "sub_brand",
        "zone",
        "country",
        "waterfall_filter",
        "kpi",
      ],
    );
    expect(bigNumbers.entityClass).toBe(KpiEntity);
    expect(bigNumbers.handler).toBeUndefined();
  });

  it("line-chart", () => {
    assertDeltalakeQueryDataset(
      lineChart,
      "line-chart",
      "value-creation/pr-pages/volume-beer-adj/line-chart",
      [
        "kpi",
        "dt_end",
        "period_type",
        "growth_lever",
        "brand",
        "sub_brand",
        "country",
        "zone",
        "page_filter",
        "waterfall_filter",
      ],
    );
    expect(lineChart.entityClass).toBe(KpiEntity);
  });

  it("growth-levers", () => {
    assertDeltalakeQueryDataset(
      growthLevers,
      "growth-levers",
      "value-creation/pr-pages/volume-beer-adj/growth-levers",
      ["dt_end", "page_type", "country"],
    );
    expect(growthLevers.entityClass).toBe(KpiEntity);
  });

  it("portfolio", () => {
    assertDeltalakeQueryDataset(
      portfolio,
      "portfolio",
      "value-creation/pr-pages/volume-beer-adj/portfolio",
      ["dt_end", "page_type", "country", "kpi"],
    );
    expect(portfolio.entityClass).toBe(KpiEntity);
  });

  it("must-win-markets", () => {
    assertDeltalakeQueryDataset(
      mustWinMarkets,
      "must-win-markets",
      "value-creation/pr-pages/volume-beer-adj/must-win-markets",
      ["dt_end", "country", "page_type", "kpi"],
    );
    expect(mustWinMarkets.handler).toBe(mustWinMarketsHandler);
    expect(mustWinMarkets.entityClass).toBeUndefined();
  });

  it("div-by-brands injects procedure environment by default", () => {
    assertDeltalakeQueryDataset(
      divByBrands,
      "div-by-brands",
      "value-creation/pr-pages/volume-beer-adj/div-by-brands",
      ["dt_end", "country", "period_type", "filter_type"],
    );
    expect(divByBrands.datasets[0].config.injectProcedureEnvironment).toBe(
      true,
    );
    expect(divByBrands.entityClass).toBe(KpiEntity);
  });

  it("brands-by-segments bar-chart", () => {
    assertDeltalakeQueryDataset(
      barChart,
      "bar-chart",
      "value-creation/pr-pages/volume-beer-adj/brands-by-segments/bar-chart",
      ["dt_end", "page_filter", "period_type", "kpi"],
    );
    expect(barChart.entityClass).toBe(KpiEntity);
  });

  it("brands-by-segments top-15-countries", () => {
    assertDeltalakeQueryDataset(
      top15Countries,
      "top-15-countries",
      "value-creation/pr-pages/volume-beer-adj/brands-by-segments/top-15-countries",
      ["dt_end", "page_type", "period", "kpi"],
    );
    expect(top15Countries.entityClass).toBe(KpiEntity);
  });

  it("segments-gb div-by-brands", () => {
    assertDeltalakeQueryDataset(
      segmentsGbDivByBrands,
      "div-by-brands",
      "value-creation/pr-pages/volume-beer-adj/segments-gb/div-by-brands",
      ["dt_end", "page_type", "period"],
    );
    expect(segmentsGbDivByBrands.entityClass).toBe(KpiEntity);
  });

  it("segments-gb mtd-by-country (reuses top-15-countries query)", () => {
    assertDeltalakeQueryDataset(
      segmentsGbMtdByCountry,
      "line-chart",
      "value-creation/pr-pages/volume-beer-adj/brands-by-segments/top-15-countries",
      ["dt_end", "page_type", "period"],
    );
    expect(segmentsGbMtdByCountry.entityClass).toBe(KpiEntity);
  });

  it("segments-gb table", () => {
    assertDeltalakeQueryDataset(
      segmentsGbTable,
      "segments-gb_table",
      "value-creation/pr-pages/volume-beer-adj/segments-gb/table",
      ["dt_end", "page_type"],
    );
    expect(segmentsGbTable.handler).toBe(propertiesTableHandler);
    expect(segmentsGbTable.entityClass).toBe(KpiEntity);
  });

  it("global table priorities", () => {
    assertDeltalakeQueryDataset(
      prioritiesTable,
      "priorities_table",
      "value-creation/pr-pages/volume-beer-adj/global/table/priorities",
      ["dt_end"],
    );
    expect(prioritiesTable.entityClass).toBe(KpiEntity);
  });
});
