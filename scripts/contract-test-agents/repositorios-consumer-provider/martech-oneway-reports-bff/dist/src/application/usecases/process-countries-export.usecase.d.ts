import { IProcessViewUseCase } from "../interfaces/process-view.usecase.interface";
import { FilterSet, ProcessedViewResult } from "../../domain/entities/view.entity";
import type { PeriodType } from "../../domain/types/period-type";
export interface CountryExportData {
    overview: ProcessedViewResult;
    overviewMegabrands: ProcessedViewResult;
    abiBrandBreakdown: ProcessedViewResult;
    competitorBrandBreakdown: ProcessedViewResult;
    summaryPower: ProcessedViewResult;
}
export interface CountriesExportResult {
    [period: string]: Record<string, CountryExportData>;
}
export declare class ProcessCountriesExportUseCase {
    private readonly processViewUseCase;
    private readonly logger;
    private static readonly VIEWS;
    constructor(processViewUseCase: IProcessViewUseCase);
    execute(countries: string[], filterSets: FilterSet[], periods: PeriodType[]): Promise<CountriesExportResult>;
    private processCountry;
}
