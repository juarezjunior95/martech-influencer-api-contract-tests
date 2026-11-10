export interface ZoneRecord {
    id: string;
    title: string;
    scope: string | null;
    quick_filter_label: string;
}
export type ZonesRegistry = Record<string, ZoneRecord>;
export declare const zonesRegistry: ZonesRegistry;
