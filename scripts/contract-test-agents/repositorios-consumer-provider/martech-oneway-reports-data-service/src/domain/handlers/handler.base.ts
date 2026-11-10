import { DataItem, Dataset } from "@domain/entities/datasource.entity";
import { IDatasourceHandler } from "@domain/interfaces/datasource-handler.interface";

export abstract class BaseHandler implements IDatasourceHandler {
  /**
   * Returns the class name automatically
   */
  get name(): string {
    return this.constructor.name;
  }

  /**
   * @inheritdoc
   */
  abstract handle(
    datasets: Dataset[],
    defaultDataset?: Dataset,
  ): DataItem[] | Promise<DataItem[]>;
}
