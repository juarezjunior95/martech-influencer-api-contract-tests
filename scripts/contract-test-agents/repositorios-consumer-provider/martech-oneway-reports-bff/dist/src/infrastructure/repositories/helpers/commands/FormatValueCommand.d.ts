export declare class FormatValueCommand {
    readonly name = "formatValue";
    execute(value: number | string | null | undefined, returnType?: "number" | "string"): number | string;
}
