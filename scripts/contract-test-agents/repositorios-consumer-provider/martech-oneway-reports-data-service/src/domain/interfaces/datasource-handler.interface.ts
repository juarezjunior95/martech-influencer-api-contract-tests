import { Dataset, DataType } from "@domain/entities/common/base-config.entity";

/**
 * Handler Interface
 * Processes dataset data and returns transformed items
 */
export interface IDatasourceHandler {
  /**
   * Handler name
   */
  readonly name: string;

  /**
   * Handles dataset processing
   * @param datasets - Array of datasets to be processed
   * @param defaultDataset - Default dataset to use as scope when available
   * @returns Processed data items or promise of data items
   */
  handle(
    datasets: Dataset[],
    defaultDataset?: Dataset,
  ): DataType | Promise<DataType>;
}
