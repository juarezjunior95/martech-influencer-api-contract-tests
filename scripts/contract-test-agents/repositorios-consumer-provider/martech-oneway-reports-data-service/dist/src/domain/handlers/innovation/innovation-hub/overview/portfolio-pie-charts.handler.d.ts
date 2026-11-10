import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class PortfolioPieChartsHandler extends BaseHandler {
    handle(_datasets: Dataset[], defaultDataset?: Dataset): Promise<DataItem[]>;
}
export declare const portfolioPieChartsHandler: PortfolioPieChartsHandler;
export {};
