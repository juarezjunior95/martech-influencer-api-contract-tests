import { ViewConfig } from "../../../../../entities/view.entity";
export interface BrandAnalysisOverviewViewParams {
    id: string;
    formatter: string;
}
export declare const createBrandAnalysisOverviewView: ({ id, formatter, }: BrandAnalysisOverviewViewParams) => ViewConfig;
