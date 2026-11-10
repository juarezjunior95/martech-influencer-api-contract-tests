import { PeriodFormatParams } from "./period.utils";
export interface LabelFormatParams {
    dtIni: string;
    dtEnd: string;
    yearFormat?: "full" | "short";
    prefix?: string;
    suffix?: string;
    periodFormatParams?: PeriodFormatParams;
}
export declare function labelVsLq(params: LabelFormatParams): string;
export declare function labelVsLy(params: LabelFormatParams): string;
export declare function labelVsLyQuarter(params: LabelFormatParams): string;
export declare function labelRefresh(params: LabelFormatParams): string;
export declare function labelVsLyMonth(params: LabelFormatParams): string;
