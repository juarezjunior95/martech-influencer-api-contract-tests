export declare const comparisonLineDataItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        value: {
            type: string[];
            description: string;
        };
        measure: {
            type: string;
            oneOf: ({
                enum: readonly ["pp", "%", "hl", "number"];
                const?: undefined;
            } | {
                const: string;
                enum?: undefined;
            })[];
            description: string;
        };
        color: {
            type: string;
            oneOf: ({
                pattern: string;
                const?: undefined;
            } | {
                const: string;
                pattern?: undefined;
            })[];
            description: string;
        };
        trend: {
            type: string;
            enum: string[];
            description: string;
        };
    };
    description: string;
};
export declare const comparisonLineSchema: {
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
        data: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    value: {
                        type: string[];
                        description: string;
                    };
                    measure: {
                        type: string;
                        oneOf: ({
                            enum: readonly ["pp", "%", "hl", "number"];
                            const?: undefined;
                        } | {
                            const: string;
                            enum?: undefined;
                        })[];
                        description: string;
                    };
                    color: {
                        type: string;
                        oneOf: ({
                            pattern: string;
                            const?: undefined;
                        } | {
                            const: string;
                            pattern?: undefined;
                        })[];
                        description: string;
                    };
                    trend: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                };
                description: string;
            };
            minItems: number;
            description: string;
        };
    };
    description: string;
};
export declare const brandImageSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        mainBrand: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                src: {
                    type: string;
                    description: string;
                };
                alt: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
            };
            description: string;
        };
        title: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        badgeFlag: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                src: {
                    type: string;
                    description: string;
                };
                alt: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
            };
            description: string;
        };
    };
    description: string;
};
export declare const connectorSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        value: {
            type: string;
            description: string;
        };
        from: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        to: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        backgroundColor: {
            type: string;
            pattern: string;
            description: string;
        };
        textColor: {
            type: string;
            pattern: string;
            description: string;
        };
        measure: {
            type: string;
            oneOf: ({
                enum: readonly ["pp", "%", "hl", "number"];
                const?: undefined;
            } | {
                const: string;
                enum?: undefined;
            })[];
            description: string;
        };
    };
    description: string;
};
export declare const clickableIndexesSchemaItem: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        index: {
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
export declare const waterfallDataSchema: {
    type: string;
    anyOf: {
        required: string[];
    }[];
    additionalProperties: boolean;
    properties: {
        data: {
            type: string;
            items: {
                type: string;
            };
            minItems: number;
            description: string;
        };
        values: {
            type: string;
            items: {
                type: string;
            };
            minItems: number;
            description: string;
        };
        labels: {
            type: string;
            items: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            minItems: number;
            description: string;
        };
        comparisonLineData: {
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
                    data: {
                        type: string;
                        items: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                value: {
                                    type: string[];
                                    description: string;
                                };
                                measure: {
                                    type: string;
                                    oneOf: ({
                                        enum: readonly ["pp", "%", "hl", "number"];
                                        const?: undefined;
                                    } | {
                                        const: string;
                                        enum?: undefined;
                                    })[];
                                    description: string;
                                };
                                color: {
                                    type: string;
                                    oneOf: ({
                                        pattern: string;
                                        const?: undefined;
                                    } | {
                                        const: string;
                                        pattern?: undefined;
                                    })[];
                                    description: string;
                                };
                                trend: {
                                    type: string;
                                    enum: string[];
                                    description: string;
                                };
                            };
                            description: string;
                        };
                        minItems: number;
                        description: string;
                    };
                };
                description: string;
            };
            description: string;
        };
        comparisonLine: {
            type: string;
            additionalProperties: boolean;
            properties: {
                data: {
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
                            data: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        value: {
                                            type: string[];
                                            description: string;
                                        };
                                        measure: {
                                            type: string;
                                            oneOf: ({
                                                enum: readonly ["pp", "%", "hl", "number"];
                                                const?: undefined;
                                            } | {
                                                const: string;
                                                enum?: undefined;
                                            })[];
                                            description: string;
                                        };
                                        color: {
                                            type: string;
                                            oneOf: ({
                                                pattern: string;
                                                const?: undefined;
                                            } | {
                                                const: string;
                                                pattern?: undefined;
                                            })[];
                                            description: string;
                                        };
                                        trend: {
                                            type: string;
                                            enum: string[];
                                            description: string;
                                        };
                                    };
                                    description: string;
                                };
                                minItems: number;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
        brandsImg: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    mainBrand: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            src: {
                                type: string;
                                description: string;
                            };
                            alt: {
                                type: string;
                                minLength: number;
                                maxLength: number;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    title: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                    badgeFlag: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            src: {
                                type: string;
                                description: string;
                            };
                            alt: {
                                type: string;
                                minLength: number;
                                maxLength: number;
                                description: string;
                            };
                        };
                        description: string;
                    };
                };
                description: string;
            };
            description: string;
        };
        images: {
            type: string;
            additionalProperties: boolean;
            properties: {
                data: {
                    type: string;
                    items: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            mainBrand: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    src: {
                                        type: string;
                                        description: string;
                                    };
                                    alt: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        description: string;
                                    };
                                };
                                description: string;
                            };
                            title: {
                                type: string;
                                minLength: number;
                                maxLength: number;
                                description: string;
                            };
                            badgeFlag: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    src: {
                                        type: string;
                                        description: string;
                                    };
                                    alt: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        description: string;
                                    };
                                };
                                description: string;
                            };
                        };
                        description: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
        formattedData: {
            type: string;
            items: {
                type: string;
                items: {
                    type: string[];
                };
            };
            description: string;
        };
        specialIndexes: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                first: {
                    type: string;
                    description: string;
                };
                last: {
                    type: string;
                    description: string;
                };
                retained: {
                    type: string;
                    description: string;
                };
            };
        };
        clickableIndexes: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    index: {
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
            minItems: number;
            description: string;
        };
        connector: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                value: {
                    type: string;
                    description: string;
                };
                from: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
                to: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
                backgroundColor: {
                    type: string;
                    pattern: string;
                    description: string;
                };
                textColor: {
                    type: string;
                    pattern: string;
                    description: string;
                };
                measure: {
                    type: string;
                    oneOf: ({
                        enum: readonly ["pp", "%", "hl", "number"];
                        const?: undefined;
                    } | {
                        const: string;
                        enum?: undefined;
                    })[];
                    description: string;
                };
            };
            description: string;
        };
    };
    description: string;
};
