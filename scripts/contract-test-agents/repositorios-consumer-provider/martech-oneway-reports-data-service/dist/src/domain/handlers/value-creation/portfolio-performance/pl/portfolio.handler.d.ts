import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class PortfolioHandler extends BaseHandler {
    handle(datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
    private processDatasetData;
}
export declare const portfolioHandler: PortfolioHandler;
export {};
