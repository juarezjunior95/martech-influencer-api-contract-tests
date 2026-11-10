export declare const portfolioTableHeaderChildSchema: {
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
export declare const portfolioTableHeaderSchema: {
    type: string;
    properties: {
        id: {
            type: string;
            description: string;
        };
        title: {
            type: string;
            description: string;
        };
        subtitle: {
            type: string;
            description: string;
        };
        dateEndStorageKey: {
            type: string;
            description: string;
        };
        children: {
            type: string;
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
    };
};
export declare const brandItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        src: {
            type: string;
            format: string;
            description: string;
        };
        name: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        variation: {
            type: string;
            description: string;
        };
        variationMeasure: {
            type: string;
            maxLength: number;
            description: string;
        };
        variationDirection: {
            type: string;
            enum: readonly ["up", "down", "neutral"];
            description: string;
        };
        country: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
    };
};
export declare const portfolioTableCellValueSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        value: {
            oneOf: {
                type: string;
            }[];
            description: string;
        };
        unitMeasure: {
            type: string;
            maxLength: number;
            description: string;
        };
        variationDirection: {
            type: string;
            pattern: string;
            description: string;
        };
        marginBottom: {
            type: string;
            description: string;
        };
        radiusRight: {
            type: string;
            description: string;
        };
        radiusTop: {
            type: string;
            description: string;
        };
        brands: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    src: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    name: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                    variation: {
                        type: string;
                        description: string;
                    };
                    variationMeasure: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    variationDirection: {
                        type: string;
                        enum: readonly ["up", "down", "neutral"];
                        description: string;
                    };
                    country: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                };
            };
            description: string;
        };
    };
};
export declare const portfolioTableRowSchema: {
    type: string;
    items: {
        type: string;
        description: string;
        patternProperties: {
            "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    value: {
                        oneOf: {
                            type: string;
                        }[];
                        description: string;
                    };
                    unitMeasure: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    variationDirection: {
                        type: string;
                        pattern: string;
                        description: string;
                    };
                    marginBottom: {
                        type: string;
                        description: string;
                    };
                    radiusRight: {
                        type: string;
                        description: string;
                    };
                    radiusTop: {
                        type: string;
                        description: string;
                    };
                    brands: {
                        type: string;
                        items: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                src: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                                name: {
                                    type: string;
                                    minLength: number;
                                    maxLength: number;
                                    description: string;
                                };
                                variation: {
                                    type: string;
                                    description: string;
                                };
                                variationMeasure: {
                                    type: string;
                                    maxLength: number;
                                    description: string;
                                };
                                variationDirection: {
                                    type: string;
                                    enum: readonly ["up", "down", "neutral"];
                                    description: string;
                                };
                                country: {
                                    type: string;
                                    minLength: number;
                                    maxLength: number;
                                    description: string;
                                };
                            };
                        };
                        description: string;
                    };
                };
            };
        };
        additionalProperties: boolean;
    };
    description: string;
};
export declare const portfolioTableSectionSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        header: {
            type: string;
            minItems: number;
            items: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    title: {
                        type: string;
                        description: string;
                    };
                    subtitle: {
                        type: string;
                        description: string;
                    };
                    dateEndStorageKey: {
                        type: string;
                        description: string;
                    };
                    children: {
                        type: string;
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
                };
            };
            description: string;
        };
        rows: {
            type: string;
            items: {
                type: string;
                items: {
                    type: string;
                    description: string;
                    patternProperties: {
                        "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                value: {
                                    oneOf: {
                                        type: string;
                                    }[];
                                    description: string;
                                };
                                unitMeasure: {
                                    type: string;
                                    maxLength: number;
                                    description: string;
                                };
                                variationDirection: {
                                    type: string;
                                    pattern: string;
                                    description: string;
                                };
                                marginBottom: {
                                    type: string;
                                    description: string;
                                };
                                radiusRight: {
                                    type: string;
                                    description: string;
                                };
                                radiusTop: {
                                    type: string;
                                    description: string;
                                };
                                brands: {
                                    type: string;
                                    items: {
                                        type: string;
                                        required: string[];
                                        additionalProperties: boolean;
                                        properties: {
                                            src: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            name: {
                                                type: string;
                                                minLength: number;
                                                maxLength: number;
                                                description: string;
                                            };
                                            variation: {
                                                type: string;
                                                description: string;
                                            };
                                            variationMeasure: {
                                                type: string;
                                                maxLength: number;
                                                description: string;
                                            };
                                            variationDirection: {
                                                type: string;
                                                enum: readonly ["up", "down", "neutral"];
                                                description: string;
                                            };
                                            country: {
                                                type: string;
                                                minLength: number;
                                                maxLength: number;
                                                description: string;
                                            };
                                        };
                                    };
                                    description: string;
                                };
                            };
                        };
                    };
                    additionalProperties: boolean;
                };
                description: string;
            };
            description: string;
        };
    };
    description: string;
};
export declare const portfolioPerformanceTableDataSchema: {
    type: string;
    properties: {
        Portfolio: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                header: {
                    type: string;
                    minItems: number;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            title: {
                                type: string;
                                description: string;
                            };
                            subtitle: {
                                type: string;
                                description: string;
                            };
                            dateEndStorageKey: {
                                type: string;
                                description: string;
                            };
                            children: {
                                type: string;
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
                        };
                    };
                    description: string;
                };
                rows: {
                    type: string;
                    items: {
                        type: string;
                        items: {
                            type: string;
                            description: string;
                            patternProperties: {
                                "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        value: {
                                            oneOf: {
                                                type: string;
                                            }[];
                                            description: string;
                                        };
                                        unitMeasure: {
                                            type: string;
                                            maxLength: number;
                                            description: string;
                                        };
                                        variationDirection: {
                                            type: string;
                                            pattern: string;
                                            description: string;
                                        };
                                        marginBottom: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusRight: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusTop: {
                                            type: string;
                                            description: string;
                                        };
                                        brands: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                additionalProperties: boolean;
                                                properties: {
                                                    src: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variation: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    variationMeasure: {
                                                        type: string;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variationDirection: {
                                                        type: string;
                                                        enum: readonly ["up", "down", "neutral"];
                                                        description: string;
                                                    };
                                                    country: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                };
                                            };
                                            description: string;
                                        };
                                    };
                                };
                            };
                            additionalProperties: boolean;
                        };
                        description: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
        Volume: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                header: {
                    type: string;
                    minItems: number;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            title: {
                                type: string;
                                description: string;
                            };
                            subtitle: {
                                type: string;
                                description: string;
                            };
                            dateEndStorageKey: {
                                type: string;
                                description: string;
                            };
                            children: {
                                type: string;
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
                        };
                    };
                    description: string;
                };
                rows: {
                    type: string;
                    items: {
                        type: string;
                        items: {
                            type: string;
                            description: string;
                            patternProperties: {
                                "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        value: {
                                            oneOf: {
                                                type: string;
                                            }[];
                                            description: string;
                                        };
                                        unitMeasure: {
                                            type: string;
                                            maxLength: number;
                                            description: string;
                                        };
                                        variationDirection: {
                                            type: string;
                                            pattern: string;
                                            description: string;
                                        };
                                        marginBottom: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusRight: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusTop: {
                                            type: string;
                                            description: string;
                                        };
                                        brands: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                additionalProperties: boolean;
                                                properties: {
                                                    src: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variation: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    variationMeasure: {
                                                        type: string;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variationDirection: {
                                                        type: string;
                                                        enum: readonly ["up", "down", "neutral"];
                                                        description: string;
                                                    };
                                                    country: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                };
                                            };
                                            description: string;
                                        };
                                    };
                                };
                            };
                            additionalProperties: boolean;
                        };
                        description: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
        "Net Revenue": {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                header: {
                    type: string;
                    minItems: number;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            title: {
                                type: string;
                                description: string;
                            };
                            subtitle: {
                                type: string;
                                description: string;
                            };
                            dateEndStorageKey: {
                                type: string;
                                description: string;
                            };
                            children: {
                                type: string;
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
                        };
                    };
                    description: string;
                };
                rows: {
                    type: string;
                    items: {
                        type: string;
                        items: {
                            type: string;
                            description: string;
                            patternProperties: {
                                "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        value: {
                                            oneOf: {
                                                type: string;
                                            }[];
                                            description: string;
                                        };
                                        unitMeasure: {
                                            type: string;
                                            maxLength: number;
                                            description: string;
                                        };
                                        variationDirection: {
                                            type: string;
                                            pattern: string;
                                            description: string;
                                        };
                                        marginBottom: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusRight: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusTop: {
                                            type: string;
                                            description: string;
                                        };
                                        brands: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                additionalProperties: boolean;
                                                properties: {
                                                    src: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variation: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    variationMeasure: {
                                                        type: string;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variationDirection: {
                                                        type: string;
                                                        enum: readonly ["up", "down", "neutral"];
                                                        description: string;
                                                    };
                                                    country: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                };
                                            };
                                            description: string;
                                        };
                                    };
                                };
                            };
                            additionalProperties: boolean;
                        };
                        description: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
        "S&M": {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                header: {
                    type: string;
                    minItems: number;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            title: {
                                type: string;
                                description: string;
                            };
                            subtitle: {
                                type: string;
                                description: string;
                            };
                            dateEndStorageKey: {
                                type: string;
                                description: string;
                            };
                            children: {
                                type: string;
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
                        };
                    };
                    description: string;
                };
                rows: {
                    type: string;
                    items: {
                        type: string;
                        items: {
                            type: string;
                            description: string;
                            patternProperties: {
                                "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        value: {
                                            oneOf: {
                                                type: string;
                                            }[];
                                            description: string;
                                        };
                                        unitMeasure: {
                                            type: string;
                                            maxLength: number;
                                            description: string;
                                        };
                                        variationDirection: {
                                            type: string;
                                            pattern: string;
                                            description: string;
                                        };
                                        marginBottom: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusRight: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusTop: {
                                            type: string;
                                            description: string;
                                        };
                                        brands: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                additionalProperties: boolean;
                                                properties: {
                                                    src: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variation: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    variationMeasure: {
                                                        type: string;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variationDirection: {
                                                        type: string;
                                                        enum: readonly ["up", "down", "neutral"];
                                                        description: string;
                                                    };
                                                    country: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                };
                                            };
                                            description: string;
                                        };
                                    };
                                };
                            };
                            additionalProperties: boolean;
                        };
                        description: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
        Brands: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                header: {
                    type: string;
                    minItems: number;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            title: {
                                type: string;
                                description: string;
                            };
                            subtitle: {
                                type: string;
                                description: string;
                            };
                            dateEndStorageKey: {
                                type: string;
                                description: string;
                            };
                            children: {
                                type: string;
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
                        };
                    };
                    description: string;
                };
                rows: {
                    type: string;
                    items: {
                        type: string;
                        items: {
                            type: string;
                            description: string;
                            patternProperties: {
                                "^[a-zA-Z_][a-zA-Z0-9_-]*$": {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        value: {
                                            oneOf: {
                                                type: string;
                                            }[];
                                            description: string;
                                        };
                                        unitMeasure: {
                                            type: string;
                                            maxLength: number;
                                            description: string;
                                        };
                                        variationDirection: {
                                            type: string;
                                            pattern: string;
                                            description: string;
                                        };
                                        marginBottom: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusRight: {
                                            type: string;
                                            description: string;
                                        };
                                        radiusTop: {
                                            type: string;
                                            description: string;
                                        };
                                        brands: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                additionalProperties: boolean;
                                                properties: {
                                                    src: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variation: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    variationMeasure: {
                                                        type: string;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                    variationDirection: {
                                                        type: string;
                                                        enum: readonly ["up", "down", "neutral"];
                                                        description: string;
                                                    };
                                                    country: {
                                                        type: string;
                                                        minLength: number;
                                                        maxLength: number;
                                                        description: string;
                                                    };
                                                };
                                            };
                                            description: string;
                                        };
                                    };
                                };
                            };
                            additionalProperties: boolean;
                        };
                        description: string;
                    };
                    description: string;
                };
            };
            description: string;
        };
    };
    description: string;
};
