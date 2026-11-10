export declare class ToNumberOrUndefinedCommand {
    readonly name = "toNumberOrUndefined";
    private static readonly NUMERIC_REGEX;
    execute(value: unknown): number | undefined;
}
