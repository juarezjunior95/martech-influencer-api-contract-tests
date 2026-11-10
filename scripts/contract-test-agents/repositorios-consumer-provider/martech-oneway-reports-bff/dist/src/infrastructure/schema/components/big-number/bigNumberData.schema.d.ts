export declare const bigNumberDataSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        audience: {
            type: string;
            additionalProperties: boolean;
            properties: {
                gender: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                age: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                incomeBracket: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
        bigNumber: {
            type: string;
            additionalProperties: boolean;
            properties: {
                value: {
                    type: string[];
                    description: string;
                };
                measure: {
                    type: string;
                    description: string;
                };
                color: {
                    type: string;
                    pattern: string;
                    description: string;
                };
                trend: {
                    type: string;
                    enum: readonly ["positive", "negative"];
                    description: string;
                };
            };
            description: string;
        };
        comparison: {
            type: string;
            additionalProperties: boolean;
            properties: {
                number: {
                    description: string;
                    type: string;
                    additionalProperties: boolean;
                    properties: {
                        value: {
                            type: string[];
                            description: string;
                        };
                        measure: {
                            type: string;
                            description: string;
                        };
                        color: {
                            type: string;
                            pattern: string;
                            description: string;
                        };
                        trend: {
                            type: string;
                            enum: readonly ["positive", "negative"];
                            description: string;
                        };
                    };
                };
                label: {
                    type: string;
                    description: string;
                };
                value: {
                    type: string;
                    description: string;
                };
            };
            description: string;
        };
        secondaryInfo: {
            type: string;
            additionalProperties: boolean;
            properties: {
                value: {
                    type: string;
                    description: string;
                };
                measure: {
                    type: string;
                    description: string;
                };
                label: {
                    type: string;
                    description: string;
                };
                period: {
                    type: string;
                    additionalProperties: boolean;
                    properties: {
                        label: {
                            type: string;
                            description: string;
                        };
                        value: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
            };
            description: string;
        };
    };
    description: string;
};
export interface BigNumberCardSchemaOptions {
    idEnum?: readonly string[];
    requiredFields?: string[];
    additionalProperties?: Record<string, unknown>;
    description?: string;
    dataFieldName?: string;
    minItems?: number;
    maxItems?: number;
    includeHasDeepDive?: boolean;
}
export declare const createBigNumberCardSchema: (options?: BigNumberCardSchemaOptions) => {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        [x: string]: unknown;
    };
    description: string;
};
export declare const createBigNumberArraySchema: (cardSchema: ReturnType<typeof createBigNumberCardSchema>, options?: {
    minItems?: number;
    maxItems?: number;
    description?: string;
}) => Record<string, unknown>;
