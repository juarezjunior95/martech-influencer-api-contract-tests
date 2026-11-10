import { BASE_LINE_COLORS } from '../constants/baseLineColors';
import { LegendItem } from '../types';

export interface Legend {
  default: LegendItem[];
  portfolio: LegendItem[];
}

const TRENDING_COLORS = {
  up: '#3CA91E',
  down: '#D62222',
} as const;

const PORTFOLIO_CLASSIFICATION_ITEMS: LegendItem[] = [
  { label: 'Megabrand', shape: 'thinPill', color: BASE_LINE_COLORS.Megabrands },
  { label: 'Sustain', shape: 'square', color: BASE_LINE_COLORS.Sustain },
  { label: 'Expansion', shape: 'square', color: BASE_LINE_COLORS.Expansion },
  { label: 'Tail', shape: 'square', color: BASE_LINE_COLORS.Tail },
];

const buildDeltaItems = (
  upLabel: string,
  downLabel: string = upLabel,
): LegendItem[] => [
  {
    label: upLabel,
    icon: 'TrendingUp',
    shape: 'square',
    color: TRENDING_COLORS.up,
  },
  {
    label: downLabel,
    icon: 'TrendingDown',
    shape: 'square',
    color: TRENDING_COLORS.down,
  },
];

const buildLegend = (deltaItems: LegendItem[]): Legend => ({
  default: deltaItems,
  portfolio: [...deltaItems, ...PORTFOLIO_CLASSIFICATION_ITEMS],
});

export const VOLUME_WATERFALL_LEGEND: Legend = buildLegend(
  buildDeltaItems('Δ Vol.'),
);

export const NR_WATERFALL_LEGEND: Legend = buildLegend(buildDeltaItems('Δ NR'));

export const MARKET_SHARE_WATERFALL_LEGEND: Legend = buildLegend(
  buildDeltaItems('Δ Mrkt. Share'),
);
