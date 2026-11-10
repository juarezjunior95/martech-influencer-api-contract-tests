export declare class FormatTimePeriodLabelCommand {
    readonly name = "formatTimePeriodLabel";
    private readonly formatMonth;
    private readonly formatQuarter;
    execute(dateString: string | null | undefined, periodType: string | null | undefined): string;
    private unwrapFormatted;
}
