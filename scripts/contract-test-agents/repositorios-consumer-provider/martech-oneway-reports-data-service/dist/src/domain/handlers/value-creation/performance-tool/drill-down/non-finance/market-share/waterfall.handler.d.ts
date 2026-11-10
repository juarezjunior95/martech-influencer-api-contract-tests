import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class MarketShareWaterfallHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
    private resolveImage;
    private resolveBadge;
}
export declare const marketShareWaterfallHandler: MarketShareWaterfallHandler;
export {};
