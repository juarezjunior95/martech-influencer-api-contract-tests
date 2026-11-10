import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

const CHART_ID_MAP: Record<string, string> = {
  "Innovation Pillar": "innovationPillar",
  Innovation: "innovationPillar",
  Megabrands: "megabrandFramework",
  "Liquid Type": "liquidType",
};

const normalizeGeo = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value);
  return normalized === "ALL" ? "ABI" : normalized;
};

/**
 * Innovation Hub - Overview - Portfolio Pie Charts Handler
 * Maps lake donut-chart rows to the snake_case contract consumed by the BFF formatter.
 */
class PortfolioPieChartsHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset?.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const lakeChart = item.CHART ?? item.chart;
      const chartId = CHART_ID_MAP[String(lakeChart)] ?? String(lakeChart);

      return {
        chart: chartId,
        item: item.ITEM ?? item.item,
        metric: item.METRIC ?? item.metric,
        percentage: item.PERCENTAGE ?? item.percentage,
        country: normalizeGeo(
          item.COUNTRY_ISO_CODE_3 ?? item.country_iso_code_3 ?? item.country,
        ),
        zone: normalizeGeo(item.ABI_ZONE ?? item.abi_zone ?? item.zone),
      };
    });
  }
}

export const portfolioPieChartsHandler = new PortfolioPieChartsHandler();
