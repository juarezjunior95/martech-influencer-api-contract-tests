import {
  DirectionFormatParams,
  formatDirection,
} from "@common/utils/direction.utils";
import { isReverseDirection, getKpiTitle } from "@common/utils/portfolio.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Value Creation - Portfolio Performance - PL - Portfolio Handler
 * Handles the raw data from the Value Creation - Portfolio Performance - PL - Portfolio SQL query
 */
class PortfolioHandler extends BaseHandler {
  async handle(
    datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    return this.processDatasetData(defaultDataset);
  }

  /**
   * Private function to process dataset data
   * @param dataset - The dataset to be processed (defaultDataset)
   * @returns Processed dataset data
   */
  private processDatasetData(dataset: Dataset): DataItem[] {
    return dataset.data.map((item) => {
      const variationParams: DirectionFormatParams = {
        invert: isReverseDirection(String(item.kpi_name)),
      };

      const dir = (field: keyof typeof item) =>
        formatDirection(Number(item[field]), variationParams);

      return {
        kpi_title: getKpiTitle(String(item.kpi_name)),
        kpi_name: item.kpi_name,
        ac: item.ac,
        og_vs_ly: item.og_vs_ly,
        comp_og_vs_ly_direction: dir("og_vs_ly"),
        megabrands_direction: dir("megabrands_og_vs_ly"),
        expansion_direction: dir("expansion_og_vs_ly"),
        sustain_direction: dir("sustain_og_vs_ly"),
        tail_direction: dir("tail_og_vs_ly"),
        megabrands_ac: item.megabrands_ac,
        megabrands_og_vs_ly: item.megabrands_og_vs_ly,
        expansion_ac: item.expansion_ac,
        expansion_og_vs_ly: item.expansion_og_vs_ly,
        sustain_ac: item.sustain_ac,
        sustain_og_vs_ly: item.sustain_og_vs_ly,
        tail_ac: item.tail_ac,
        tail_og_vs_ly: item.tail_og_vs_ly,
      };
    });
  }
}

export const portfolioHandler = new PortfolioHandler();
