import { IProcessViewUseCase } from "../interfaces/process-view.usecase.interface";
import { FilterSet, ProcessedViewResult } from "../../domain/entities/view.entity";
import type { PeriodType } from "../../domain/types/period-type";
export interface CategoryExportData {
    zonePerformance: ProcessedViewResult;
    bigNumbers: ProcessedViewResult;
    maturityPerformance: ProcessedViewResult;
    zonePerformanceDetails: ProcessedViewResult;
    topCountryContribution?: ProcessedViewResult;
    trendPowerEvolution?: ProcessedViewResult;
}
export declare class ProcessPowerBookExportUseCase {
    private readonly processViewUseCase;
    private readonly logger;
    private static readonly VIEWS;
    private static readonly EVOLUTION_CATEGORIES;
    constructor(processViewUseCase: IProcessViewUseCase);
    execute(categories: string[], filterSets: FilterSet[], period: PeriodType): Promise<Record<string, CategoryExportData>>;
    private processCategory;
}
