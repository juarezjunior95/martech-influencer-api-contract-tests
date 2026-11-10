import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class BigNumbersHandler extends BaseHandler {
    private readonly MEASURE_KPIS;
    handle(datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
}
export declare const bigNumbersHandler: BigNumbersHandler;
export {};
