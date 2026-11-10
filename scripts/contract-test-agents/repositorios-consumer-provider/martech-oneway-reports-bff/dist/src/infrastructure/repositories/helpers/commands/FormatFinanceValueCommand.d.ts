export declare class FormatFinanceValueCommand {
    readonly name = "formatFinanceValue";
    execute(value: number | string | null | undefined): string;
    private formatNumber;
}
