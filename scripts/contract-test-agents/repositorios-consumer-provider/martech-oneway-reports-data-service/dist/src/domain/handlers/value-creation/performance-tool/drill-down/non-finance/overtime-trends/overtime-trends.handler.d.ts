import { BaseHandler } from "@domain/handlers/handler.base";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
declare class PerformanceToolByOverTimeTrendsHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
}
export declare const performanceToolByOverTimeTrendsHandler: PerformanceToolByOverTimeTrendsHandler;
export {};
