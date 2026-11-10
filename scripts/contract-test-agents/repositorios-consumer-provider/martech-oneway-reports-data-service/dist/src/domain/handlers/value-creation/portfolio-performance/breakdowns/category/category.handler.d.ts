import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class BreakdownsCategoryHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private getValue;
    private formatMonthLabel;
}
export declare const breakdownsCategoryHandler: BreakdownsCategoryHandler;
export {};
