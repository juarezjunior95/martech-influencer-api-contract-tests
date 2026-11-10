export declare class FormatPeriodRangeCommand {
    readonly name = "formatPeriodRange";
    execute(startDate: string | null | undefined, endDate: string | null | undefined): string;
    private isDateLike;
    private monthLabel;
}
