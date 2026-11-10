import { HEX_COLOR_PATTERN, UNIT_OF_MEASURE } from "../constants/enums";

export const portfolioHealthBigNumberComparisonNumberSchema = {
  type: "object",
  required: ["value", "measure", "trend"],
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      description: "Formatted numeric value (e.g., '1.1', '-0.5', '-')",
    },
    measure: {
      type: "string",
      enum: UNIT_OF_MEASURE,
      description: "Unit of measure for the comparison number (%, pp, etc)",
    },
    trend: {
      type: "string",
      enum: ["positive", "negative", "neutral"],
      description: "Trend indicator based on direction",
    },
  },
  description: "Comparison number within portfolio health big number",
};

export const portfolioHealthBigNumberComparisonSchema = {
  type: "object",
  required: ["label", "value", "number"],
  additionalProperties: false,
  properties: {
    label: {
      type: "string",
      description: "Comparison label (e.g., 'vs')",
    },
    value: {
      type: "string",
      description: "Comparison period value (e.g., 'Jul'24')",
    },
    number: portfolioHealthBigNumberComparisonNumberSchema,
  },
  description: "Comparison object within portfolio health big number",
};

export const portfolioHealthBigNumberDataItemSchema = {
  type: "object",
  required: ["bigNumber", "comparison"],
  additionalProperties: false,
  properties: {
    bigNumber: {
      type: "object",
      required: ["value"],
      additionalProperties: false,
      properties: {
        value: {
          type: "string",
          description: "Formatted numeric value (e.g., '85.4', '77.7', '-')",
        },
      },
    },
    comparison: portfolioHealthBigNumberComparisonSchema,
  },
  description: "Single data item within portfolio health big number",
};

export const portfolioHealthBigNumberItemSchema = {
  type: "object",
  required: ["data"],
  additionalProperties: false,
  properties: {
    data: {
      type: "array",
      items: portfolioHealthBigNumberDataItemSchema,
      minItems: 1,
      description: "Array of data items for this big number",
    },
  },
  description: "Single big number item within portfolio health",
};

export const portfolioHealthLegendItemSchema = {
  type: "object",
  required: ["label"],
  additionalProperties: false,
  properties: {
    label: {
      type: "string",
      description: "Legend label (e.g., 'Innovation', 'Mature')",
    },
  },
  description: "Single legend item",
};

export const portfolioHealthSchema = {
  type: "object",
  required: ["id", "period", "bigNumbers", "legend"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      description: "Health section identifier",
    },
    period: {
      type: "string",
      pattern: String.raw`^H[12]'\d{2}$`,
      description: "Formatted period string (e.g., 'H1'25', 'H2'25')",
    },
    bigNumbers: {
      type: "array",
      items: portfolioHealthBigNumberItemSchema,
      minItems: 1,
      description:
        "Array of big number items (one for each type: innovation, mature, etc)",
    },
    legend: {
      type: "array",
      items: portfolioHealthLegendItemSchema,
      minItems: 1,
      description: "Array of legend items",
    },
  },
  description: "Portfolio health section with PHI metrics",
};

// ==================== CHART SECTION SCHEMAS (for other pillars) ====================

export const strategicInnovationPillarBigNumberDataItemSchema = {
  type: "object",
  required: ["bigNumber", "comparison"],
  additionalProperties: false,
  properties: {
    bigNumber: {
      type: "object",
      required: ["value", "measure", "color"],
      additionalProperties: false,
      properties: {
        value: {
          type: "string",
          description: "Formatted numeric value (e.g., '11.1', '-23.4', '-')",
        },
        measure: {
          type: "string",
          enum: UNIT_OF_MEASURE,
          description: "Unit of measure for the big number (%, pp, etc)",
        },
        color: {
          type: "string",
          pattern: HEX_COLOR_PATTERN,
          description:
            "Color code in hexadecimal format (e.g., '#007800', '#FF0000')",
        },
      },
    },
    comparison: {
      type: "object",
      required: ["label", "value"],
      additionalProperties: false,
      properties: {
        label: {
          type: "string",
          description: "Comparison label (e.g., 'vs')",
        },
        value: {
          type: "string",
          description: "Comparison period value (e.g., 'Dec'23')",
        },
      },
    },
  },
  description: "Single data item within a big number's data array",
};

export const strategicInnovationPillarBigNumberSchema = {
  type: "object",
  required: ["id", "period", "data"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      description: "Big number identifier",
    },
    period: {
      type: "string",
      description: "Formatted period string (e.g., 'Dec'24')",
    },
    data: {
      type: "array",
      items: strategicInnovationPillarBigNumberDataItemSchema,
      minItems: 1,
      description: "Array of data items for this big number",
    },
  },
  description: "Big number section within a chart section",
};

