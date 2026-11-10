export declare class FormatSignedValueCommand {
    readonly name = "formatSignedValue";
    private readonly formatValueCommand;
    execute(value: number | string | null | undefined): string;
}
