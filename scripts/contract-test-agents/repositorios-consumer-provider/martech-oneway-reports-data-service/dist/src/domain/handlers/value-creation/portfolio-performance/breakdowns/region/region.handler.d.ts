import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class RegionHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private getValue;
    private getDirection;
    private formatMonthLabel;
}
export declare const regionHandler: RegionHandler;
export {};
