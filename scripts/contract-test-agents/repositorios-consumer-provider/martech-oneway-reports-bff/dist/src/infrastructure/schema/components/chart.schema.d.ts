export declare const chartDataSchema: {
    type: string;
    required: string[];
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
        backgroundColor: {
            type: string;
            items: {
                type: string;
                pattern: string;
            };
            minItems: number;
            description: string;
        };
        secondaryBackgroundColor: {
            type: string;
            items: {
                type: string;
                pattern: string;
            };
            description: string;
        };
    };
    description: string;
};
export declare const chartVariationCaptionDataItemSchema: {
    type: string;
    additionalProperties: boolean;
    properties: {
        value: {
            type: string;
            description: string;
        };
        color: {
            type: string;
            oneOf: ({
                type: string;
                pattern: string;
                const?: undefined;
            } | {
                type: string;
                const: string;
                pattern?: undefined;
            })[];
            description: string;
        };
        measure: {
            type: string;
            description: string;
        };
    };
    description: string;
};
export declare const chartVariationCaptionSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        title: {
            type: string;
            description: string;
        };
        data: {
            oneOf: ({
                type: string;
                additionalProperties: boolean;
                properties: {
                    value: {
                        type: string;
                        description: string;
                    };
                    color: {
                        type: string;
                        oneOf: ({
                            type: string;
                            pattern: string;
                            const?: undefined;
                        } | {
                            type: string;
                            const: string;
                            pattern?: undefined;
                        })[];
                        description: string;
                    };
                    measure: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
            } | {
                type: string;
                items: {
                    type: string;
                    additionalProperties: boolean;
                    properties: {
                        value: {
                            type: string;
                            description: string;
                        };
                        color: {
                            type: string;
                            oneOf: ({
                                type: string;
                                pattern: string;
                                const?: undefined;
                            } | {
                                type: string;
                                const: string;
                                pattern?: undefined;
                            })[];
                            description: string;
                        };
                        measure: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                description: string;
            })[];
            description: string;
        };
    };
    description: string;
};
export declare const chartDatasetSchema: {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
        data: {
            oneOf: ({
                type: string;
                items: {
                    type: string;
                };
                description: string;
            } | {
                type: string;
                description: string;
                items?: undefined;
            })[];
        };
        type: {
            type: string;
            enum: string[];
            description: string;
        };
        label: {
            type: string;
            description: string;
        };
        borderColor: {
            oneOf: {
                type: string;
                pattern: string;
            }[];
            description: string;
        };
        backgroundColor: {
            oneOf: ({
                type: string;
                items: {
                    oneOf: {
                        type: string;
                        pattern: string;
                    }[];
                };
                oneOf?: undefined;
            } | {
                oneOf: {
                    type: string;
                    pattern: string;
                }[];
                type?: undefined;
                items?: undefined;
            })[];
            description: string;
        };
    };
    description: string;
};
export declare const barChartSchema: {
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
                    data: {
                        oneOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        } | {
                            type: string;
                            description: string;
                            items?: undefined;
                        })[];
                    };
                    type: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    label: {
                        type: string;
                        description: string;
                    };
                    borderColor: {
                        oneOf: {
                            type: string;
                            pattern: string;
                        }[];
                        description: string;
                    };
                    backgroundColor: {
                        oneOf: ({
                            type: string;
                            items: {
                                oneOf: {
                                    type: string;
                                    pattern: string;
                                }[];
                            };
                            oneOf?: undefined;
                        } | {
                            oneOf: {
                                type: string;
                                pattern: string;
                            }[];
                            type?: undefined;
                            items?: undefined;
                        })[];
                        description: string;
                    };
                };
                description: string;
            };
            minItems: number;
            description: string;
        };
        type: {
            type: string;
            const: string;
            description: string;
        };
        comparison_unit_of_measure: {
            type: string;
            description: string;
        };
        labels_type: {
            type: string;
            description: string;
        };
        formatted_data: {
            type: string;
            description: string;
        };
        labels: {
            type: string;
            items: {
                type: string;
            };
            description: string;
        };
        variation_caption: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    title: {
                        type: string;
                        description: string;
                    };
                    data: {
                        oneOf: ({
                            type: string;
                            additionalProperties: boolean;
                            properties: {
                                value: {
                                    type: string;
                                    description: string;
                                };
                                color: {
                                    type: string;
                                    oneOf: ({
                                        type: string;
                                        pattern: string;
                                        const?: undefined;
                                    } | {
                                        type: string;
                                        const: string;
                                        pattern?: undefined;
                                    })[];
                                    description: string;
                                };
                                measure: {
                                    type: string;
                                    description: string;
                                };
                            };
                            description: string;
                        } | {
                            type: string;
                            items: {
                                type: string;
                                additionalProperties: boolean;
                                properties: {
                                    value: {
                                        type: string;
                                        description: string;
                                    };
                                    color: {
                                        type: string;
                                        oneOf: ({
                                            type: string;
                                            pattern: string;
                                            const?: undefined;
                                        } | {
                                            type: string;
                                            const: string;
                                            pattern?: undefined;
                                        })[];
                                        description: string;
                                    };
                                    measure: {
                                        type: string;
                                        description: string;
                                    };
                                };
                                description: string;
                            };
                            description: string;
                        })[];
                        description: string;
                    };
                };
                description: string;
            };
            description: string;
        };
        backgroundColor: {
            type: string;
            items: {
                type: string;
                pattern: string;
            };
            description: string;
        };
        big_number: {
            type: string;
            description: string;
        };
    };
    description: string;
};
export declare const lineChartSchema: {
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
                    data: {
                        oneOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        } | {
                            type: string;
                            description: string;
                            items?: undefined;
                        })[];
                    };
                    type: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    label: {
                        type: string;
                        description: string;
                    };
                    borderColor: {
                        oneOf: {
                            type: string;
                            pattern: string;
                        }[];
                        description: string;
                    };
                    backgroundColor: {
                        oneOf: ({
                            type: string;
                            items: {
                                oneOf: {
                                    type: string;
                                    pattern: string;
                                }[];
                            };
                            oneOf?: undefined;
                        } | {
                            oneOf: {
                                type: string;
                                pattern: string;
                            }[];
                            type?: undefined;
                            items?: undefined;
                        })[];
                        description: string;
                    };
                };
                description: string;
            };
            description: string;
        };
        type: {
            type: string;
            const: string;
            description: string;
        };
        labels_type: {
            type: string;
            description: string;
        };
        referencialUnitMeasure: {
            type: string;
            description: string;
        };
        comparison_unit_of_measure: {
            type: string;
            description: string;
        };
        formatted_data: {
            type: string;
            description: string;
        };
        labels: {
            type: string;
            items: {
                type: string;
            };
            description: string;
        };
        variation_caption: {
            type: string;
            items: {
                type: string;
                required: string[];
                additionalProperties: boolean;
                properties: {
                    title: {
                        type: string;
                        description: string;
                    };
                    data: {
                        oneOf: ({
                            type: string;
                            additionalProperties: boolean;
                            properties: {
                                value: {
                                    type: string;
                                    description: string;
                                };
                                color: {
                                    type: string;
                                    oneOf: ({
                                        type: string;
                                        pattern: string;
                                        const?: undefined;
                                    } | {
                                        type: string;
                                        const: string;
                                        pattern?: undefined;
                                    })[];
                                    description: string;
                                };
                                measure: {
                                    type: string;
                                    description: string;
                                };
                            };
                            description: string;
                        } | {
                            type: string;
                            items: {
                                type: string;
                                additionalProperties: boolean;
                                properties: {
                                    value: {
                                        type: string;
                                        description: string;
                                    };
                                    color: {
                                        type: string;
                                        oneOf: ({
                                            type: string;
                                            pattern: string;
                                            const?: undefined;
                                        } | {
                                            type: string;
                                            const: string;
                                            pattern?: undefined;
                                        })[];
                                        description: string;
                                    };
                                    measure: {
                                        type: string;
                                        description: string;
                                    };
                                };
                                description: string;
                            };
                            description: string;
                        })[];
                        description: string;
                    };
                };
                description: string;
            };
            description: string;
        };
        backgroundColor: {
            type: string;
            items: {
                type: string;
                pattern: string;
            };
            description: string;
        };
    };
    description: string;
};
