export declare const volumeBigNumberDataItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        bigNumber: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                value: {
                    type: string;
                    description: string;
                };
                measure: {
                    type: string;
                    enum: readonly ["pp", "%", "hl", "number"];
                    description: string;
                };
                trend: {
                    type: string;
                    enum: string[];
                    description: string;
                };
            };
        };
        secondaryInfo: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                value: {
                    type: string;
                    description: string;
                };
                label: {
                    type: string;
                    description: string;
                };
            };
            description: string;
        };
        comparison: {
            type: string;
            required: string[];
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
        };
    };
    description: string;
};
export declare const volumeBigNumberCardSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        period_type: {
            type: string;
            description: string;
        };
        header: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                title: {
                    type: string;
                    description: string;
                };
                measure: {
                    type: string;
                    description: string;
                };
            };
        };
        data: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    bigNumber: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            value: {
                                type: string;
                                description: string;
                            };
                            measure: {
                                type: string;
                                enum: readonly ["pp", "%", "hl", "number"];
                                description: string;
                            };
                            trend: {
                                type: string;
                                enum: string[];
                                description: string;
                            };
                        };
                    };
                    secondaryInfo: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            value: {
                                type: string;
                                description: string;
                            };
                            label: {
                                type: string;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    comparison: {
                        type: string;
                        required: string[];
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
                    };
                };
                description: string;
            };
            description: string;
        };
    };
    description: string;
};
export declare const volumeBigNumbersArraySchema: {
    type: string;
    items: {
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
            period_type: {
                type: string;
                description: string;
            };
            header: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    title: {
                        type: string;
                        description: string;
                    };
                    measure: {
                        type: string;
                        description: string;
                    };
                };
            };
            data: {
                type: string;
                items: {
                    type: string;
                    required: string[];
                    additionalProperties: boolean;
                    properties: {
                        bigNumber: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                value: {
                                    type: string;
                                    description: string;
                                };
                                measure: {
                                    type: string;
                                    enum: readonly ["pp", "%", "hl", "number"];
                                    description: string;
                                };
                                trend: {
                                    type: string;
                                    enum: string[];
                                    description: string;
                                };
                            };
                        };
                        secondaryInfo: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                value: {
                                    type: string;
                                    description: string;
                                };
                                label: {
                                    type: string;
                                    description: string;
                                };
                            };
                            description: string;
                        };
                        comparison: {
                            type: string;
                            required: string[];
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
                        };
                    };
                    description: string;
                };
                description: string;
            };
        };
        description: string;
    };
    minItems: number;
    maxItems: number;
    description: string;
};
export declare const volumeBigNumbersSchema: {
    anyOf: {
        type: string;
        items: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                period_type: {
                    type: string;
                    description: string;
                };
                header: {
                    type: string;
                    required: string[];
                    additionalProperties: boolean;
                    properties: {
                        title: {
                            type: string;
                            description: string;
                        };
                        measure: {
                            type: string;
                            description: string;
                        };
                    };
                };
                data: {
                    type: string;
                    items: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            bigNumber: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    value: {
                                        type: string;
                                        description: string;
                                    };
                                    measure: {
                                        type: string;
                                        enum: readonly ["pp", "%", "hl", "number"];
                                        description: string;
                                    };
                                    trend: {
                                        type: string;
                                        enum: string[];
                                        description: string;
                                    };
                                };
                            };
                            secondaryInfo: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    value: {
                                        type: string;
                                        description: string;
                                    };
                                    label: {
                                        type: string;
                                        description: string;
                                    };
                                };
                                description: string;
                            };
                            comparison: {
                                type: string;
                                required: string[];
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
                            };
                        };
                        description: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
        minItems: number;
        maxItems: number;
        description: string;
    }[];
    description: string;
};
