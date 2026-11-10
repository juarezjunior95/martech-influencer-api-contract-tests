import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class BrandsHandler extends BaseHandler {
    handle(datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
}
export declare const brandsHandler: BrandsHandler;
export {};
