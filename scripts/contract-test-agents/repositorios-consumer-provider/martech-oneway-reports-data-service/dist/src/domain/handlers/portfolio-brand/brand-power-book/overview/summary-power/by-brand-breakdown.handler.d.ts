import { BaseHandler } from "@domain/handlers/handler.base";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
declare class ByBrandBreakdownHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
}
export declare const byBrandBreakdownHandler: ByBrandBreakdownHandler;
export {};
