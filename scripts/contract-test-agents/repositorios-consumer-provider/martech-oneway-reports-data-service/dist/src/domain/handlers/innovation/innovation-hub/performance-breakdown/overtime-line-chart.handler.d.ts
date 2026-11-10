import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class OvertimeLineChartHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private mapRow;
}
export declare const overtimeLineChartHandler: OvertimeLineChartHandler;
export {};
