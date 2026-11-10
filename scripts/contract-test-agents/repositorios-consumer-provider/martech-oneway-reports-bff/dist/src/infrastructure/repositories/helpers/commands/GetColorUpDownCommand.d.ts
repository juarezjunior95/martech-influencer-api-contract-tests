export type VariationRule = "standard" | "reverse";
export interface GetColorUpDownOptions {
    rule?: VariationRule;
    includeZero?: boolean;
    nonNumericColor?: string;
}
export declare class GetColorUpDownCommand {
    readonly name = "getColorUpDown";
    execute(value: number | string | null | undefined, up: string, down: string, options?: GetColorUpDownOptions): string | undefined;
}
