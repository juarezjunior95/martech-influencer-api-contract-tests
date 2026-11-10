export declare const kpiValueSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        value: {
            type: string;
            description: string;
        };
        unitOfMeasure: {
            type: string;
            enum: readonly ["pp", "%", "hl", "number"];
            description: string;
        };
        direction: {
            type: string;
            enum: readonly ["up", "down", "neutral"];
            description: string;
        };
    };
};
export declare const kpiRowSchema: {
    type: string;
    required: string[];
    properties: {
        label: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
    };
    patternProperties: {
        "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
            oneOf: ({
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    value: {
                        type: string;
                        description: string;
                    };
                    unitOfMeasure: {
                        type: string;
                        enum: readonly ["pp", "%", "hl", "number"];
                        description: string;
                    };
                    direction: {
                        type: string;
                        enum: readonly ["up", "down", "neutral"];
                        description: string;
                    };
                };
            } | {
                type: string;
            })[];
            description: string;
        };
    };
    additionalProperties: boolean;
};
export declare const kpiTableSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
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
            minItems: number;
            items: {
                type: string;
                required: string[];
                properties: {
                    label: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                };
                patternProperties: {
                    "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                        oneOf: ({
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                value: {
                                    type: string;
                                    description: string;
                                };
                                unitOfMeasure: {
                                    type: string;
                                    enum: readonly ["pp", "%", "hl", "number"];
                                    description: string;
                                };
                                direction: {
                                    type: string;
                                    enum: readonly ["up", "down", "neutral"];
                                    description: string;
                                };
                            };
                        } | {
                            type: string;
                        })[];
                        description: string;
                    };
                };
                additionalProperties: boolean;
            };
            description: string;
        };
    };
    description: string;
};
export declare const categoryOverviewItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        title: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        versus: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        kpi_name: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        dateRefresh: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        kpi: {
            type: string;
            required: string[];
            additionalProperties: boolean;
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
                    minItems: number;
                    items: {
                        type: string;
                        required: string[];
                        properties: {
                            label: {
                                type: string;
                                minLength: number;
                                maxLength: number;
                                description: string;
                            };
                        };
                        patternProperties: {
                            "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                                oneOf: ({
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        value: {
                                            type: string;
                                            description: string;
                                        };
                                        unitOfMeasure: {
                                            type: string;
                                            enum: readonly ["pp", "%", "hl", "number"];
                                            description: string;
                                        };
                                        direction: {
                                            type: string;
                                            enum: readonly ["up", "down", "neutral"];
                                            description: string;
                                        };
                                    };
                                } | {
                                    type: string;
                                })[];
                                description: string;
                            };
                        };
                        additionalProperties: boolean;
                    };
                    description: string;
                };
            };
            description: string;
        };
        footerInfo: {
            type: string;
            maxLength: number;
            description: string;
        };
        tooltip: {
            type: string;
            maxLength: number;
            description: string;
        };
    };
};
export declare const categoryOverviewArraySchema: {
    type: string;
    items: {
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
            title: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
            };
            versus: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
            };
            kpi_name: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
            };
            dateRefresh: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
            };
            kpi: {
                type: string;
                required: string[];
                additionalProperties: boolean;
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
                        minItems: number;
                        items: {
                            type: string;
                            required: string[];
                            properties: {
                                label: {
                                    type: string;
                                    minLength: number;
                                    maxLength: number;
                                    description: string;
                                };
                            };
                            patternProperties: {
                                "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                                    oneOf: ({
                                        type: string;
                                        required: string[];
                                        additionalProperties: boolean;
                                        properties: {
                                            value: {
                                                type: string;
                                                description: string;
                                            };
                                            unitOfMeasure: {
                                                type: string;
                                                enum: readonly ["pp", "%", "hl", "number"];
                                                description: string;
                                            };
                                            direction: {
                                                type: string;
                                                enum: readonly ["up", "down", "neutral"];
                                                description: string;
                                            };
                                        };
                                    } | {
                                        type: string;
                                    })[];
                                    description: string;
                                };
                            };
                            additionalProperties: boolean;
                        };
                        description: string;
                    };
                };
                description: string;
            };
            footerInfo: {
                type: string;
                maxLength: number;
                description: string;
            };
            tooltip: {
                type: string;
                maxLength: number;
                description: string;
            };
        };
    };
    minItems: number;
    description: string;
};
export declare const categoryOverviewEmptySchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        empty: {
            type: string;
            const: boolean;
            description: string;
        };
    };
};
export declare const categoryOverviewDataSchema: {
    oneOf: ({
        type: string;
        items: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                title: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
                versus: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
                kpi_name: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
                dateRefresh: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
                kpi: {
                    type: string;
                    required: string[];
                    additionalProperties: boolean;
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
                            minItems: number;
                            items: {
                                type: string;
                                required: string[];
                                properties: {
                                    label: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        description: string;
                                    };
                                };
                                patternProperties: {
                                    "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                                        oneOf: ({
                                            type: string;
                                            required: string[];
                                            additionalProperties: boolean;
                                            properties: {
                                                value: {
                                                    type: string;
                                                    description: string;
                                                };
                                                unitOfMeasure: {
                                                    type: string;
                                                    enum: readonly ["pp", "%", "hl", "number"];
                                                    description: string;
                                                };
                                                direction: {
                                                    type: string;
                                                    enum: readonly ["up", "down", "neutral"];
                                                    description: string;
                                                };
                                            };
                                        } | {
                                            type: string;
                                        })[];
                                        description: string;
                                    };
                                };
                                additionalProperties: boolean;
                            };
                            description: string;
                        };
                    };
                    description: string;
                };
                footerInfo: {
                    type: string;
                    maxLength: number;
                    description: string;
                };
                tooltip: {
                    type: string;
                    maxLength: number;
                    description: string;
                };
            };
        };
        minItems: number;
        description: string;
    } | {
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
            empty: {
                type: string;
                const: boolean;
                description: string;
            };
        };
    })[];
    description: string;
};
