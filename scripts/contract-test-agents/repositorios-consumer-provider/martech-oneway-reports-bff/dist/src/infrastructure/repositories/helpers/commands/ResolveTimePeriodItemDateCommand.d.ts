type TimePeriodItem = {
    dt_end?: string | null;
    year?: number | null;
    month?: number | null;
};
export declare class ResolveTimePeriodItemDateCommand {
    readonly name = "resolveTimePeriodItemDate";
    execute(item: TimePeriodItem | null | undefined): string;
}
export {};
