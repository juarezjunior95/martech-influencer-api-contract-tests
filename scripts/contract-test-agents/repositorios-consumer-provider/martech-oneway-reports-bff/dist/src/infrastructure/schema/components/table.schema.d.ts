export declare const tableHeaderItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        id: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        title: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
    };
};
export declare const tableHeaderSchema: {
    type: string;
    minItems: number;
    items: {
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
            id: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
            };
            title: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
            };
        };
    };
    description: string;
};
export declare const variationSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        unitOfMeasure: {
            type: string;
            enum: readonly ["pp", "%", "hl", "number"];
            description: string;
        };
        variationDirection: {
            type: string;
            pattern: string;
            description: string;
        };
        value: {
            type: string;
            description: string;
        };
    };
};
export declare const tableCellValueSchema: {
    type: string;
    required: string[];
    properties: {
        value: {
            oneOf: {
                type: string;
            }[];
            description: string;
        };
    };
};
export declare const tableCellTypeSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        value: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
    };
};
export declare const tableRowsSchema: {
    type: string;
    items: {
        type: string;
        description: string;
        items: {
            type: string;
            description: string;
        };
    };
    description: string;
};
export declare const tableDataSchema: {
    type: string;
    required: string[];
    properties: {
        header: {
            type: string;
            minItems: number;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    id: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                    title: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                };
            };
            description: string;
        };
        rows: {
            type: string;
            items: {
                type: string;
                description: string;
                items: {
                    type: string;
                    description: string;
                };
            };
            description: string;
        };
    };
    description: string;
};
