import { DataItem } from "@domain/entities/datasource.entity";
export declare const VALID_OVERTIME_KPIS: Set<string>;
export declare const pickField: (item: Record<string, unknown>, ...keys: string[]) => unknown;
export declare const toNumber: (value: unknown) => number | undefined;
export declare const normalizeMonth: (value: unknown) => number | undefined;
export declare const normalizeKpiName: (value: unknown) => string | undefined;
export declare const variationDirection: (value: number | undefined) => string | undefined;
export declare const hasInvalidOvertimeKpiRows: (rows: DataItem[]) => boolean;
