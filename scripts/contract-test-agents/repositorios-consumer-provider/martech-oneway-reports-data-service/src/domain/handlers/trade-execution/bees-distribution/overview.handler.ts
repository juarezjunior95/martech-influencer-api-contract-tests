import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";

class BeesDistributionOverview extends BaseHandler {
  private static readonly KPI_TITLE = {
    "sku per poc": {
      title: "SKU per POC",
      measure: "[ # ]",
    },
    "bees buyers": {
      title: "Total Buyers",
      measure: "[ Mio ]",
    },
    distribution: {
      title: "Total Distribution",
      measure: "[ Mio ]",
    },
  };

  // Mapping the field per chart that should be used to calculate the KPI performance.
  private static readonly KPI_PERFORMANCE_CHART_MAP = {
    "bar-chart": "ac_vs_ly",
    "card-chart": "delta_pct",
    "line-chart": "ly",
  };

  async handle(
    datasets: Dataset[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    // Use defaultDataset directly as it's already the found dataset
    return this.processDatasetData(datasets);
  }

  /**
   * Get the kpi config (title and measure) from the dataItems array.
   * If the kpi_name is not found, return the kpi_name as the title with empty measure.
   * @param dataItems
   * @returns KPI Config with title and measure
   */
  private getKpiConfig(dataItems: DataItem[]): {
    title: string;
    measure: string;
  } {
    const itemWithKpi = dataItems.find((item) => item.kpi_name != null);
    const kpiName = (itemWithKpi?.kpi_name ?? "") as string;

    return (
      BeesDistributionOverview.KPI_TITLE[kpiName] ?? {
        title: kpiName,
        measure: "",
      }
    );
  }

  private processKpiPerformance(value: string) {
    if (value == null) {
      return "";
    }

    return formatDirection(value, {
      up: "positive",
      down: "negative",
    });
  }

  private processDatasetData(datasets: Dataset[]): DataItem[] {
    return datasets.map((dataset) => {
      const dataItems = dataset.data;
      const performanceField =
        BeesDistributionOverview.KPI_PERFORMANCE_CHART_MAP[dataset.id];
      const kpiConfig = this.getKpiConfig(dataItems);

      return {
        id: dataset.id,
        config:
          dataset?.data && dataset.data.length > 0
            ? {
                kpi_title: kpiConfig.title,
                kpi_unit_of_measure: kpiConfig.measure,
                kpi_comparison_unit_of_measure: "%",
              }
            : {},
        data: dataItems.map((item) => ({
          ...item,
          performance: performanceField
            ? this.processKpiPerformance(item[performanceField] as string)
            : "",
        })),
      };
    });
  }
}

export const beesDistributionOverviewHandler = new BeesDistributionOverview();
