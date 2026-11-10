export declare class GetIndexColorCommand {
    readonly name = "getIndexColor";
    readonly defaultColor: {
        color: string;
        background: string;
    };
    readonly upColor: {
        color: string;
        background: string;
    };
    readonly downColor: {
        color: string;
        background: string;
    };
    readonly tableColor: {
        color: string;
        background: string;
    };
    execute(value: number | string | null | undefined, isTable?: boolean): {
        color: string;
        background: string;
    };
}
