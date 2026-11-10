export declare class FormatFyPeriodCommand {
    readonly name = "formatFyPeriod";
    execute(dateString: string | null | undefined, dateLocation?: "prefix" | "suffix"): string | undefined;
}
