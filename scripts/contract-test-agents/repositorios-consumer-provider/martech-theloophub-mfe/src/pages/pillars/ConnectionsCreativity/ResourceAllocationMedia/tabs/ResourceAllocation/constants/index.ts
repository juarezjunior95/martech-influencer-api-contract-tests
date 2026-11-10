export const radioOptions = {
  kpiFilter: {
    default: {
      value: 'BU',
    },
    values: [
      {
        value: 'BU',
        label: 'vs BU',
      },
      {
        value: 'LY',
        label: 'vs LY',
      },
    ],
  },
};

export const CAPTION_COLUMN_WIDTH_PX = 138;

export const BACKGROUND_COLORS_AC = ['#C9AF82', '#70C6FF', '#EBB400'];
export const BACKGROUND_COLORS_BU = ['#E2D4BB', '#99D6FF', '#FFDE70'];

const LEGEND_COLORS = ['#C9AF82', '#70C6FF', '#EBB400'];

export const caption = [
  {
    label: 'NWM',
    color: LEGEND_COLORS[0],
    pointStyle: 'roundedRectangle',
    fontWeight: 'medium',
  },
  {
    label: 'Sponsorship & Activations',
    color: LEGEND_COLORS[1],
    pointStyle: 'roundedRectangle',
    fontWeight: 'medium',
  },
  {
    label: 'Media',
    color: LEGEND_COLORS[2],
    pointStyle: 'roundedRectangle',
    fontWeight: 'medium',
  },
];

export const borderRadius = [
  [
    { topLeft: 8, topRight: 0, bottomRight: 0, bottomLeft: 8 },
    { topLeft: 8, topRight: 0, bottomRight: 0, bottomLeft: 8 },
  ],
  [
    { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
    { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
  ],
  [
    { topLeft: 0, topRight: 8, bottomRight: 8, bottomLeft: 0 },
    { topLeft: 0, topRight: 8, bottomRight: 8, bottomLeft: 0 },
  ],
];

export const BFF_VIEW_ID =
  'connections-and-creativity_resource-allocation-media_resource-allocation_bar-charts-country';
