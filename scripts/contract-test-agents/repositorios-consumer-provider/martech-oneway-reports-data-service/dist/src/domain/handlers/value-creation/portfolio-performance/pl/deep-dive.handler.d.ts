import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class DeepDiveHandler extends BaseHandler {
    handle(datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
}
export declare const deepDiveHandler: DeepDiveHandler;
export {};
