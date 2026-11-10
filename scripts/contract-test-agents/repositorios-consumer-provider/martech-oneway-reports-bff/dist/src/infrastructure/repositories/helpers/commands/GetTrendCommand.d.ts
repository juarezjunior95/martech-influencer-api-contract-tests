export declare class GetTrendCommand {
    readonly name = "getTrend";
    execute(value: number | string | null | undefined, direction: string | null | undefined): "positive" | "negative";
}
