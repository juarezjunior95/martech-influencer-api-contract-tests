import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
declare class BeesDistributionOverview extends BaseHandler {
    private static readonly KPI_TITLE;
    private static readonly KPI_PERFORMANCE_CHART_MAP;
    handle(datasets: Dataset[], _defaultDataset?: Dataset): Promise<DataItem[]>;
    private getKpiConfig;
    private processKpiPerformance;
    private processDatasetData;
}
export declare const beesDistributionOverviewHandler: BeesDistributionOverview;
export {};
