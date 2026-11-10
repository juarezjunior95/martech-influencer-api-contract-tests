export declare class FormatPeriodChipCommand {
    readonly name = "formatPeriodChip";
    private readonly month;
    private readonly quarter;
    private readonly range;
    execute(startDate: string | null | undefined, endDate: string | null | undefined, period: string | null | undefined, isQuarter?: boolean): string;
}
