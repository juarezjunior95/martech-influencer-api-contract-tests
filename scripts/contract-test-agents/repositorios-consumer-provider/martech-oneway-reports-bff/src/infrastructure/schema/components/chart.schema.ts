import { HEX_COLOR_PATTERN } from "../constants/enums";

export const chartDataSchema = {
  type: "object",
  required: ["data", "backgroundColor"],
  additionalProperties: false,
  properties: {
    data: {
      type: "array",
      items: { type: "number" },
      minItems: 1,
      description: "Array of numeric values for chart data points",
    },
    backgroundColor: {
      type: "array",
      items: {
        type: "string",
        pattern: HEX_COLOR_PATTERN,
      },
      minItems: 1,
      description: "Array of hex colors for chart bars/elements",
    },
    secondaryBackgroundColor: {
      type: "array",
      items: {
        type: "string",
        pattern: HEX_COLOR_PATTERN,
      },
      description: "Array of secondary hex colors (for selected state)",
    },
  },
  description: "Chart data structure with values and colors",
};

/**
 * Schema for variation caption data item
 * Used in variation_caption arrays for charts
 */
export const chartVariationCaptionDataItemSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      description: "Formatted value (e.g., '5.2', '-22.1', '-')",
    },
    color: {
      type: "string",
      oneOf: [
        { type: "string", pattern: HEX_COLOR_PATTERN },
        { type: "string", pattern: "^rgba\\(.*\\)$" },
        { type: "string", const: "" },
      ],
      description: "Color in hexadecimal format, rgba format, or empty string",
    },
    measure: {
      type: "string",
      description: "Unit of measure (e.g., '%', 'pp')",
    },
  },
  description: "Single variation caption data item",
};

/**
 * Schema for variation caption
 * Contains title and array of variation data items
 */
export const chartVariationCaptionSchema = {
  type: "object",
  required: ["title", "data"],
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      description: "Variation caption title (e.g., 'vs LY')",
    },
    data: {
      oneOf: [
        {
          type: "array",
          items: chartVariationCaptionDataItemSchema,
          description: "Array of variation caption data items (can be empty)",
        },
        chartVariationCaptionDataItemSchema,
      ],
      description:
        "Array of variation caption data items or single item object",
    },
  },
  description: "Variation caption structure for charts",
};

/**
 * Schema for chart dataset
 * Used in both bar and line charts
 */
export const chartDatasetSchema = {
  type: "object",
  required: ["data", "type"],
  additionalProperties: true, // Temporarily allow additional properties to debug
  properties: {
    data: {
      oneOf: [
        {
          type: "array",
          items: { type: "number" },
          description:
            "Array of numeric values for chart data points (can be empty)",
        },
        {
          type: "number",
          description:
            "Single numeric value for chart data point (line charts with single point)",
        },
      ],
    },
    type: {
      type: "string",
      enum: ["bar", "line"],
      description: "Chart type",
    },
    label: {
      type: "string",
      description: "Dataset label (e.g., 'Current Year', 'Previous Year')",
    },
    borderColor: {
      oneOf: [
        { type: "string", pattern: HEX_COLOR_PATTERN },
        { type: "string", pattern: "^rgba\\(.*\\)$" },
      ],
      description: "Border color in hex or rgba format",
    },
    backgroundColor: {
      oneOf: [
        {
          type: "array",
          items: {
            oneOf: [
              { type: "string", pattern: HEX_COLOR_PATTERN },
              { type: "string", pattern: "^rgba\\(.*\\)$" },
            ],
          },
        },
        {
          oneOf: [
            { type: "string", pattern: HEX_COLOR_PATTERN },
            { type: "string", pattern: "^rgba\\(.*\\)$" },
          ],
        },
      ],
      description:
        "Background color(s) in hex or rgba format (array for bar, single for line)",
    },
  },
  description: "Chart dataset structure",
};

/**
 * Schema for bar chart
 * Used in Bees Distribution Overview and similar components
 */
export const barChartSchema = {
  type: "object",
  required: ["datasets", "type", "labels"],
  additionalProperties: true, // Temporarily allow additional properties to debug
  properties: {
    datasets: {
      type: "array",
      items: chartDatasetSchema,
      minItems: 1,
      description: "Array of chart datasets",
    },
    type: {
      type: "string",
      const: "bar",
      description: "Chart type (must be 'bar')",
    },
    comparison_unit_of_measure: {
      type: "string",
      description: "Unit of measure for comparison values",
    },
    labels_type: {
      type: "string",
      description: "Type of labels (e.g., 'year_ini', 'months')",
    },
    formatted_data: {
      type: "boolean",
      description: "Whether data is pre-formatted",
    },
    labels: {
      type: "array",
      items: { type: "string" },
      description: "Array of label strings for chart axes (can be empty)",
    },
    variation_caption: {
      type: "array",
      items: chartVariationCaptionSchema,
      description: "Array of variation captions (can be empty)",
    },
    backgroundColor: {
      type: "array",
      items: {
        type: "string",
        pattern: HEX_COLOR_PATTERN,
      },
      description: "Array of background colors in hex format (can be empty)",
    },
    big_number: {
      type: "object",
      description:
        "Big number component data (validated separately with bigNumberComplexSchema)",
    },
  },
  description:
    "Bar chart structure with datasets, labels, and variation captions",
};

/**
 * Schema for line chart
 * Used in Bees Distribution Overview and similar components
 */
export const lineChartSchema = {
  type: "object",
  required: ["datasets", "type", "labels"],
  additionalProperties: false,
  properties: {
    datasets: {
      type: "array",
      items: chartDatasetSchema,
      description: "Array of chart datasets",
    },
    type: {
      type: "string",
      const: "line",
      description: "Chart type (must be 'line')",
    },
    labels_type: {
      type: "string",
      description: "Type of labels (e.g., 'months', 'quarters')",
    },
    referencialUnitMeasure: {
      type: "string",
      description: "Reference unit of measure",
    },
    comparison_unit_of_measure: {
      type: "string",
      description: "Unit of measure for comparison values",
    },
    formatted_data: {
      type: "boolean",
      description: "Whether data is pre-formatted",
    },
    labels: {
      type: "array",
      items: { type: "string" },
      description: "Array of label strings for chart axes",
    },
    variation_caption: {
      type: "array",
      items: chartVariationCaptionSchema,
      description: "Array of variation captions",
    },
    backgroundColor: {
      type: "array",
      items: {
        type: "string",
        pattern: HEX_COLOR_PATTERN,
      },
      description: "Array of background colors in hex format",
    },
  },
  description:
    "Line chart structure with datasets, labels, and variation captions",
};
