export declare const bigNumberPeriodSchema: {
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
    description: string;
};
export declare const bigNumberValueSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        value: {
            oneOf: {
                type: string;
            }[];
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
export declare const bigNumberComparisonSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        number: {
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
export declare const bigNumberSecondaryInfoSchema: {
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
            description: string;
        };
    };
    description: string;
};
export declare const bigNumberDemographicSchema: {
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
export declare const bigNumberDataItemSchema: {
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
                    oneOf: {
                        type: string;
                    }[];
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
                    description: string;
                };
            };
            description: string;
        };
    };
    description: string;
};
export declare const bigNumberSparkLineChartSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        chartTitle: {
            type: string;
            minLength: number;
            description: string;
        };
        chartPeriod: {
            type: string;
            description: string;
        };
        bigNumberData: {
            type: string;
            items: {
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
                                oneOf: {
                                    type: string;
                                }[];
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
                                description: string;
                            };
                        };
                        description: string;
                    };
                };
                description: string;
            };
            minItems: number;
            description: string;
        };
        chartLineData: {
            type: string;
            items: {
                type: string;
            };
            description: string;
        };
    };
    description: string;
};
