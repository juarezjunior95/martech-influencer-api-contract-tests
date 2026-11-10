import { BaseHandler } from "@domain/handlers/handler.base";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
declare class ByTrendOverTimePowerMixHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
}
export declare const byTrendOverTimePowerMixHandler: ByTrendOverTimePowerMixHandler;
export {};
