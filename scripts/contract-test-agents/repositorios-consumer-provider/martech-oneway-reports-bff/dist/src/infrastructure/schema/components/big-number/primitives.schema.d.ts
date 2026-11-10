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
export declare const bigNumberValueSchema: {
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
export declare const bigNumberPeriodSchema: {
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
export declare const bigNumberComparisonSchema: {
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
