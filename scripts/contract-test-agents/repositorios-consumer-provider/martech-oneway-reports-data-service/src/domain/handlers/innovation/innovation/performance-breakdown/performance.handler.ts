import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Innovation - Innovation - Performance & Breakdown - Performance Handler
 * Handles the raw data from the Innovation - Innovation - Performance & Breakdown - Performance & SQL query
 */
class PerformanceHandler extends BaseHandler {
  private readonly CONTRIBUTION_MEASURE_UNIT = {
    innovation_volume: "%",
    innovation_nr: "%",
    innovation_maco: "%",
  };

  async handle(
    datasets: Dataset[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    return datasets.map((dataset) => {
      return {
        id: dataset.id,
        data: this.processDatasetData(dataset),
      } as DataItem;
    });
  }

  /**
   * Private function to process dataset data
   * @param dataset - The dataset to be processed (defaultDataset)
   * @returns Processed dataset data
   */
  private processDatasetData(dataset: Dataset): DataItem[] {
    return dataset.data.map((item) => {
      const variationDirectionContribution = formatDirection(
        Number(item.CONTRIBUTION),
        {
          positiveZero: true,
        },
      );
      const variationDirectionTooltip = formatDirection(Number(item.TOOLTIP), {
        positiveZero: true,
      });
      const contributionMeasure =
        this.CONTRIBUTION_MEASURE_UNIT[
          item.KPI_NAME as keyof typeof this.CONTRIBUTION_MEASURE_UNIT
        ] ?? "";

      return {
        kpi_name: item.KPI_NAME,
        dt_ini: item.DT_INI,
        dt_end: item.DT_END,
        country: item.COUNTRY_ISO_CODE_3,

        label: item.LABEL,

        value: item.VALUE,
        tooltip: item.TOOLTIP,
        tooltip_direction: variationDirectionTooltip,

        contribution: item.CONTRIBUTION,
        contribution_direction: variationDirectionContribution,
        contribution_measure: contributionMeasure,
      };
    });
  }
}

export const performanceHandler = new PerformanceHandler();
