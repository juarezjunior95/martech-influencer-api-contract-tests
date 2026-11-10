import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class StrategicInnovationPillarsHandler extends BaseHandler {
    handle(datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
}
export declare const strategicInnovationPillarsHandler: StrategicInnovationPillarsHandler;
export {};
