export declare class FormatYtdPeriodCommand {
    readonly name = "formatYtdPeriod";
    execute(dateString: string | null | undefined, dateLocation?: "prefix" | "suffix"): string | undefined;
}
