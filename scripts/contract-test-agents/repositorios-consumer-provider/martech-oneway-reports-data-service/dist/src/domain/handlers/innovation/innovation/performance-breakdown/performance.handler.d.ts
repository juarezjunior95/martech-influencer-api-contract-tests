import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class PerformanceHandler extends BaseHandler {
    private readonly CONTRIBUTION_MEASURE_UNIT;
    handle(datasets: Dataset[], _defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
}
export declare const performanceHandler: PerformanceHandler;
export {};
