import { bigNumberDataSchema } from "./bigNumberData.schema";
export declare const categoryHomeSparkLineCardSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        [x: string]: unknown;
    };
    description: string;
};
export declare const categoryHomeSparkLineArraySchema: Record<string, unknown>;
export declare const categoryHomeSparkLineSchema: {
    oneOf: Record<string, unknown>[];
    description: string;
};
export { bigNumberDataSchema as categoryHomeSparkLineBigNumberDataSchema };
export { bigNumberDataSchema as categoryHomeSparkLineBigNumberDataItemSchema };
