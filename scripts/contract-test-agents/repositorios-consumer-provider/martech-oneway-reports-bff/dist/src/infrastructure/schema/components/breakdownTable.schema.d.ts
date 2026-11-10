export declare const columnConfigSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        lastColGroup: {
            type: string;
            description: string;
        };
        intermediateColGroup: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    initial: {
                        type: string;
                        minimum: number;
                        multipleOf: number;
                        description: string;
                    };
                    final: {
                        type: string;
                        minimum: number;
                        multipleOf: number;
                        description: string;
                    };
                };
            };
            description: string;
        };
        merge: {
            type: string;
            description: string;
        };
    };
};
export declare const columnChildSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        headerName: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        field: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        minWidth: {
            type: string;
            minimum: number;
            description: string;
        };
        maxWidth: {
            type: string;
            minimum: number;
            description: string;
        };
        headerClass: {
            type: string;
            items: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            description: string;
        };
        config: {
            type: string;
            additionalProperties: boolean;
            properties: {
                lastColGroup: {
                    type: string;
                    description: string;
                };
                intermediateColGroup: {
                    type: string;
                    items: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            initial: {
                                type: string;
                                minimum: number;
                                multipleOf: number;
                                description: string;
                            };
                            final: {
                                type: string;
                                minimum: number;
                                multipleOf: number;
                                description: string;
                            };
                        };
                    };
                    description: string;
                };
                merge: {
                    type: string;
                    description: string;
                };
            };
        };
    };
};
export declare const headerGroupComponentParamsSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        icon: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        subtitle: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        dateEndStorageKey: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
    };
};
export declare const columnDefSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        headerName: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        headerClass: {
            type: string;
            items: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            description: string;
        };
        headerGroupComponentParams: {
            type: string;
            additionalProperties: boolean;
            properties: {
                icon: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
                subtitle: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
                dateEndStorageKey: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                };
            };
        };
        children: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    headerName: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                    field: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                    minWidth: {
                        type: string;
                        minimum: number;
                        description: string;
                    };
                    maxWidth: {
                        type: string;
                        minimum: number;
                        description: string;
                    };
                    headerClass: {
                        type: string;
                        items: {
                            type: string;
                            minLength: number;
                            maxLength: number;
                        };
                        description: string;
                    };
                    config: {
                        type: string;
                        additionalProperties: boolean;
                        properties: {
                            lastColGroup: {
                                type: string;
                                description: string;
                            };
                            intermediateColGroup: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        initial: {
                                            type: string;
                                            minimum: number;
                                            multipleOf: number;
                                            description: string;
                                        };
                                        final: {
                                            type: string;
                                            minimum: number;
                                            multipleOf: number;
                                            description: string;
                                        };
                                    };
                                };
                                description: string;
                            };
                            merge: {
                                type: string;
                                description: string;
                            };
                        };
                    };
                };
            };
            minItems: number;
            description: string;
        };
    };
};
export declare const chartConfigSchema: {
    type: string;
    properties: {
        merge: {
            type: string;
            description: string;
        };
        chartData: {
            type: string;
            items: {
                type: string;
            };
            description: string;
        };
        chartLabel: {
            type: string;
            items: {
                type: string;
            };
            description: string;
        };
    };
};
export declare const cellConfigSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        unitMeasure: {
            type: string;
            maxLength: number;
            description: string;
        };
        textAlign: {
            type: string;
            enum: readonly ["left", "center", "right"];
            description: string;
        };
        mergeCol: {
            type: string;
            description: string;
        };
        merge: {
            type: string;
            minimum: number;
            description: string;
        };
        variationDirection: {
            type: string;
            enum: readonly ["up", "down", "neutral"];
            description: string;
        };
        textWeight: {
            type: string;
            maxLength: number;
            description: string;
        };
        backgroundColorCode: {
            type: string;
            pattern: string;
            description: string;
        };
        chartData: {
            type: string;
            items: {
                type: string;
            };
            description: string;
        };
        chartLabel: {
            type: string;
            items: {
                type: string;
                maxLength: number;
            };
            description: string;
        };
    };
};
export declare const rowDataItemSchema: {
    type: string;
    description: string;
    patternProperties: {
        "^group_\\d+_\\d+$": {
            oneOf: {
                type: string;
            }[];
            description: string;
        };
        "^group_\\d+_\\d+_config$": {
            type: string;
            additionalProperties: boolean;
            properties: {
                unitMeasure: {
                    type: string;
                    maxLength: number;
                    description: string;
                };
                textAlign: {
                    type: string;
                    enum: readonly ["left", "center", "right"];
                    description: string;
                };
                mergeCol: {
                    type: string;
                    description: string;
                };
                merge: {
                    type: string;
                    minimum: number;
                    description: string;
                };
                variationDirection: {
                    type: string;
                    enum: readonly ["up", "down", "neutral"];
                    description: string;
                };
                textWeight: {
                    type: string;
                    maxLength: number;
                    description: string;
                };
                backgroundColorCode: {
                    type: string;
                    pattern: string;
                    description: string;
                };
                chartData: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                chartLabel: {
                    type: string;
                    items: {
                        type: string;
                        maxLength: number;
                    };
                    description: string;
                };
            };
        };
    };
};
export declare const breakdownTableDataSchema: {
    type: string;
    required: string[];
    properties: {
        columnDefs: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    headerName: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                    };
                    headerClass: {
                        type: string;
                        items: {
                            type: string;
                            minLength: number;
                            maxLength: number;
                        };
                        description: string;
                    };
                    headerGroupComponentParams: {
                        type: string;
                        additionalProperties: boolean;
                        properties: {
                            icon: {
                                type: string;
                                minLength: number;
                                maxLength: number;
                                description: string;
                            };
                            subtitle: {
                                type: string;
                                minLength: number;
                                maxLength: number;
                                description: string;
                            };
                            dateEndStorageKey: {
                                type: string;
                                minLength: number;
                                maxLength: number;
                                description: string;
                            };
                        };
                    };
                    children: {
                        type: string;
                        items: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                headerName: {
                                    type: string;
                                    minLength: number;
                                    maxLength: number;
                                    description: string;
                                };
                                field: {
                                    type: string;
                                    minLength: number;
                                    maxLength: number;
                                    description: string;
                                };
                                minWidth: {
                                    type: string;
                                    minimum: number;
                                    description: string;
                                };
                                maxWidth: {
                                    type: string;
                                    minimum: number;
                                    description: string;
                                };
                                headerClass: {
                                    type: string;
                                    items: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                    };
                                    description: string;
                                };
                                config: {
                                    type: string;
                                    additionalProperties: boolean;
                                    properties: {
                                        lastColGroup: {
                                            type: string;
                                            description: string;
                                        };
                                        intermediateColGroup: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                additionalProperties: boolean;
                                                properties: {
                                                    initial: {
                                                        type: string;
                                                        minimum: number;
                                                        multipleOf: number;
                                                        description: string;
                                                    };
                                                    final: {
                                                        type: string;
                                                        minimum: number;
                                                        multipleOf: number;
                                                        description: string;
                                                    };
                                                };
                                            };
                                            description: string;
                                        };
                                        merge: {
                                            type: string;
                                            description: string;
                                        };
                                    };
                                };
                            };
                        };
                        minItems: number;
                        description: string;
                    };
                };
            };
            minItems: number;
            description: string;
        };
        rowData: {
            type: string;
            items: {
                type: string;
                description: string;
                patternProperties: {
                    "^group_\\d+_\\d+$": {
                        oneOf: {
                            type: string;
                        }[];
                        description: string;
                    };
                    "^group_\\d+_\\d+_config$": {
                        type: string;
                        additionalProperties: boolean;
                        properties: {
                            unitMeasure: {
                                type: string;
                                maxLength: number;
                                description: string;
                            };
                            textAlign: {
                                type: string;
                                enum: readonly ["left", "center", "right"];
                                description: string;
                            };
                            mergeCol: {
                                type: string;
                                description: string;
                            };
                            merge: {
                                type: string;
                                minimum: number;
                                description: string;
                            };
                            variationDirection: {
                                type: string;
                                enum: readonly ["up", "down", "neutral"];
                                description: string;
                            };
                            textWeight: {
                                type: string;
                                maxLength: number;
                                description: string;
                            };
                            backgroundColorCode: {
                                type: string;
                                pattern: string;
                                description: string;
                            };
                            chartData: {
                                type: string;
                                items: {
                                    type: string;
                                };
                                description: string;
                            };
                            chartLabel: {
                                type: string;
                                items: {
                                    type: string;
                                    maxLength: number;
                                };
                                description: string;
                            };
                        };
                    };
                };
            };
            minItems: number;
            description: string;
        };
    };
    description: string;
};
