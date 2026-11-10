import { BaseHandler } from "@domain/handlers/handler.base";
import { DataItem, Dataset } from "@domain/entities/datasource.entity";
declare class ByZoneHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
}
export declare const byZoneHandler: ByZoneHandler;
export {};
