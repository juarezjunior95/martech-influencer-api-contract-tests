import { JSONSchema4 } from 'json-schema';

export const brandRankingGlobalCountrySchema: JSONSchema4 = {
  type: 'object',
  required: ['ranking'],
  properties: {
    ranking: {
      type: 'object',
      required: ['datasets', 'labels'],
      properties: {
        datasets: {
          type: 'array',
          items: [
            {
              type: 'object',
              required: ['data'],
              properties: {
                data: {
                  type: 'array',
                  items: { type: 'number' },
                  minItems: 1,
                },
              },
            },
            {
              type: 'object',
              required: ['unitMeasure'],
              properties: {
                unitMeasure: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 1,
                },
              },
            },
            {
              type: 'object',
              required: ['source'],
              properties: {
                source: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 1,
                },
              },
            },
          ],
        },
        labels: {
          type: 'array',
          items: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: { type: 'string' },
              },
            ],
          },
          minItems: 1,
        },
        variation_caption: {
          type: 'object',
          required: ['title', 'subtitle', 'variationsRows'],
          properties: {
            title: { type: 'string' },
            subtitle: { type: 'string' },
            variationsRows: {
              type: 'object',
              required: ['kpi'],
              properties: {
                kpi: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['variationsGroup'],
                        properties: {
                          variationsGroup: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: [
                                'variation',
                                'direction',
                                'unit_of_measure',
                              ],
                              properties: {
                                variation: { type: 'number' },
                                direction: {
                                  type: 'string',
                                  enum: ['up', 'down', 'neutral'],
                                },
                                unit_of_measure: { type: 'string' },
                              },
                            },
                            minItems: 1,
                          },
                        },
                      },
                      minItems: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
