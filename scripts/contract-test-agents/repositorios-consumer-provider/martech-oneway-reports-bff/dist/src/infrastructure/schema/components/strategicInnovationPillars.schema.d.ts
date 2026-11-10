export declare const portfolioHealthBigNumberComparisonNumberSchema: {
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
    description: string;
};
export declare const portfolioHealthBigNumberComparisonSchema: {
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
        number: {
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
            description: string;
        };
    };
    description: string;
};
export declare const portfolioHealthBigNumberDataItemSchema: {
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
                number: {
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
                    description: string;
                };
            };
            description: string;
        };
    };
    description: string;
};
export declare const portfolioHealthBigNumberItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
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
                            number: {
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
    };
    description: string;
};
export declare const portfolioHealthLegendItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        label: {
            type: string;
            description: string;
        };
    };
    description: string;
};
export declare const portfolioHealthSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        id: {
            type: string;
            description: string;
        };
        period: {
            type: string;
            pattern: string;
            description: string;
        };
        bigNumbers: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
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
                                        number: {
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
                };
                description: string;
            };
            minItems: number;
            description: string;
        };
        legend: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    label: {
                        type: string;
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
export declare const strategicInnovationPillarBigNumberDataItemSchema: {
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
                color: {
                    type: string;
                    pattern: string;
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
export declare const strategicInnovationPillarBigNumberSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        id: {
            type: string;
            description: string;
        };
        period: {
            type: string;
            description: string;
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
                            color: {
                                type: string;
                                pattern: string;
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
            minItems: number;
            description: string;
        };
    };
    description: string;
};
export declare const strategicInnovationPillarChartDatasetSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        label: {
            type: string;
            description: string;
        };
        data: {
            type: string;
            items: {
                type: string;
            };
            minItems: number;
            description: string;
        };
        formattedData: {
            type: string;
            items: {
                type: string;
            };
            minItems: number;
            description: string;
        };
        backgroundColor: {
            type: string;
            pattern: string;
            description: string;
        };
    };
    description: string;
};
export declare const strategicInnovationPillarChartConnectorSchema: {
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
            description: string;
        };
        to: {
            type: string;
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
            enum: readonly ["pp", "%", "hl", "number"];
            description: string;
        };
    };
    description: string;
};
export declare const strategicInnovationPillarChartComparisonLineDataItemSchema: {
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
        color: {
            type: string;
            pattern: string;
            description: string;
        };
    };
    description: string;
};
export declare const strategicInnovationPillarChartComparisonLineSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        title: {
            type: string;
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
                        type: string;
                        description: string;
                    };
                    measure: {
                        type: string;
                        enum: readonly ["pp", "%", "hl", "number"];
                        description: string;
                    };
                    color: {
                        type: string;
                        pattern: string;
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
export declare const strategicInnovationPillarChartSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        datasets: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    label: {
                        type: string;
                        description: string;
                    };
                    data: {
                        type: string;
                        items: {
                            type: string;
                        };
                        minItems: number;
                        description: string;
                    };
                    formattedData: {
                        type: string;
                        items: {
                            type: string;
                        };
                        minItems: number;
                        description: string;
                    };
                    backgroundColor: {
                        type: string;
                        pattern: string;
                        description: string;
                    };
                };
                description: string;
            };
            minItems: number;
            description: string;
        };
        labels: {
            type: string;
            items: {
                type: string;
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
                    description: string;
                };
                to: {
                    type: string;
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
                    enum: readonly ["pp", "%", "hl", "number"];
                    description: string;
                };
            };
            description: string;
        };
        comparisonLine: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                title: {
                    type: string;
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
                                type: string;
                                description: string;
                            };
                            measure: {
                                type: string;
                                enum: readonly ["pp", "%", "hl", "number"];
                                description: string;
                            };
                            color: {
                                type: string;
                                pattern: string;
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
    };
    description: string;
};
export declare const strategicInnovationPillarChartSectionSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        bigNumber: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                period: {
                    type: string;
                    description: string;
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
                                    color: {
                                        type: string;
                                        pattern: string;
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
                    minItems: number;
                    description: string;
                };
            };
            description: string;
        };
        chart: {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                datasets: {
                    type: string;
                    items: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            label: {
                                type: string;
                                description: string;
                            };
                            data: {
                                type: string;
                                items: {
                                    type: string;
                                };
                                minItems: number;
                                description: string;
                            };
                            formattedData: {
                                type: string;
                                items: {
                                    type: string;
                                };
                                minItems: number;
                                description: string;
                            };
                            backgroundColor: {
                                type: string;
                                pattern: string;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    minItems: number;
                    description: string;
                };
                labels: {
                    type: string;
                    items: {
                        type: string;
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
                            description: string;
                        };
                        to: {
                            type: string;
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
                            enum: readonly ["pp", "%", "hl", "number"];
                            description: string;
                        };
                    };
                    description: string;
                };
                comparisonLine: {
                    type: string;
                    required: string[];
                    additionalProperties: boolean;
                    properties: {
                        title: {
                            type: string;
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
                                        type: string;
                                        description: string;
                                    };
                                    measure: {
                                        type: string;
                                        enum: readonly ["pp", "%", "hl", "number"];
                                        description: string;
                                    };
                                    color: {
                                        type: string;
                                        pattern: string;
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
            };
            description: string;
        };
    };
    description: string;
};
export declare const portfolioPillarItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        id: {
            type: string;
            const: string;
            description: string;
        };
        health: {
            oneOf: ({
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    period: {
                        type: string;
                        pattern: string;
                        description: string;
                    };
                    bigNumbers: {
                        type: string;
                        items: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
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
                                                    number: {
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
                            };
                            description: string;
                        };
                        minItems: number;
                        description: string;
                    };
                    legend: {
                        type: string;
                        items: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                label: {
                                    type: string;
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
            } | {
                type: string;
                additionalProperties: boolean;
                properties: {};
                description: string;
            })[];
            description: string;
        };
        noticeMessage: {
            type: string;
            description: string;
        };
    };
    description: string;
};
export declare const otherPillarItemSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        id: {
            type: string;
            enum: string[];
            description: string;
        };
        headerColor: {
            type: string;
            pattern: string;
            description: string;
        };
        chartSection: {
            description: string;
            type: string;
            additionalProperties: boolean;
            properties: {
                bigNumber: {
                    type: string;
                    required: string[];
                    additionalProperties: boolean;
                    properties: {
                        id: {
                            type: string;
                            description: string;
                        };
                        period: {
                            type: string;
                            description: string;
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
                                            color: {
                                                type: string;
                                                pattern: string;
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
                            minItems: number;
                            description: string;
                        };
                    };
                    description: string;
                };
                chart: {
                    type: string;
                    required: string[];
                    additionalProperties: boolean;
                    properties: {
                        datasets: {
                            type: string;
                            items: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    label: {
                                        type: string;
                                        description: string;
                                    };
                                    data: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                        minItems: number;
                                        description: string;
                                    };
                                    formattedData: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                        minItems: number;
                                        description: string;
                                    };
                                    backgroundColor: {
                                        type: string;
                                        pattern: string;
                                        description: string;
                                    };
                                };
                                description: string;
                            };
                            minItems: number;
                            description: string;
                        };
                        labels: {
                            type: string;
                            items: {
                                type: string;
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
                                    description: string;
                                };
                                to: {
                                    type: string;
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
                                    enum: readonly ["pp", "%", "hl", "number"];
                                    description: string;
                                };
                            };
                            description: string;
                        };
                        comparisonLine: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                title: {
                                    type: string;
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
                                                type: string;
                                                description: string;
                                            };
                                            measure: {
                                                type: string;
                                                enum: readonly ["pp", "%", "hl", "number"];
                                                description: string;
                                            };
                                            color: {
                                                type: string;
                                                pattern: string;
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
                    };
                    description: string;
                };
            };
        };
        noticeMessage: {
            type: string;
            description: string;
        };
    };
    description: string;
};
export declare const strategicInnovationPillarItemSchema: {
    oneOf: ({
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
            id: {
                type: string;
                const: string;
                description: string;
            };
            health: {
                oneOf: ({
                    type: string;
                    required: string[];
                    additionalProperties: boolean;
                    properties: {
                        id: {
                            type: string;
                            description: string;
                        };
                        period: {
                            type: string;
                            pattern: string;
                            description: string;
                        };
                        bigNumbers: {
                            type: string;
                            items: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
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
                                                        number: {
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
                                };
                                description: string;
                            };
                            minItems: number;
                            description: string;
                        };
                        legend: {
                            type: string;
                            items: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    label: {
                                        type: string;
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
                } | {
                    type: string;
                    additionalProperties: boolean;
                    properties: {};
                    description: string;
                })[];
                description: string;
            };
            noticeMessage: {
                type: string;
                description: string;
            };
        };
        description: string;
    } | {
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
            id: {
                type: string;
                enum: string[];
                description: string;
            };
            headerColor: {
                type: string;
                pattern: string;
                description: string;
            };
            chartSection: {
                description: string;
                type: string;
                additionalProperties: boolean;
                properties: {
                    bigNumber: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            period: {
                                type: string;
                                description: string;
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
                                                color: {
                                                    type: string;
                                                    pattern: string;
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
                                minItems: number;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    chart: {
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            datasets: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        label: {
                                            type: string;
                                            description: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                            minItems: number;
                                            description: string;
                                        };
                                        formattedData: {
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                            minItems: number;
                                            description: string;
                                        };
                                        backgroundColor: {
                                            type: string;
                                            pattern: string;
                                            description: string;
                                        };
                                    };
                                    description: string;
                                };
                                minItems: number;
                                description: string;
                            };
                            labels: {
                                type: string;
                                items: {
                                    type: string;
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
                                        description: string;
                                    };
                                    to: {
                                        type: string;
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
                                        enum: readonly ["pp", "%", "hl", "number"];
                                        description: string;
                                    };
                                };
                                description: string;
                            };
                            comparisonLine: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    title: {
                                        type: string;
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
                                                    type: string;
                                                    description: string;
                                                };
                                                measure: {
                                                    type: string;
                                                    enum: readonly ["pp", "%", "hl", "number"];
                                                    description: string;
                                                };
                                                color: {
                                                    type: string;
                                                    pattern: string;
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
                        };
                        description: string;
                    };
                };
            };
            noticeMessage: {
                type: string;
                description: string;
            };
        };
        description: string;
    })[];
    description: string;
};
export declare const strategicInnovationPillarsArraySchema: {
    type: string;
    items: {
        oneOf: ({
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                id: {
                    type: string;
                    const: string;
                    description: string;
                };
                health: {
                    oneOf: ({
                        type: string;
                        required: string[];
                        additionalProperties: boolean;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            period: {
                                type: string;
                                pattern: string;
                                description: string;
                            };
                            bigNumbers: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
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
                                                            number: {
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
                                    };
                                    description: string;
                                };
                                minItems: number;
                                description: string;
                            };
                            legend: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        label: {
                                            type: string;
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
                    } | {
                        type: string;
                        additionalProperties: boolean;
                        properties: {};
                        description: string;
                    })[];
                    description: string;
                };
                noticeMessage: {
                    type: string;
                    description: string;
                };
            };
            description: string;
        } | {
            type: string;
            required: string[];
            additionalProperties: boolean;
            properties: {
                id: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                headerColor: {
                    type: string;
                    pattern: string;
                    description: string;
                };
                chartSection: {
                    description: string;
                    type: string;
                    additionalProperties: boolean;
                    properties: {
                        bigNumber: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                id: {
                                    type: string;
                                    description: string;
                                };
                                period: {
                                    type: string;
                                    description: string;
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
                                                    color: {
                                                        type: string;
                                                        pattern: string;
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
                                    minItems: number;
                                    description: string;
                                };
                            };
                            description: string;
                        };
                        chart: {
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                datasets: {
                                    type: string;
                                    items: {
                                        type: string;
                                        required: string[];
                                        additionalProperties: boolean;
                                        properties: {
                                            label: {
                                                type: string;
                                                description: string;
                                            };
                                            data: {
                                                type: string;
                                                items: {
                                                    type: string;
                                                };
                                                minItems: number;
                                                description: string;
                                            };
                                            formattedData: {
                                                type: string;
                                                items: {
                                                    type: string;
                                                };
                                                minItems: number;
                                                description: string;
                                            };
                                            backgroundColor: {
                                                type: string;
                                                pattern: string;
                                                description: string;
                                            };
                                        };
                                        description: string;
                                    };
                                    minItems: number;
                                    description: string;
                                };
                                labels: {
                                    type: string;
                                    items: {
                                        type: string;
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
                                            description: string;
                                        };
                                        to: {
                                            type: string;
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
                                            enum: readonly ["pp", "%", "hl", "number"];
                                            description: string;
                                        };
                                    };
                                    description: string;
                                };
                                comparisonLine: {
                                    type: string;
                                    required: string[];
                                    additionalProperties: boolean;
                                    properties: {
                                        title: {
                                            type: string;
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
                                                        type: string;
                                                        description: string;
                                                    };
                                                    measure: {
                                                        type: string;
                                                        enum: readonly ["pp", "%", "hl", "number"];
                                                        description: string;
                                                    };
                                                    color: {
                                                        type: string;
                                                        pattern: string;
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
                            };
                            description: string;
                        };
                    };
                };
                noticeMessage: {
                    type: string;
                    description: string;
                };
            };
            description: string;
        })[];
        description: string;
    };
    minItems: number;
    description: string;
};
export declare const strategicInnovationPillarsSchema: {
    oneOf: {
        type: string;
        items: {
            oneOf: ({
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    id: {
                        type: string;
                        const: string;
                        description: string;
                    };
                    health: {
                        oneOf: ({
                            type: string;
                            required: string[];
                            additionalProperties: boolean;
                            properties: {
                                id: {
                                    type: string;
                                    description: string;
                                };
                                period: {
                                    type: string;
                                    pattern: string;
                                    description: string;
                                };
                                bigNumbers: {
                                    type: string;
                                    items: {
                                        type: string;
                                        required: string[];
                                        additionalProperties: boolean;
                                        properties: {
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
                                                                number: {
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
                                        };
                                        description: string;
                                    };
                                    minItems: number;
                                    description: string;
                                };
                                legend: {
                                    type: string;
                                    items: {
                                        type: string;
                                        required: string[];
                                        additionalProperties: boolean;
                                        properties: {
                                            label: {
                                                type: string;
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
                        } | {
                            type: string;
                            additionalProperties: boolean;
                            properties: {};
                            description: string;
                        })[];
                        description: string;
                    };
                    noticeMessage: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
            } | {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    id: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    headerColor: {
                        type: string;
                        pattern: string;
                        description: string;
                    };
                    chartSection: {
                        description: string;
                        type: string;
                        additionalProperties: boolean;
                        properties: {
                            bigNumber: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    id: {
                                        type: string;
                                        description: string;
                                    };
                                    period: {
                                        type: string;
                                        description: string;
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
                                                        color: {
                                                            type: string;
                                                            pattern: string;
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
                                        minItems: number;
                                        description: string;
                                    };
                                };
                                description: string;
                            };
                            chart: {
                                type: string;
                                required: string[];
                                additionalProperties: boolean;
                                properties: {
                                    datasets: {
                                        type: string;
                                        items: {
                                            type: string;
                                            required: string[];
                                            additionalProperties: boolean;
                                            properties: {
                                                label: {
                                                    type: string;
                                                    description: string;
                                                };
                                                data: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                    minItems: number;
                                                    description: string;
                                                };
                                                formattedData: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                    minItems: number;
                                                    description: string;
                                                };
                                                backgroundColor: {
                                                    type: string;
                                                    pattern: string;
                                                    description: string;
                                                };
                                            };
                                            description: string;
                                        };
                                        minItems: number;
                                        description: string;
                                    };
                                    labels: {
                                        type: string;
                                        items: {
                                            type: string;
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
                                                description: string;
                                            };
                                            to: {
                                                type: string;
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
                                                enum: readonly ["pp", "%", "hl", "number"];
                                                description: string;
                                            };
                                        };
                                        description: string;
                                    };
                                    comparisonLine: {
                                        type: string;
                                        required: string[];
                                        additionalProperties: boolean;
                                        properties: {
                                            title: {
                                                type: string;
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
                                                            type: string;
                                                            description: string;
                                                        };
                                                        measure: {
                                                            type: string;
                                                            enum: readonly ["pp", "%", "hl", "number"];
                                                            description: string;
                                                        };
                                                        color: {
                                                            type: string;
                                                            pattern: string;
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
                                };
                                description: string;
                            };
                        };
                    };
                    noticeMessage: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
            })[];
            description: string;
        };
        minItems: number;
        description: string;
    }[];
    description: string;
};
