import { JSONSchema4 } from 'json-schema';

export const leagueChampionsSchema: JSONSchema4 = {
  type: 'array',
  items: {
    type: 'object',
    required: ['label', 'rank'],
    properties: {
      label: {
        type: 'string',
      },
      rank: {
        type: 'array',
        items: {
          type: 'object',
          required: ['countryName', 'position', 'value', 'flag', 'measure'],
          properties: {
            countryName: {
              type: 'string',
            },
            position: {
              type: 'string',
            },
            value: {
              type: 'number',
            },
            flag: {
              type: 'string',
            },
            measure: {
              type: 'string',
            },
          },
        },
        minItems: 1,
      },
    },
  },
  minItems: 1,
};
