export declare const bigNumberSimpleSchema: {
    type: string;
    description: string;
};
export declare const bigNumberComplexSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        title: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
        };
        measure: {
            type: string;
            description: string;
        };
        tooltipContent: {
            type: string;
            description: string;
            items: {
                type: string;
            };
        };
        empty: {
            type: string;
            description: string;
        };
        bigNumber: {
            type: string;
            description: string;
        };
        bigNumberUnit: {
            type: string;
            description: string;
        };
        bigNumberDirection: {
            type: string;
            enum: readonly ["up", "down", "neutral"];
            description: string;
        };
        bigNumberColor: {
            type: string;
            pattern: string;
            description: string;
        };
        variation: {
            type: string;
            description: string;
        };
        variationMeasure: {
            type: string;
            description: string;
        };
        variationDirection: {
            type: string;
            description: string;
        };
        versus: {
            type: string;
            description: string;
        };
        total: {
            type: string;
            description: string;
        };
        totalPrefix: {
            type: string;
            description: string;
        };
        totalMeasure: {
            type: string;
            description: string;
        };
        totalLabel: {
            type: string;
            description: string;
        };
        totalUnitOfMeasureLabel: {
            type: string;
            description: string;
        };
        period: {
            type: string;
            description: string;
        };
        divider: {
            type: string;
            description: string;
        };
        titleSize: {
            type: string;
            enum: readonly ["H2", "H3", "H4", "H5"];
            description: string;
        };
        dateRefresh: {
            type: string;
            description: string;
        };
        lastEstimated: {
            type: string;
            description: string;
        };
        unavailable: {
            type: string;
            description: string;
        };
    };
    oneOf: ({
        not: {
            anyOf: {
                required: string[];
            }[];
        };
        required?: undefined;
        properties?: undefined;
    } | {
        required: string[];
        properties: {
            empty: {
                const: boolean;
            };
            unavailable?: undefined;
        };
        not?: undefined;
    } | {
        required: string[];
        properties: {
            unavailable: {
                const: boolean;
            };
            empty?: undefined;
        };
        not?: undefined;
    })[];
};
export declare const bigNumberEmptySchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        title: {
            type: string;
            minLength: number;
            maxLength: number;
        };
        empty: {
            type: string;
            const: boolean;
        };
    };
    description: string;
};
export declare const bigNumberUnavailableSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        title: {
            type: string;
            minLength: number;
            maxLength: number;
        };
        unavailable: {
            type: string;
            const: boolean;
        };
    };
    description: string;
};
