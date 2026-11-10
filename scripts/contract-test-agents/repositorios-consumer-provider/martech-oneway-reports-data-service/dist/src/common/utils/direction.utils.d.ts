export interface DirectionFormatParams {
    up?: string;
    down?: string;
    center?: string;
    usingCenter?: boolean;
    invert?: boolean;
    positiveZero?: boolean;
}
export declare function formatDirection(value: string | number, params?: DirectionFormatParams): string;
