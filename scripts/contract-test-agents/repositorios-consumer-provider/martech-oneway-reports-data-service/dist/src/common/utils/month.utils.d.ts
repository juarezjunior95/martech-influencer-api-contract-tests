export interface MonthFormatParams {
    includeYear?: boolean;
    usePreviousYear?: boolean;
    yearFormat?: "full" | "short";
}
export declare function formatMonth(dtEnd: string, params?: MonthFormatParams): string;
