import { DataItem, Dataset } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class PortfolioPerformanceHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
}
export declare const portfolioPerformanceHandler: PortfolioPerformanceHandler;
export {};
