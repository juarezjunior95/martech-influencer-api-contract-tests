export interface PeriodFormatParams {
    alwaysUseQuarter?: boolean;
    useCumulativeQuarter?: boolean;
    includeYear?: boolean;
    yearFormat?: "full" | "short";
}
export declare function formatPeriod(dateIni: string, dateEnd: string, params?: PeriodFormatParams): string;
export declare function appendYearIfRequested(base: string, endDate: Date, options?: {
    includeYear?: boolean;
    yearFormat?: "full" | "short";
}): string;
export declare function areDatesInSameQuarter(date1: string, date2: string): boolean;
export declare function normalizePeriodFilterValue(value: string | number | boolean): string;
