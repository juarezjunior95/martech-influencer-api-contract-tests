import { DataItem, Dataset } from "@domain/entities/datasource.entity";
import { IDatasourceHandler } from "@domain/interfaces/datasource-handler.interface";
export declare abstract class BaseHandler implements IDatasourceHandler {
    get name(): string;
    abstract handle(datasets: Dataset[], defaultDataset?: Dataset): DataItem[] | Promise<DataItem[]>;
}
