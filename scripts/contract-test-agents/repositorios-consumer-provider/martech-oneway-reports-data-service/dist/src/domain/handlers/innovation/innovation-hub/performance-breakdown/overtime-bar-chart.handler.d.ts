import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class OvertimeBarChartHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private mapRow;
}
export declare const overtimeBarChartHandler: OvertimeBarChartHandler;
export {};
