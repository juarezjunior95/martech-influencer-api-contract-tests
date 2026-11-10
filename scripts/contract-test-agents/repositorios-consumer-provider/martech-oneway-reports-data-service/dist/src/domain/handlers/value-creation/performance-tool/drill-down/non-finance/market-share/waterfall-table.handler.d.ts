import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class MarketShareWaterfallTableHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private normalizeRow;
    private resolveBrandKey;
    private isPeriodLabel;
    private isSummaryRow;
    private resolveSummaryCountryIso;
    private resolveImage;
    private resolveBadge;
    private applyCountrySuffixStrip;
}
export declare const marketShareWaterfallTableHandler: MarketShareWaterfallTableHandler;
export {};