export const strategicInnovationPillarChartDatasetSchema = {
  type: "object",
  required: ["label", "data", "backgroundColor"],
  additionalProperties: false,
  properties: {
    label: {
      type: "string",
      description: "Dataset label (e.g., 'Dataset 1')",
    },
    data: {
      type: "array",
      items: { type: "number" },
      minItems: 1,
      description: "Array of numeric values for chart data points",
    },
    formattedData: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      description: "Array of formatted numeric values for chart data points",
    },
    backgroundColor: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Background color in hexadecimal format",
    },
  },
  description: "Chart dataset structure",
};

export const strategicInnovationPillarChartConnectorSchema = {
  type: "object",
  required: ["value", "from", "to", "backgroundColor", "textColor", "measure"],
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      description: "Connector value (e.g., 2947.0, -3609.9)",
    },
    from: {
      type: "string",
      description: "Source period label (e.g., '2022')",
    },
    to: {
      type: "string",
      description: "Target period label (e.g., '2023')",
    },
    backgroundColor: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Connector background color in hexadecimal format",
    },
    textColor: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Connector text color in hexadecimal format",
    },
    measure: {
      type: "string",
      enum: UNIT_OF_MEASURE,
      description: "Unit of measure for the connector value",
    },
  },
  description: "Chart connector between periods",
};

export const strategicInnovationPillarChartComparisonLineDataItemSchema = {
  type: "object",
  required: ["value"],
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      description: "Comparison value (e.g., '26.6', '-100.0', '-')",
    },
    measure: {
      type: "string",
      enum: UNIT_OF_MEASURE,
      description: "Unit of measure for the comparison value",
    },
    color: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Color for the comparison value in hexadecimal format",
    },
  },
  description: "Single data item in comparison line",
};

export const strategicInnovationPillarChartComparisonLineSchema = {
  type: "object",
  required: ["title", "data"],
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      description: "Comparison line title (e.g., 'vs LY')",
    },
    data: {
      type: "array",
      items: strategicInnovationPillarChartComparisonLineDataItemSchema,
      minItems: 1,
      description: "Array of comparison line data items",
    },
  },
  description: "Chart comparison line structure",
};

export const strategicInnovationPillarChartSchema = {
  type: "object",
  required: ["datasets", "labels", "connector", "comparisonLine"],
  additionalProperties: false,
  properties: {
    datasets: {
      type: "array",
      items: strategicInnovationPillarChartDatasetSchema,
      minItems: 1,
      description: "Array of chart datasets",
    },
    labels: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      description: "Array of period labels (e.g., ['2022', '2023'])",
    },
    connector: strategicInnovationPillarChartConnectorSchema,
    comparisonLine: strategicInnovationPillarChartComparisonLineSchema,
  },
  description: "Chart section within a pillar",
};

export const strategicInnovationPillarChartSectionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bigNumber: strategicInnovationPillarBigNumberSchema,
    chart: strategicInnovationPillarChartSchema,
  },
  description: "Chart section containing big number and chart",
};

// Portfolio Pillar Schema (different structure with health)
export const portfolioPillarItemSchema = {
  type: "object",
  required: ["id", "health"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      const: "portfolio",
      description: "Portfolio pillar identifier",
    },
    health: {
      oneOf: [
        portfolioHealthSchema,
        {
          type: "object",
          additionalProperties: false,
          properties: {},
          description: "Empty health object when no data available",
        },
      ],
      description: "Health section with PHI metrics or empty object",
    },
    noticeMessage: {
      type: "string",
      description:
        "Notice message displayed when data is not available for this country",
    },
  },
  description: "Portfolio pillar with health metrics",
};

// Other Pillars Schema (packPrice, renovation, newOpportunities)
export const otherPillarItemSchema = {
  type: "object",
  required: ["id", "headerColor", "chartSection"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      enum: ["packPrice", "renovation", "newOpportunities"],
      description: "Pillar identifier",
    },
    headerColor: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Header color in hexadecimal format",
    },
    chartSection: {
      ...strategicInnovationPillarChartSectionSchema,
      description: "Chart section with big number and chart data",
    },
    noticeMessage: {
      type: "string",
      description:
        "Notice message displayed when data is not available for this country (only for renovation pillar)",
    },
  },
  description: "Strategic innovation pillar (non-portfolio) with chart section",
};

export const strategicInnovationPillarItemSchema = {
  oneOf: [portfolioPillarItemSchema, otherPillarItemSchema],
  description: "Single strategic innovation pillar item (portfolio or other)",
};

export const strategicInnovationPillarsArraySchema = {
  type: "array",
  items: strategicInnovationPillarItemSchema,
  minItems: 1,
  description: "Array of strategic innovation pillars",
};

export const strategicInnovationPillarsSchema = {
  oneOf: [strategicInnovationPillarsArraySchema],
  description:
    "Strategic innovation pillars data - can be either an array of pillars or an empty state",
};
