export { bigNumberDataSchema as increaseParticipationBigNumberDataItemSchema } from "./big-number";
export declare const increaseParticipationSparkLineSchema: {
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
            minItems: number;
            maxItems: number;
            description: string;
        };
        chartLineData: {
            type: string;
            items: {
                type: string;
            };
            minItems: number;
            description: string;
        };
    };
    description: string;
};
