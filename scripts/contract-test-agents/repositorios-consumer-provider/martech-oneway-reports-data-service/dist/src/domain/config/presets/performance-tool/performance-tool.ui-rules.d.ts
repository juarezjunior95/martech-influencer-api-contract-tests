export declare const VALUE_ALL = "All";
export declare const SOURCE_GLOBAL_BRANDS = "@global_brands";
export declare function getGlobalDefault(kpi: string, classification: string, gl: string | null): string | null;
export declare function getGlRules(gl: string): Record<string, unknown>;
export declare function isGlClassificationAvailable(gl: string, classification: string): boolean;
