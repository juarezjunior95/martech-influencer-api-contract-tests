import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class BreakdownHandler extends BaseHandler {
    handle(datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
    private getValue;
}
export declare const breakdownHandler: BreakdownHandler;
export {};
