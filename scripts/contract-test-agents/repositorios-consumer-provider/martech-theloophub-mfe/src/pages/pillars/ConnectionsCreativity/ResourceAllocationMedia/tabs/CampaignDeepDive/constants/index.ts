import { ChartLegendItem } from 'components';

const CAMPAIGN_COLORS = {
  CAMPAIGN_WOA: '#F7EFBB',
  CAMPAIGN_QWOA_LAYER: '#E5B611',
  MEGABRANDS: '#E5B611',
  EXPANSION: '#C2346A',
  SUSTAIN: '#2F74AA',
  TAIL: '#4E579F',
} as const;

export const MAX_LENGTH_FOR_TOOLTIP = 20;

export const CAMPAIGN_TRACKER_LEGEND: ChartLegendItem[] = [
  {
    label: 'Campaign WOA',
    shape: 'pill',
    size: 'large',
    color: CAMPAIGN_COLORS.CAMPAIGN_WOA,
    decoration: 'none',
    border: true,
  },
  {
    label: 'Campaign QWOA',
    shape: 'pill',
    decoration: 'layer',
    layerColor: CAMPAIGN_COLORS.CAMPAIGN_QWOA_LAYER,
    size: 'large',
    color: CAMPAIGN_COLORS.CAMPAIGN_WOA,
  },
  {
    label: 'Megabrands',
    shape: 'square',
    decoration: 'none',
    size: 'large',
    color: CAMPAIGN_COLORS.MEGABRANDS,
    border: true,
  },
  {
    label: 'Expansion',
    shape: 'square',
    decoration: 'none',
    size: 'large',
    color: CAMPAIGN_COLORS.EXPANSION,
    border: true,
  },
  {
    label: 'Sustain',
    shape: 'square',
    decoration: 'none',
    size: 'large',
    color: CAMPAIGN_COLORS.SUSTAIN,
    border: true,
  },
  {
    label: 'Tail',
    shape: 'square',
    decoration: 'none',
    size: 'large',
    color: CAMPAIGN_COLORS.TAIL,
    border: true,
  },
];

export const CAMPAIGN_TRACKER_ROW_HEIGHT = 36;

export const BFF_VIEW_ID =
  'connections-and-creativity_resource-allocation-media_campaign-deep-dive_campaigns-performance';
