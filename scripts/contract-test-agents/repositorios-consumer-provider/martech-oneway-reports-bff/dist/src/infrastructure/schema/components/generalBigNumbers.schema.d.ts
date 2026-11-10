export declare const generalBigNumberDataItemSchema: {
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
export declare const generalBigNumberCardSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
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
export declare const generalBigNumbersArraySchema: {
    type: string;
    items: {
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
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
    description: string;
};
export declare const generalBigNumbersSchema: {
    oneOf: {
        type: string;
        items: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
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
        description: string;
    }[];
    description: string;
};
