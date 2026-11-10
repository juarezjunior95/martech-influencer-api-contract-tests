import { JSONSchema4 } from 'json-schema';

export const chartDataSchema = {
  type: 'object',
  required: ['data', 'variation', 'backgroundColor', 'chartUnitMeasure'],
  properties: {
    data: {
      type: 'array',
      items: { type: 'number' },
      minItems: 1,
    },
    variation: { type: 'number' },
    backgroundColor: { type: 'string' },
    chartUnitMeasure: { type: 'string' },
  },
  additionalProperties: false,
};

interface TableSchemaProps {
  rowProperties?: Record<string, any>;
}

export const tableSchema = ({
  rowProperties = {},
}: TableSchemaProps = {}): JSONSchema4 => ({
  type: 'object',
  required: ['rows', 'header'],
  properties: {
    rows: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: {},
            ...rowProperties,
          },
          additionalProperties: true,
        },
      },
    },
    header: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          id: { type: 'string' },
          children: {
            type: 'array',
            items: {
              type: 'object',
              required: ['title', 'id'],
              properties: {
                title: { type: 'string' },
                id: { type: 'string' },
              },
              additionalProperties: true,
            },
          },
        },
        additionalProperties: true,
      },
    },
    filtersOptions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['group', 'values'],
        properties: {
          group: { type: 'string' },
          values: {
            type: 'array',
            items: {
              type: 'object',
              required: ['value', 'label'],
              properties: {
                value: {
                  oneOf: [
                    { type: 'string' },
                    { type: 'number' },
                    { type: 'null' },
                  ],
                },
                label: {
                  oneOf: [
                    { type: 'string' },
                    { type: 'number' },
                    { type: 'null' },
                  ],
                },
                isDisabled: { type: 'boolean' },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
});
