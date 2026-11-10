import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class WaterfallHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
    private resolveLabel;
    private resolveImage;
    private resolveTotalImage;
    private resolveLabelValue;
    private resolveBadgeFlag;
}
export declare const waterfallHandler: WaterfallHandler;
export {};
