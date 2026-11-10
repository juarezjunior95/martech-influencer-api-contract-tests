import { Dataset, DataType } from "@domain/entities/common/base-config.entity";
export interface IDatasourceHandler {
    readonly name: string;
    handle(datasets: Dataset[], defaultDataset?: Dataset): DataType | Promise<DataType>;
}
