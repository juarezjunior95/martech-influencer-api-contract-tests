import { bigNumberDataSchema } from "./bigNumberData.schema";
export declare const consumerBehaviorCardSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        [x: string]: unknown;
    };
    description: string;
};
export declare const consumerBehaviorBigNumbersArraySchema: Record<string, unknown>;
export declare const consumerBehaviorBigNumbersSchema: {
    oneOf: Record<string, unknown>[];
    description: string;
};
export { bigNumberDataSchema as consumerBehaviorBigNumberDataSchema };
export { bigNumberDataSchema as consumerBehaviorBigNumberDataItemSchema };
