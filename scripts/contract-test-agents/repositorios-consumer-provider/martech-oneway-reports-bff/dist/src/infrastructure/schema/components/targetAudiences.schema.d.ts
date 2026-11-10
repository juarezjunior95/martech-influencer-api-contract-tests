export declare const targetAudiencesBigNumberDataItemSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
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
                trend: {
                    type: string;
                    enum: string[];
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
export declare const targetAudiencesSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        title: {
            type: string;
            minLength: number;
            description: string;
        };
        description: {
            type: string;
            description: string;
        };
        period: {
            type: string;
            description: string;
        };
        bigNumberData: {
            type: string;
            items: {
                type: string;
                additionalProperties: boolean;
                properties: {
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
                            trend: {
                                type: string;
                                enum: string[];
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
            minItems: number;
            maxItems: number;
            description: string;
        };
    };
    description: string;
};
